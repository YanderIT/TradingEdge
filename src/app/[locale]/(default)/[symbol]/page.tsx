import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const revalidate = 60;
export const dynamic = "force-static";
export const dynamicParams = true;

export default async function SymbolPage({
  params,
}: {
  params: Promise<{ locale: string; symbol: string }>;
}) {
  const { locale, symbol } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();

  const rows = [
    { date: "9/11/25", type: "Buy Call", sym: symbol, strike: "157.50 (1%)", exp: "9/26/25", premium: "1.9M" },
    { date: "9/11/25", type: "Sell Put", sym: symbol, strike: "130.00 (−1%)", exp: "10/24/25", premium: "556K" },
    { date: "9/9/25", type: "Buy Call", sym: symbol, strike: "157.50 (5%)", exp: "9/12/25", premium: "4.4M" },
    { date: "9/9/25", type: "Buy Call", sym: symbol, strike: "160.00 (3%)", exp: "9/26/25", premium: "1.5M" },
    { date: "9/9/25", type: "Buy Call", sym: symbol, strike: "170.00 (9%)", exp: "10/3/25", premium: "3.6M" },
    { date: "9/8/25", type: "Sell Put", sym: symbol, strike: "125.00 (−7%)", exp: "10/24/25", premium: "801K" },
    { date: "9/5/25", type: "Buy Call", sym: symbol, strike: "200.00 (32%)", exp: "5/15/26", premium: "2.7M" },
    { date: "9/5/25", type: "", sym: "", strike: "", exp: "", premium: "15.5M" },
  ];

  return (
    <div className="space-y-6">
      {/* Title and centered search */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{symbol}</h1>
        <div className="flex-1 flex justify-center">
          <div className="flex items-center gap-2 w-full max-w-xl">
            <span className="text-sm text-muted-foreground">Recent Flow</span>
            <Input type="text" placeholder="Symbol..." className="flex-1" />
          </div>
        </div>
        <div className="w-[320px]">
          <Card className="py-0">
            <CardHeader className="py-3">
              <CardTitle className="text-sm">Net Score</CardTitle>
            </CardHeader>
            <CardContent className="py-4">
              <div className="text-center text-emerald-600 text-base font-semibold">+7</div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Range buttons */}
      <div className="flex items-center gap-2">
        <button className="px-3 py-1 text-sm rounded bg-primary text-primary-foreground">1 Week</button>
        <button className="px-3 py-1 text-sm rounded border">2 Weeks</button>
        <button className="px-3 py-1 text-sm rounded border">1 Month</button>
        <button className="px-3 py-1 text-sm rounded border">3 Months</button>
      </div>

      <div className="bg-card rounded-lg border">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left p-3">Trade Date</th>
                <th className="text-left p-3">Order Type</th>
                <th className="text-left p-3">Symbol</th>
                <th className="text-left p-3">Strike</th>
                <th className="text-left p-3">Exp</th>
                <th className="text-left p-3">Premium</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r, idx) => (
                <tr key={idx} className={idx % 2 === 0 ? "bg-muted/40" : "bg-muted/20"}>
                  <td className="p-3">{r.date}</td>
                  <td className="p-3">{r.type}</td>
                  <td className="p-3">{r.sym}</td>
                  <td className="p-3">{r.strike}</td>
                  <td className="p-3">{r.exp}</td>
                  <td className="p-3 text-green-600">{r.premium}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}


