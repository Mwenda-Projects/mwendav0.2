/**
 * M-Pesa STK Push API Route for Vercel
 */

import type { VercelRequest, VercelResponse } from "@vercel/node";

interface STKPushRequest {
  phoneNumber: string;
  amount: number;
  accountReference: string;
  transactionDesc: string;
}

interface MpesaTokenResponse {
  access_token: string;
  expires_in: string;
}

interface STKPushResponse {
  MerchantRequestID: string;
  CheckoutRequestID: string;
  ResponseCode: string;
  ResponseDescription: string;
  CustomerMessage: string;
}

// Get OAuth token from Safaricom
async function getAccessToken(): Promise<string> {
  const consumerKey = process.env.MPESA_CONSUMER_KEY;
  const consumerSecret = process.env.MPESA_CONSUMER_SECRET;
  const environment = process.env.VITE_MPESA_ENVIRONMENT || "sandbox";
  
  if (!consumerKey || !consumerSecret) {
    throw new Error("M-Pesa credentials not configured");
  }

  const auth = Buffer.from(`${consumerKey}:${consumerSecret}`).toString("base64");
  
  const baseUrl = environment === "production" 
    ? "https://api.safaricom.co.ke"
    : "https://sandbox.safaricom.co.ke";

  const response = await fetch(
    `${baseUrl}/oauth/v1/generate?grant_type=client_credentials`,
    {
      method: "GET",
      headers: {
        Authorization: `Basic ${auth}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to get M-Pesa access token");
  }

  const data: MpesaTokenResponse = await response.json();
  return data.access_token;
}

function generatePassword(shortcode: string, passkey: string, timestamp: string): string {
  return Buffer.from(`${shortcode}${passkey}${timestamp}`).toString("base64");
}

function generateTimestamp(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const seconds = String(now.getSeconds()).padStart(2, "0");
  
  return `${year}${month}${day}${hours}${minutes}${seconds}`;
}

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { phoneNumber, amount, accountReference, transactionDesc }: STKPushRequest = req.body;

    if (!phoneNumber || !amount) {
      return res.status(400).json({ 
        success: false, 
        error: "Phone number and amount are required" 
      });
    }

    // Match these exactly with your .env and Vercel settings
    const shortcode = process.env.VITE_MPESA_SHORTCODE; 
    const passkey = process.env.VITE_MPESA_PASSKEY;
    const callbackUrl = process.env.VITE_MPESA_CALLBACK_URL;
    const environment = process.env.VITE_MPESA_ENVIRONMENT || "sandbox";

    if (!shortcode || !passkey || !callbackUrl) {
      return res.status(500).json({ 
        success: false, 
        error: "M-Pesa configuration incomplete" 
      });
    }

    const accessToken = await getAccessToken();
    const timestamp = generateTimestamp();
    const password = generatePassword(shortcode, passkey, timestamp);

    const baseUrl = environment === "production" 
      ? "https://api.safaricom.co.ke"
      : "https://sandbox.safaricom.co.ke";

    const stkResponse = await fetch(
      `${baseUrl}/mpesa/stkpush/v1/processrequest`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          BusinessShortCode: shortcode,
          Password: password,
          Timestamp: timestamp,
          TransactionType: "CustomerPayBillOnline",
          Amount: Math.round(amount),
          PartyA: phoneNumber,
          PartyB: shortcode,
          PhoneNumber: phoneNumber,
          CallBackURL: callbackUrl,
          AccountReference: accountReference || "TheMwendaChronicles",
          TransactionDesc: transactionDesc || "Blog Support",
        }),
      }
    );

    const stkData: STKPushResponse = await stkResponse.json();

    if (stkData.ResponseCode === "0") {
      return res.status(200).json({
        success: true,
        message: "STK Push sent successfully",
        checkoutRequestId: stkData.CheckoutRequestID,
        merchantRequestId: stkData.MerchantRequestID,
      });
    } else {
      return res.status(400).json({
        success: false,
        error: stkData.ResponseDescription || "Failed to initiate STK Push",
      });
    }
  } catch (error) {
    console.error("M-Pesa STK Push Error:", error);
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Internal server error",
    });
  }
}