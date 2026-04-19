"use client"

import * as React from "react"
import { ShieldAlert, TrendingDown, Globe, BarChart3, ArrowRight, Loader2, AlertTriangle, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { riskIntel, type RiskIntelOutput } from "@/ai/flows/risk-intel-flow"

export default function RiskIntelPage() {
  const [intel, setIntel] = React.useState<RiskIntelOutput | null>(null)
  const [loading, setLoading] = React.useState(false)

  const fetchIntel = async () => {
    setLoading(true)
    try {
      const data = await riskIntel({
        region: "Malaysia",
        newsSummary: "Global shipping delays reported in Red Sea. India maintains export ban on non-basmati rice. Crude oil prices stabilizing around $80/barrel.",
        commodityPrices: { "Fertilizer (NPK)": 820, "Diesel": 2.15, "Padi Grade A": 1.45 },
        exportImportBans: ["Indian Rice Export Ban", "China Urea Export Quotas"],
        policyUpdates: "New federal subsidy for organic soil enhancers starting next month."
      })
      setIntel(data)
    } catch (error) {
      console.error("Failed to fetch risk intel", error)
    } finally {
      setLoading(false)
    }
  }

  const alertColors = {
    Low: "bg-emerald-500",
    Medium: "bg-yellow-500",
    High: "bg-orange-500",
    Critical: "bg-destructive"
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest">
            <Globe className="h-3 w-3" />
            Supply Chain Intelligence
          </div>
          <h2 className="text-3xl font-headline font-bold text-primary">Risk Intel & Shock Prediction</h2>
          <p className="text-muted-foreground">Gemini Pro analyzing global stressors affecting Malaysia farming.</p>
        </div>
      </div>

      {!intel && !loading && (
        <Card className="rounded-[2.5rem] border-2 border-dashed border-primary/20 bg-white/50 p-16 text-center space-y-8">
          <div className="h-24 w-24 bg-primary/10 rounded-[2.5rem] flex items-center justify-center mx-auto shadow-inner">
            <ShieldAlert className="h-12 w-12 text-primary" />
          </div>
          <div className="max-w-md mx-auto space-y-3">
            <h3 className="text-2xl font-bold text-slate-900">Start Global Risk Scan</h3>
            <p className="text-slate-500 text-sm font-medium leading-relaxed italic">
              Trigger the AI to scalp global trade data, shipping routes, and commodity market shocks to assess your farm's risk profile.
            </p>
          </div>
          <Button 
            onClick={fetchIntel}
            className="h-16 px-12 rounded-2xl bg-primary text-white text-lg font-bold shadow-2xl shadow-primary/20 active:scale-95 transition-all"
          >
            <Sparkles className="h-5 w-5 mr-3" />
            Run Risk Assessment
          </Button>
        </Card>
      )}

      {loading && (
        <div className="flex flex-col items-center justify-center min-h-[40vh] gap-6 bg-white rounded-[2.5rem] border animate-pulse">
          <Loader2 className="h-16 w-16 animate-spin text-primary opacity-30" />
          <p className="text-muted-foreground font-black uppercase tracking-widest text-xs">AI Scalping Trade Data...</p>
        </div>
      )}

      {intel && !loading && (
        <div className="grid lg:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
          <Card className="lg:col-span-2 rounded-3xl border-none shadow-xl overflow-hidden">
            <div className={`h-3 ${alertColors[intel.alertLevel]}`} />
            <CardHeader className="bg-white">
              <div className="flex items-center justify-between">
                <CardTitle className="font-headline font-bold text-2xl">Regional Risk Assessment</CardTitle>
                <div className={`px-4 py-1.5 rounded-full text-white text-sm font-bold flex items-center gap-2 ${alertColors[intel.alertLevel]}`}>
                  <AlertTriangle className="h-4 w-4" />
                  {intel.alertLevel} Alert
                </div>
              </div>
              <CardDescription className="text-base mt-2">
                Based on recent geopolitical shifts and commodity market fluctuations.
              </CardDescription>
            </CardHeader>
            <CardContent className="bg-white p-8 space-y-8">
              <div className="p-6 rounded-2xl bg-[#F0F4F6] border-l-4 border-l-primary space-y-3">
                <h4 className="font-bold flex items-center gap-2">
                  <ShieldAlert className="h-5 w-5 text-primary" />
                  Impact Summary
                </h4>
                <p className="text-muted-foreground leading-relaxed">{intel.potentialImpactSummary}</p>
              </div>

              <div className="space-y-4">
                <h4 className="font-headline font-bold text-lg">Preventative Actions for Farmers</h4>
                <div className="grid md:grid-cols-2 gap-4">
                  {intel.recommendedActions.map((action, i) => (
                    <div key={i} className="flex gap-3 p-4 rounded-xl bg-white border hover:border-primary transition-colors">
                      <div className="h-6 w-6 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0 font-bold text-xs">
                        {i + 1}
                      </div>
                      <p className="text-sm font-medium leading-snug">{action}</p>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
            <div className="bg-accent/10 p-6 flex items-center justify-between border-t">
               <span className="text-xs font-bold text-muted-foreground uppercase">Verified Intelligence</span>
               <Button variant="outline" size="sm" className="rounded-xl font-bold" onClick={fetchIntel}>Re-run Scan</Button>
            </div>
          </Card>

          <div className="space-y-6">
             <Card className="rounded-3xl border-none shadow-xl overflow-hidden">
               <CardHeader className="bg-primary text-white pb-6">
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Market Prices
                  </CardTitle>
               </CardHeader>
               <CardContent className="p-6">
                  <div className="space-y-4">
                    {[
                      { label: "Fertilizer (NPK)", price: "RM 820/t", trend: "up", change: "+12%" },
                      { label: "Diesel fuel", price: "RM 2.15/L", trend: "stable", change: "0%" },
                      { label: "Padi Premium", price: "RM 1.45/kg", trend: "up", change: "+4%" }
                    ].map((item, i) => (
                      <div key={i} className="flex items-center justify-between pb-4 border-b last:border-0 last:pb-0">
                        <div>
                          <div className="text-xs font-bold text-muted-foreground uppercase">{item.label}</div>
                          <div className="text-lg font-headline font-bold">{item.price}</div>
                        </div>
                        <div className={`text-xs font-bold px-2 py-1 rounded-full ${item.trend === 'up' ? 'bg-orange-100 text-orange-600' : 'bg-slate-100 text-slate-500'}`}>
                          {item.change}
                        </div>
                      </div>
                    ))}
                  </div>
                  <Button className="w-full mt-6 bg-[#F0F4F6] text-primary hover:bg-primary hover:text-white rounded-xl font-bold transition-all">
                    Full Market Analysis
                  </Button>
               </CardContent>
             </Card>
          </div>
        </div>
      )}
    </div>
  )
}
