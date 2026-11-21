/**
 * Parts of the shop that are built but switched off for now. Nothing here is deleted: to bring one back, set its
 * variable to "on" in the shop's Vercel project (Settings, Environment Variables) and redeploy.
 *
 *  NEXT_PUBLIC_FEATURE_ACCOUNTS         sign-in with a WhatsApp code, the account page, saved addresses
 *  NEXT_PUBLIC_FEATURE_PAY_ON_DELIVERY  "Pay on delivery" at checkout (needs accounts on too, to verify the phone)
 *  NEXT_PUBLIC_FEATURE_MPESA_PROMPT     the M-Pesa prompt (STK push) at checkout
 */
const on = (v: string | undefined) => v === "on";

export const FEATURES = {
  accounts: on(process.env.NEXT_PUBLIC_FEATURE_ACCOUNTS),
  payOnDelivery: on(process.env.NEXT_PUBLIC_FEATURE_PAY_ON_DELIVERY),
  mpesaPrompt: on(process.env.NEXT_PUBLIC_FEATURE_MPESA_PROMPT),
} as const;
