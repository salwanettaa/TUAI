"use client"

import * as React from "react"
import { Newspaper, Loader2, Sparkles, AlertTriangle, ArrowRight, TrendingUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { generateNewsArticle, type NewsAnalysisOutput } from "@/ai/flows/news-analysis-flow"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"

const INITIAL_ARTICLE: NewsAnalysisOutput = {
  title: "Navigating Global Supply Chain Shocks: A Guide for Malaysian Farmers",
  summary: "Recent geopolitical shifts in the Middle East and South Asia are projected to create ripples in fertilizer costs and rice export policies. Here is how you can prepare.",
  articleBody: "As we enter the mid-quarter of 2024, the global agricultural landscape is facing unprecedented stressors. From shipping route disruptions in the Red Sea to India's continued stance on non-basmati rice exports, the Malaysian smallholder farmer is positioned at a critical juncture.\n\n### The Fertilizer Factor\nFuel price volatility directly impacts the production of nitrogen-based fertilizers. With crude oil stabilizing at higher baselines, local NPK prices are expected to see a 5-8% increase by next month. We recommend reviewing your soil health reports before your next bulk order to optimize application rates.\n\n### Food Security and Export Bans\nThe ASEAN region remains sensitive to policy shifts in neighboring giants. While local Padi production is currently stable, the risk of higher import costs for alternative grains remains Moderate. Farmers are encouraged to maximize yield efficiency through precise irrigation management.\n\n### Strategic Resilience\nFood security is not just a government mandate—it starts at the farm level. By diversifying small-scale production and adopting AI-driven monitoring tools, local farmers can insulate themselves from the harshest global market shocks.",
  riskLevel: "Moderate",
  actions: [
    "Stockpile 3 months of essential fertilizer if storage allows.",
    "Perform a soil health test to prevent nutrient wastage.",
    "Monitor localized weather alerts for the coming monsoon shift.",
    "Review government padi subsidy eligibility for 2024."
  ]
}

export default function NewsPage() {
  const [article, setArticle] = React.useState<NewsAnalysisOutput>(INITIAL_ARTICLE)
  const [loading, setLoading] = React.useState(false)
  const [mounted, setMounted] = React.useState(false)
  const { toast } = useToast()

  React.useEffect(() => {
    setMounted(true)
  }, [])

  const fetchArticle = async (topic: string = "Global food supply chain stressors for ASEAN 2024") => {
    setLoading(true)
    try {
      const data = await generateNewsArticle({ topic })
      setArticle(data)
      toast({
        title: "Intelligence Updated",
        description: "New AI analysis generated successfully."
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "AI Analysis Failed",
        description: "Could not generate the news briefing at this time."
      })
    } finally {
      setLoading(false)
    }
  }

  const riskColors = {
    Low: "bg-emerald-500",
    Moderate: "bg-yellow-500",
    High: "bg-orange-500",
    Critical: "bg-destructive"
  }

  if (!mounted) return null

  const formattedDate = new Date().toLocaleDateString()

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-32 px-1">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest mb-4">
            <Sparkles className="h-3 w-3" />
            AI Intelligence Hub
          </div>
          <h2 className="text-3xl md:text-4xl font-headline font-bold text-slate-900 leading-tight">Global News Analysis</h2>
          <p className="text-sm text-muted-foreground mt-2 font-medium">Professional agricultural impact assessments grounded in regional data.</p>
        </div>
        <Button 
          className="rounded-xl bg-primary text-white h-12 font-bold shadow-lg shadow-primary/20 active:scale-95 transition-all"
          onClick={() => fetchArticle()}
          disabled={loading}
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4 mr-2" />}
          Generate Fresh Analysis
        </Button>
      </div>

      <div className={cn("animate-in fade-in slide-in-from-bottom-8 duration-700", loading && "opacity-50 pointer-events-none")}>
        <Card className="rounded-[2.5rem] border-none shadow-2xl overflow-hidden bg-white">
          <div className={`h-4 ${riskColors[article.riskLevel]}`} />
          <CardHeader className="p-8 md:p-12 pb-6">
            <div className="flex items-center justify-between mb-8">
               <div className="flex items-center gap-2 text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                  <TrendingUp className="h-4 w-4 text-primary" />
                  Sourced Intelligence • {formattedDate}
               </div>
               <div className={cn(
                 "px-3 py-1 rounded-full text-white text-[9px] font-black uppercase tracking-wider flex items-center gap-1.5",
                 riskColors[article.riskLevel]
               )}>
                 <AlertTriangle className="h-3 w-3" />
                 {article.riskLevel} Risk
               </div>
            </div>
            <CardTitle className="text-3xl md:text-5xl font-headline font-bold text-slate-900 leading-tight md:leading-[1.15]">
              {article.title}
            </CardTitle>
            <CardDescription className="text-base md:text-lg font-medium text-slate-500 mt-8 leading-relaxed border-l-4 border-primary/20 pl-6 italic bg-slate-50/50 py-4 rounded-r-2xl">
              {article.summary}
            </CardDescription>
          </CardHeader>
          <CardContent className="px-8 md:px-12 pb-12">
            <div className="prose prose-slate max-w-none prose-p:text-slate-600 prose-p:leading-loose text-base md:text-lg">
              {article.articleBody.split('\n').map((line, i) => (
                <p key={i} className="mb-4">{line.replace(/#/g, '')}</p>
              ))}
            </div>

            <div className="mt-10 md:mt-16 p-8 md:p-10 rounded-[2.5rem] bg-slate-50 border border-slate-100 space-y-8">
               <h4 className="font-headline font-bold text-xl md:text-2xl flex items-center gap-3 text-primary">
                 <Sparkles className="h-6 w-6 text-secondary fill-current" />
                 Action Plan for Malaysian Farmers
               </h4>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {article.actions.map((action, i) => (
                    <div key={i} className="flex gap-5 p-5 bg-white rounded-2xl shadow-sm border border-slate-100 transition-all hover:-translate-y-1 hover:shadow-md">
                       <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0 font-black text-sm">
                         {i + 1}
                       </div>
                       <p className="text-sm font-bold text-slate-700 leading-relaxed">{action}</p>
                    </div>
                  ))}
               </div>
            </div>
          </CardContent>
          <CardFooter className="bg-slate-50/50 p-8 md:p-12 border-t flex flex-col md:flex-row justify-between items-center gap-6">
             <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Verified by TUAI Intelligence Engine</span>
             <div className="flex gap-3 w-full md:w-auto">
               <Button className="flex-1 md:flex-none rounded-xl bg-primary text-white h-14 font-bold shadow-lg shadow-primary/20">
                 Full Report <ArrowRight className="ml-2 h-4 w-4" />
               </Button>
             </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
