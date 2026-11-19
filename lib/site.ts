/** The shop's public address, with no trailing slash. Set NEXT_PUBLIC_SITE_URL once the real domain is live. */
export const SITE = (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/+$/, "");
export const SITE_NAME = "Lace & Luxe";
