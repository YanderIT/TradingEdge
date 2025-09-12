import { TableColumn } from "@/types/blocks/table";
import TableSlot from "@/components/console/slots/table";
import { Table as TableSlotType } from "@/types/slots/table";
import { getTranslations } from "next-intl/server";
import { setRequestLocale } from "next-intl/server";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";

// Original landing page imports - commented out
// import Branding from "@/components/blocks/branding";
// import CTA from "@/components/blocks/cta";
// import FAQ from "@/components/blocks/faq";
// import Feature from "@/components/blocks/feature";
// import Feature1 from "@/components/blocks/feature1";
// import Feature2 from "@/components/blocks/feature2";
// import Feature3 from "@/components/blocks/feature3";
// import Hero from "@/components/blocks/hero";
// import Pricing from "@/components/blocks/pricing";
// import Showcase from "@/components/blocks/showcase";
// import Stats from "@/components/blocks/stats";
// import Testimonial from "@/components/blocks/testimonial";
// import { getLandingPage } from "@/services/page";

export const revalidate = 60;
export const dynamic = "force-static";
export const dynamicParams = true;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  let canonicalUrl = `${process.env.NEXT_PUBLIC_WEB_URL}`;

  if (locale !== "en") {
    canonicalUrl = `${process.env.NEXT_PUBLIC_WEB_URL}/${locale}`;
  }

  return {
    alternates: {
      canonical: canonicalUrl,
    },
  };
}

export default async function MainPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations();

  // Authentication is now handled by middleware with access keys
  // No OAuth authentication needed here - middleware will redirect to /access-key if needed

  // Mock data for Top Premium
  const topPremiumData = [
    { ticker: "JD", strike: "14.00 [+1%]", exp: "10/18/25", premium: "36%" },
    { ticker: "JD", strike: "27.00 [-3%]", exp: "10/18/25", premium: "150%" },
    { ticker: "RUNE", strike: "420.00 [+2%]", exp: "12/15/25", premium: "302%" },
    { ticker: "ALG", strike: "23.00 [+6%]", exp: "10/17/25", premium: "303%" },
    { ticker: "PG", strike: "11.00 [+1%]", exp: "12/15/25", premium: "98%" },
    { ticker: "ANET", strike: "109.00 [+3%]", exp: "10/17/25", premium: "3.0M" },
    { ticker: "ANET", strike: "179.00 [+6%]", exp: "11/21/25", premium: "6.5M" },
    { ticker: "ALSJ", strike: "22.00 [+6%]", exp: "11/21/25", premium: "534K" },
    { ticker: "ARM", strike: "147.00 [-6%]", exp: "09/12/25", premium: "29%" },
    { ticker: "BITE", strike: "2.00 [+4%]", exp: "10/24/25", premium: "7%" },
    { ticker: "BRX", strike: "190.00 [+4%]", exp: "10/17/25", premium: "596%" },
    { ticker: "CANG", strike: "43.00 [-4%]", exp: "09/12/25", premium: "120%" },
    { ticker: "CRSP", strike: "18.00 [+7%]", exp: "1/16/26", premium: "137%" },
    { ticker: "CORZ", strike: "24.00 [+6%]", exp: "1/16/26", premium: "94%" },
    { ticker: "COST", strike: "865.00 [+1%]", exp: "09/12/25", premium: "8%" },
    { ticker: "CRWY", strike: "130.00 [+1%]", exp: "09/12/25", premium: "5.3M" },
    { ticker: "CRWY", strike: "160.00 [+3%]", exp: "11/21/25", premium: "1.9M" },
    { ticker: "DELL", strike: "136.00 [+1%]", exp: "09/12/25", premium: "190%" },
    { ticker: "DIS", strike: "950.00 [+2%]", exp: "10/17/25", premium: "476%" },
    { ticker: "DOCN", strike: "47.00 [+8%]", exp: "1/16/26", premium: "124%" },
    { ticker: "DDOG", strike: "50.00 [+5%]", exp: "10/17/25", premium: "446K" },
    { ticker: "EDGE", strike: "290.00 [+1%]", exp: "11/21/25", premium: "4.6M" },
    { ticker: "FOUR", strike: "90.00 [+7%]", exp: "10/17/25", premium: "153%" },
    { ticker: "FSLR", strike: "670.00 [+4%]", exp: "09/12/25", premium: "224%" },
    { ticker: "GLD", strike: "340.00 [+4%]", exp: "10/24/25", premium: "667%" },
    { ticker: "GLDX", strike: "35.00 [+3%]", exp: "6/18/26", premium: "1.0M" },
    { ticker: "GOOGL", strike: "256.00 [+1%]", exp: "3/20/26", premium: "127%" },
    { ticker: "GTLB", strike: "52.50 [+7%]", exp: "10/17/25", premium: "972%" },
    { ticker: "HD", strike: "425.00 [+3%]", exp: "09/12/25", premium: "160%" },
    { ticker: "HL", strike: "14.00 [+2%]", exp: "10/17/25", premium: "82%" },
    { ticker: "INTC", strike: "24.00 [+1%]", exp: "10/30/25", premium: "636%" },
    { ticker: "KKR", strike: "41.00 [+3%]", exp: "2/20/26", premium: "662%" },
    { ticker: "LTRX", strike: "5.00 [+7%]", exp: "3/20/26", premium: "127%" },
    { ticker: "MANU", strike: "18.50 [+6%]", exp: "09/19/25", premium: "237%" },
    { ticker: "MSIB", strike: "332.50 [+6%]", exp: "09/19/25", premium: "2.0M" }
  ];

  // Mock data for Top Bullish
  const topBullishData = [
    { ticker: "GLD", strike: "13.50 [+4%]", exp: "10/23/25", premium: "17%" },
    { ticker: "UNH", strike: "313.00 [-7%]", exp: "11/21/25", premium: "97%" },
    { ticker: "TSLA", strike: "335.00 [+6%]", exp: "1/16/26", premium: "54%" },
    { ticker: "GLO", strike: "180.00 [-8%]", exp: "11/21/25", premium: "34%" },
    { ticker: "HOOD", strike: "49.00 [+8%]", exp: "1/16/26", premium: "95%" },
    { ticker: "GME", strike: "27.00 [+1%]", exp: "09/19/25", premium: "155%" },
    { ticker: "BRBY", strike: "32.00 [-3%]", exp: "3/20/26", premium: "10.3M" },
    { ticker: "NVDA", strike: "155.00 [+3%]", exp: "10/24/25", premium: "2.4M" },
    { ticker: "SHOP", strike: "300.00 [+4%]", exp: "12/19/25", premium: "1.0M" },
    { ticker: "TSM", strike: "60.00 [+2%]", exp: "10/17/25", premium: "385%" },
    { ticker: "NET", strike: "200.00 [-4%]", exp: "09/19/25", premium: "1.3M" },
    { ticker: "VXX", strike: "29.00 [+5%]", exp: "10/17/25", premium: "350%" }
  ];

  // Mock data for Top Bearish  
  const topBearishData = [
    { ticker: "FRE", strike: "68.00 [+4%]", exp: "3/20/26", premium: "73M" },
    { ticker: "TTO", strike: "80.00 [-4%]", exp: "12/19/25", premium: "341%" },
    { ticker: "COMP", strike: "90.00 [+4%]", exp: "10/17/25", premium: "4.4M" },
    { ticker: "PYVL", strike: "45.00 [+1%]", exp: "10/24/25", premium: "200%" },
    { ticker: "DIS", strike: "105.00 [+1%]", exp: "10/25/25", premium: "1.2M" },
    { ticker: "RGS", strike: "340.00 [+1%]", exp: "10/25/25", premium: "200%" },
    { ticker: "KEM", strike: "160.00 [+6%]", exp: "10/3/25", premium: "2.6M" },
    { ticker: "CNS", strike: "90.00 [+2%]", exp: "12/19/25", premium: "4.4M" },
    { ticker: "NVT", strike: "105.00 [+1%]", exp: "10/17/25", premium: "1.2M" },
    { ticker: "SOLO", strike: "45.00 [+1%]", exp: "10/25/25", premium: "200%" }
  ];

  // Calls Bought Section
  const callsBoughtData = [
    { ticker: "AAM", strike: "160.00 [+1%]", exp: "10/3/25", premium: "2.6M" },
    { ticker: "CNE", strike: "90.00 [+2%]", exp: "12/19/25", premium: "4.4M" },
    { ticker: "NVT", strike: "105.00 [+1%]", exp: "10/17/25", premium: "1.0M" },
    { ticker: "JOLB", strike: "45.00 [+1%]", exp: "10/24/25", premium: "300K" }
  ];

  // Puts Sold Section
  const putsSoldData = [
    { ticker: "CORZ", strike: "13.50 [+6%]", exp: "10/3/25", premium: "97K" },
    { ticker: "GLD", strike: "313.00 [+7%]", exp: "11/21/25", premium: "57%" },
    { ticker: "GME", strike: "27.00 [+1%]", exp: "9/19/25", premium: "155%" },
    { ticker: "BRBY", strike: "32.00 [-3%]", exp: "3/20/26", premium: "10.3M" }
  ];

  // Puts Bought Section  
  const putsBoughtData = [
    { ticker: "FLT", strike: "68.00 [+4%]", exp: "3/20/26", premium: "73M" },
    { ticker: "TTO", strike: "80.00 [-4%]", exp: "12/19/25", premium: "2.3M" },
    { ticker: "COMP", strike: "90.00 [+4%]", exp: "10/17/25", premium: "4.4M" }
  ];

  // Calls Sold Section
  const callsSoldData = [
    { ticker: "AAM", strike: "160.00 [+1%]", exp: "10/3/25", premium: "2.6M" },
    { ticker: "CNE", strike: "90.00 [+2%]", exp: "12/19/25", premium: "4.4M" },
    { ticker: "NVT", strike: "105.00 [+1%]", exp: "10/17/25", premium: "1.0M" },
    { ticker: "JOLB", strike: "45.00 [+1%]", exp: "10/24/25", premium: "300K" }
  ];

  // Define common columns for all tables
  const commonColumns: TableColumn[] = [
    {
      name: "ticker",
      title: t("trading.table.ticker"),
      callback: (item: any) => (
        <Link
          href={`/${locale}/${item.ticker}`}
          className="text-blue-600 underline decoration-2 underline-offset-2"
        >
          {item.ticker}
        </Link>
      ),
    },
    { name: "strike", title: t("trading.table.strike") },
    { name: "exp", title: t("trading.table.exp") },
    { name: "premium", title: t("trading.table.premium") }
  ];

  // Top Premium table
  const topPremiumTable: TableSlotType = {
    title: "",
    toolbar: {
      items: [
        {
          title: t("trading.refresh"),
          icon: "RiRefreshLine",
          variant: "default",
        },
      ],
    },
    columns: commonColumns,
    data: topPremiumData,
    empty_message: t("trading.no_data"),
  };

 

  // Calls Bought table
  const callsBoughtTable: TableSlotType = {
    title: "Calls Bought",
    columns: commonColumns,
    data: callsBoughtData,
    empty_message: t("trading.no_data"),
    variant: "bullish",
  };

  // Puts Sold table  
  const putsSoldTable: TableSlotType = {
    title: "Puts Sold",
    columns: commonColumns,
    data: putsSoldData,
    empty_message: t("trading.no_data"),
    variant: "bullish",
  };

  // Puts Bought table
  const putsBoughtTable: TableSlotType = {
    title: "Puts Bought",
    columns: commonColumns,
    data: putsBoughtData,
    empty_message: t("trading.no_data"),
    variant: "bearish",
  };

  // Calls Sold table
  const callsSoldTable: TableSlotType = {
    title: "Calls Sold",
    columns: commonColumns,
    data: callsSoldData,
    empty_message: t("trading.no_data"),
    variant: "bearish",
  };

  return (
    <div className="space-y-8">
      {/* Centered Header Section */}
      <div className="text-center space-y-6">
        <h1 className="text-3xl font-bold">Unusual Options Flow</h1>
        
        {/* Date and Search Section */}
        <div className="flex items-center justify-center space-x-8">
          {/* Date Selector */}
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">←</Button>
            <span className="text-sm font-medium px-4 py-2 bg-muted rounded">Sep 10 2025</span>
            <Button variant="outline" size="sm">→</Button>
          </div>
          
          {/* Search Box */}
          <div className="flex items-center space-x-2">
            <Input 
              type="text" 
              placeholder="Symbol..." 
              className="w-64"
            />
            <Button>Search</Button>
          </div>
        </div>
      </div>

      {/* Second Row Data Display */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Top Premium Quick Data */}
        <div className="bg-card rounded-lg border border-border py-6 px-4 shadow-sm">
          {/* Header with centered title and icon */}
          <div className="text-center mb-6">
            <div className="flex items-center justify-center gap-2 mb-2">
              <span className="text-xl">🏆</span>
              <Link
                href={`/${locale}/flows?tab=premium&period=3d`}
                className="font-bold text-foreground text-lg hover:text-blue-600 hover:underline decoration-2 underline-offset-2 transition-colors"
              >
                Top Premium
              </Link>
            </div>
            <div className="h-px bg-border"></div>
          </div>
          
          {/* Ticker display with time periods */}
          <div className="space-y-3 text-base">
            <div className="flex items-center justify-center gap-3">
              <span className="text-sm text-muted-foreground font-bold">1W</span>
              <div className="flex items-center justify-center gap-2">
                <Link href={`/${locale}/JD`} className="text-muted-foreground font-medium hover:text-blue-600 hover:underline decoration-2 underline-offset-2 transition-colors">JD</Link>
                <Link href={`/${locale}/TSLA`} className="text-muted-foreground font-medium hover:text-blue-600 hover:underline decoration-2 underline-offset-2 transition-colors">TSLA</Link>
                <Link href={`/${locale}/TSM`} className="text-muted-foreground font-medium hover:text-blue-600 hover:underline decoration-2 underline-offset-2 transition-colors">TSM</Link>
                <Link href={`/${locale}/CRWY`} className="text-muted-foreground font-medium hover:text-blue-600 hover:underline decoration-2 underline-offset-2 transition-colors">CRWY</Link>
              </div>
            </div>
            <div className="flex items-center justify-center gap-3">
              <span className="text-sm text-muted-foreground font-bold">3D</span>
              <div className="flex items-center justify-center gap-2">
                <Link href={`/${locale}/JD`} className="text-muted-foreground font-medium hover:text-blue-600 hover:underline decoration-2 underline-offset-2 transition-colors">JD</Link>
                <Link href={`/${locale}/TSM`} className="text-muted-foreground font-medium hover:text-blue-600 hover:underline decoration-2 underline-offset-2 transition-colors">TSM</Link>
                <Link href={`/${locale}/GLD`} className="text-muted-foreground font-medium hover:text-blue-600 hover:underline decoration-2 underline-offset-2 transition-colors">GLD</Link>
                <Link href={`/${locale}/HOOD`} className="text-muted-foreground font-medium hover:text-blue-600 hover:underline decoration-2 underline-offset-2 transition-colors">HOOD</Link>
              </div>
            </div>
          </div>
        </div>

        {/* Top Bullish Quick Data */}
        <div className="bg-card rounded-lg border border-border py-6 px-4 shadow-sm">
          {/* Header with centered title and icon */}
          <div className="text-center mb-6">
            <div className="flex items-center justify-center gap-2 mb-2">
              <span className="text-xl">📈</span>
              <Link
                href={`/${locale}/flows?tab=bullish&period=3d`}
                className="font-bold text-foreground text-lg hover:text-blue-600 hover:underline decoration-2 underline-offset-2 transition-colors"
              >
                Top Bullish
              </Link>
            </div>
            <div className="h-px bg-border"></div>
          </div>
          
          {/* Ticker display with time periods */}
          <div className="space-y-3 text-base">
            <div className="flex items-center justify-center gap-3">
              <span className="text-sm text-muted-foreground font-bold">1W</span>
              <div className="flex items-center justify-center gap-2">
                <Link href={`/${locale}/UNH`} className="text-muted-foreground font-medium hover:text-blue-600 hover:underline decoration-2 underline-offset-2 transition-colors">UNH</Link>
                <Link href={`/${locale}/TSLA`} className="text-muted-foreground font-medium hover:text-blue-600 hover:underline decoration-2 underline-offset-2 transition-colors">TSLA</Link>
                <Link href={`/${locale}/CRWY`} className="text-muted-foreground font-medium hover:text-blue-600 hover:underline decoration-2 underline-offset-2 transition-colors">CRWY</Link>
                <Link href={`/${locale}/GLD`} className="text-muted-foreground font-medium hover:text-blue-600 hover:underline decoration-2 underline-offset-2 transition-colors">GLD</Link>
              </div>
            </div>
            <div className="flex items-center justify-center gap-3">
              <span className="text-sm text-muted-foreground font-bold">3D</span>
              <div className="flex items-center justify-center gap-2">
                <Link href={`/${locale}/GLD`} className="text-muted-foreground font-medium hover:text-blue-600 hover:underline decoration-2 underline-offset-2 transition-colors">GLD</Link>
                <Link href={`/${locale}/HOOD`} className="text-muted-foreground font-medium hover:text-blue-600 hover:underline decoration-2 underline-offset-2 transition-colors">HOOD</Link>
                <Link href={`/${locale}/WULF`} className="text-muted-foreground font-medium hover:text-blue-600 hover:underline decoration-2 underline-offset-2 transition-colors">WULF</Link>
                <Link href={`/${locale}/JD`} className="text-muted-foreground font-medium hover:text-blue-600 hover:underline decoration-2 underline-offset-2 transition-colors">JD</Link>
              </div>
            </div>
          </div>
        </div>

        {/* Top Bearish Quick Data */}
        <div className="bg-card rounded-lg border border-border py-6 px-4 shadow-sm">
          {/* Header with centered title and icon */}
          <div className="text-center mb-6">
            <div className="flex items-center justify-center gap-2 mb-2">
              <span className="text-xl">📉</span>
              <Link
                href={`/${locale}/flows?tab=bearish&period=3d`}
                className="font-bold text-foreground text-lg hover:text-blue-600 hover:underline decoration-2 underline-offset-2 transition-colors"
              >
                Top Bearish
              </Link>
            </div>
            <div className="h-px bg-border"></div>
          </div>
          
          {/* Ticker display with time periods */}
          <div className="space-y-3 text-base">
            <div className="flex items-center justify-center gap-3">
              <span className="text-sm text-muted-foreground font-bold">1W</span>
              <div className="flex items-center justify-center gap-2">
                <Link href={`/${locale}/TTD`} className="text-muted-foreground font-medium hover:text-blue-600 hover:underline decoration-2 underline-offset-2 transition-colors">TTD</Link>
                <Link href={`/${locale}/COMP`} className="text-muted-foreground font-medium hover:text-blue-600 hover:underline decoration-2 underline-offset-2 transition-colors">COMP</Link>
                <Link href={`/${locale}/PYPL`} className="text-muted-foreground font-medium hover:text-blue-600 hover:underline decoration-2 underline-offset-2 transition-colors">PYPL</Link>
                <Link href={`/${locale}/DIS`} className="text-muted-foreground font-medium hover:text-blue-600 hover:underline decoration-2 underline-offset-2 transition-colors">DIS</Link>
              </div>
            </div>
            <div className="flex items-center justify-center gap-3">
              <span className="text-sm text-muted-foreground font-bold">3D</span>
              <div className="flex items-center justify-center gap-2">
                <Link href={`/${locale}/APP`} className="text-muted-foreground font-medium hover:text-blue-600 hover:underline decoration-2 underline-offset-2 transition-colors">APP</Link>
                <Link href={`/${locale}/ITW`} className="text-muted-foreground font-medium hover:text-blue-600 hover:underline decoration-2 underline-offset-2 transition-colors">ITW</Link>
                <Link href={`/${locale}/TSLA`} className="text-muted-foreground font-medium hover:text-blue-600 hover:underline decoration-2 underline-offset-2 transition-colors">TSLA</Link>
                <Link href={`/${locale}/CHWY`} className="text-muted-foreground font-medium hover:text-blue-600 hover:underline decoration-2 underline-offset-2 transition-colors">CHWY</Link>
              </div>
            </div>
          </div>
        </div>
      </div>

       

      {/* Bottom Section - 3 columns; right column stacks two tables */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Calls Bought */}
        <div className="bg-card rounded-lg border">
          <TableSlot {...callsBoughtTable} />
        </div>

        {/* Middle: Puts Sold */}
        <div className="bg-card rounded-lg border">
          <TableSlot {...putsSoldTable} />
        </div>

        {/* Right: Puts Bought (top) and Calls Sold (bottom) stacked */}
        <div className="flex flex-col gap-4">
          <div className="bg-card rounded-lg border">
            <TableSlot {...putsBoughtTable} />
          </div>
          <div className="bg-card rounded-lg border">
            <TableSlot {...callsSoldTable} />
          </div>
        </div>
      </div>

      {/* Original Landing Page Components - Commented Out */}
      {/* 
      {page.hero && <Hero hero={page.hero} />}
      {page.branding && <Branding section={page.branding} />}
      {page.introduce && <Feature1 section={page.introduce} />}
      {page.benefit && <Feature2 section={page.benefit} />}
      {page.usage && <Feature3 section={page.usage} />}
      {page.feature && <Feature section={page.feature} />}
      {page.showcase && <Showcase section={page.showcase} />}
      {page.stats && <Stats section={page.stats} />}
      {page.pricing && <Pricing pricing={page.pricing} />}
      {page.testimonial && <Testimonial section={page.testimonial} />}
      {page.faq && <FAQ section={page.faq} />}
      {page.cta && <CTA section={page.cta} />}
      */}
    </div>
  );
}