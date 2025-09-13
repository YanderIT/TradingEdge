import { redirect } from "next/navigation";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const locale = searchParams.get("locale") || "en";
  
  // Creem integration not available
  redirect(`/${locale}?error=creem_not_available`);
}