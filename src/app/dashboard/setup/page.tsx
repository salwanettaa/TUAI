"use client"

import * as React from "react"
import { 
  Compass, 
  Map, 
  Sprout, 
  Calculator, 
  ArrowRight, 
  Loader2, 
  CheckCircle2, 
  Sparkles, 
  Landmark, 
  Globe,
  Coins
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { farmSetupGuide, type FarmSetupOutput } from "@/ai/flows/farm-setup-flow"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"

export default function FarmSetupPage() {
  const [loading, setLoading] = React.useState(false)
  const [result, setResult] = React.useState<FarmSetupOutput | null>(null)
  const { toast } = useToast()

  const [formData, setFormData] = React.useState({
    status: 'beginner' as 'beginner' | 'existing',
    country: 'Malaysia',
    region: '',
    hasLand: 'no',
    crop: '',
    budget: ''
  })

  const handleStartPlanning = async () => {
    if (!formData.region || !formData.crop) {
      toast({
        variant: "destructive",
        title: "Missing Info",
        description: "Please fill in your region and crop interest."
      })
      return
    }

    setLoading(true)
    try {
      const output = await farmSetupGuide({
        status: formData.status,
        locationPreference: { country: formData.country, region: formData.region },
        hasLand: formData.hasLand === 'yes',
        cropInterest: formData.crop,
        budget: formData.budget ? Number(formData.budget) : undefined
      })
      setResult(output)
    } catch (error) {
      toast({
        variant: "destructive",
        title: "AI Planning Failed",
        description: "Could not generate your farm roadmap."
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-24">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest mb-4">
            <Compass className="h-3.5 w-3.5" />
            AI Farmer Journey
          </div>
          <h2 className="text-4xl font-headline font-bold text-slate-900 tracking-tight">Farm Setup & Roadmap</h2>
          <p className="text-muted-foreground mt-2">Scale your current farm or start your journey from zero to self-sufficiency.</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Input Controls */}
        <div className="space-y-6">
          <Card className="rounded-[2rem] shadow-xl border-none bg-white overflow-hidden">
            <CardHeader className="bg-slate-50 border-b p-8">
              <CardTitle className="text-xl font-bold flex items-center gap-2">
                <Map className="h-5 w-5 text-primary" />
                Planning Profile
              </CardTitle>
              <CardDescription>Tell us about your farming goals.</CardDescription>
            </CardHeader>
            <CardContent className="p-8 space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-wider text-slate-500 ml-1">I am currently...</Label>
                  <Tabs value={formData.status} onValueChange={(v) => setFormData(p => ({...p, status: v as any}))}>
                    <TabsList className="grid w-full grid-cols-2 h-12 rounded-xl">
                      <TabsTrigger value="beginner" className="rounded-lg text-xs font-bold">New Farmer</TabsTrigger>
                      <TabsTrigger value="existing" className="rounded-lg text-xs font-bold">Existing Farm</TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-xs font-bold uppercase tracking-wider text-slate-500">Country</Label>
                    <Select value={formData.country} onValueChange={(v) => setFormData(p => ({...p, country: v}))}>
                      <SelectTrigger className="rounded-xl h-12">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Malaysia">Malaysia</SelectItem>
                        <SelectItem value="Indonesia">Indonesia</SelectItem>
                        <SelectItem value="Thailand">Thailand</SelectItem>
                        <SelectItem value="Vietnam">Vietnam</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-bold uppercase tracking-wider text-slate-500">Region/State</Label>
                    <Input 
                      placeholder="e.g. Kedah" 
                      className="rounded-xl h-12"
                      value={formData.region}
                      onChange={(e) => setFormData(p => ({...p, region: e.target.value}))}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-wider text-slate-500">Do you have land?</Label>
                  <Select value={formData.hasLand} onValueChange={(v) => setFormData(p => ({...p, hasLand: v}))}>
                    <SelectTrigger className="rounded-xl h-12">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="yes">Yes, I have land</SelectItem>
                      <SelectItem value="no">No, help me find one</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-wider text-slate-500">Crop Interest</Label>
                  <Input 
                    placeholder="e.g. Padi, Palm Oil, Chillies" 
                    className="rounded-xl h-12"
                    value={formData.crop}
                    onChange={(e) => setFormData(p => ({...p, crop: e.target.value}))}
                  />
                </div>
              </div>

              <Button 
                onClick={handleStartPlanning}
                disabled={loading}
                className="w-full h-14 rounded-2xl bg-primary text-white font-bold text-lg shadow-xl shadow-primary/20 hover:scale-[1.02] transition-transform"
              >
                {loading ? <Loader2 className="h-6 w-6 animate-spin" /> : "Generate AI Roadmap"}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Results Area */}
        <div className="lg:col-span-2 space-y-8">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-24 gap-6">
              <div className="relative">
                <Loader2 className="h-16 w-16 animate-spin text-primary opacity-20" />
                <Sparkles className="h-8 w-8 text-primary absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
              </div>
              <div className="text-center">
                <h3 className="text-2xl font-bold">AI is calculating your path...</h3>
                <p className="text-muted-foreground">Scouting regional land availability and calculating material needs.</p>
              </div>
            </div>
          ) : result ? (
            <div className="animate-in fade-in slide-in-from-bottom-6 duration-700 space-y-8">
              {/* Motivation Card */}
              <Card className="rounded-[2.5rem] border-none bg-primary text-white p-10 relative overflow-hidden shadow-2xl">
                <Sparkles className="absolute top-4 right-4 h-24 w-24 opacity-10" />
                <div className="relative z-10 space-y-4">
                  <h3 className="text-3xl font-headline font-bold">Why become a farmer?</h3>
                  <p className="text-xl text-primary-foreground/80 leading-relaxed italic">
                    "{result.motivation}"
                  </p>
                </div>
              </Card>

              {/* Guide & Calculator */}
              <div className="grid md:grid-cols-2 gap-8">
                <Card className="rounded-[2.5rem] border-none shadow-xl bg-white overflow-hidden">
                  <CardHeader className="bg-emerald-50 p-8 border-b">
                    <CardTitle className="text-xl font-bold flex items-center gap-2">
                      <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                      Step-by-Step Roadmap
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-8">
                    <div className="space-y-4">
                      {result.roadmap.map((step, i) => (
                        <div key={i} className="flex gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100 transition-colors hover:bg-emerald-50/50">
                          <div className="h-8 w-8 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0 text-xs font-black">
                            {i + 1}
                          </div>
                          <p className="text-sm font-medium leading-relaxed">{step}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="rounded-[2.5rem] border-none shadow-xl bg-white overflow-hidden">
                  <CardHeader className="bg-blue-50 p-8 border-b">
                    <CardTitle className="text-xl font-bold flex items-center gap-2">
                      <Calculator className="h-5 w-5 text-blue-600" />
                      Needs & Cost Estimate
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-8 space-y-6">
                    <div className="space-y-4">
                      <div className="p-5 rounded-2xl bg-slate-50 border">
                        <Label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Seed Requirement</Label>
                        <p className="text-lg font-bold text-slate-800 mt-1">{result.calculatedNeeds.seeds}</p>
                      </div>
                      <div className="p-5 rounded-2xl bg-slate-50 border">
                        <Label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Fertilizer Recommendation</Label>
                        <p className="text-lg font-bold text-slate-800 mt-1">{result.calculatedNeeds.fertilizer}</p>
                      </div>
                      <div className="p-6 rounded-2xl bg-blue-600 text-white shadow-lg">
                        <Label className="text-[10px] font-black uppercase opacity-70 tracking-widest">Estimated Initial Cost</Label>
                        <div className="flex items-center gap-2 mt-1">
                          <Coins className="h-6 w-6" />
                          <p className="text-3xl font-black">{result.calculatedNeeds.estimatedInitialCost}</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Land Options (Conditional) */}
              {result.landOptions && result.landOptions.length > 0 && (
                <Card className="rounded-[2.5rem] border-none shadow-xl bg-white overflow-hidden">
                  <CardHeader className="bg-orange-50 p-8 border-b">
                    <CardTitle className="text-xl font-bold flex items-center gap-2">
                      <Landmark className="h-5 w-5 text-orange-600" />
                      AI Scout: Recommended Land
                    </CardTitle>
                    <CardDescription>Estimated availability and pricing based on regional data.</CardDescription>
                  </CardHeader>
                  <CardContent className="p-8">
                    <div className="grid md:grid-cols-3 gap-6">
                      {result.landOptions.map((land, i) => (
                        <div key={i} className="flex flex-col p-6 rounded-3xl bg-slate-50 border border-slate-100 hover:border-orange-200 transition-all group">
                          <div className="h-10 w-10 bg-white rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform shadow-sm">
                            <Map className="h-5 w-5 text-orange-500" />
                          </div>
                          <h4 className="font-bold text-lg text-slate-800 text-center">{land.location}</h4>
                          <p className="text-xs text-muted-foreground mb-4 text-center">{land.size}</p>
                          <div className="mt-auto space-y-4 flex flex-col items-center">
                            <div className="text-sm font-black text-orange-600 bg-orange-100 w-fit px-3 py-1 rounded-full">
                              {land.priceEstimate}
                            </div>
                            <p className="text-xs italic leading-relaxed text-slate-500 text-center">
                              "{land.suitabilityReason}"
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter className="bg-slate-50 p-8 border-t flex justify-center">
                    <Button variant="ghost" className="text-primary font-bold">Request Official Land Survey <ArrowRight className="ml-2 h-4 w-4" /></Button>
                  </CardFooter>
                </Card>
              )}
            </div>
          ) : (
            <div className="h-[600px] flex flex-col items-center justify-center bg-white/50 backdrop-blur-sm border-2 border-dashed rounded-[3rem] p-12 text-center gap-6 shadow-sm">
              <div className="h-24 w-24 bg-primary/10 rounded-[2.5rem] flex items-center justify-center animate-bounce">
                <Globe className="h-12 w-12 text-primary" />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-headline font-bold">Start Your Farming Legacy</h3>
                <p className="text-muted-foreground max-w-[400px] mx-auto text-sm">
                  Complete your profile on the left to get a customized roadmap, land scouting, and needs calculation grounded in ASEAN regional data.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}