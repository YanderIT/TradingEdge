import { redirect } from "next/navigation";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const locale = searchParams.get("locale") || "en";
  
  // Stripe integration not available
  redirect(`/${locale}?error=stripe_not_available`);
}