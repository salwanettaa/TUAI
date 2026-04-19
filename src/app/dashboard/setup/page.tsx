"use client"

import * as React from "react"
import { 
  Compass, 
  Map, 
  Sprout, 
  ArrowRight, 
  Loader2, 
  CheckCircle2, 
  Sparkles, 
  ChevronRight, 
  ChevronLeft,
  Activity,
  ShieldAlert,
  TrendingUp,
  Droplets,
  Zap,
  User,
  MapPin,
  TrendingDown,
  Info,
  DollarSign
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import { farmSetupGuide, type FarmSetupOutput } from "@/ai/flows/farm-setup-flow"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"
import { useFirestore, useUser } from "@/firebase"
import { collection, serverTimestamp } from "firebase/firestore"
import { addDocumentNonBlocking } from "@/firebase/non-blocking-updates"

export default function FarmSetupPage() {
  const [loading, setLoading] = React.useState(false)
  const [result, setResult] = React.useState<FarmSetupOutput | null>(null)
  const [step, setStep] = React.useState(1)
  const { toast } = useToast()
  const { user } = useUser()
  const db = useFirestore()

  const [formData, setFormData] = React.useState({
    status: 'beginner' as 'beginner' | 'existing',
    basicInfo: {
      farmName: '',
      ownerName: '',
      country: 'Malaysia',
      region: '',
      address: '',
    },
    // Existing Farm Specific
    farmType: '',
    sizeValue: 0,
    sizeUnit: 'hectares',
    hasLivestock: false,
    livestockDetails: '',
    techInterest: false,
    problems: [] as string[],
    operations: {
      trackingMethod: 'no system',
      useSensors: false,
      useMachinery: false,
    },
    productionData: {
      averageYield: '',
      feedUsage: '',
      mortalityRate: '',
    },
    // Beginner Specific
    targetCrop: '',
    hasLand: false,
    motivation: '',
    // Shared
    goals: [] as string[],
    budget: 'RM 0–500',
    helpType: 'Daily alerts',
  })

  const handleProblemToggle = (problem: string) => {
    setFormData(prev => ({
      ...prev,
      problems: prev.problems.includes(problem) 
        ? prev.problems.filter(p => p !== problem)
        : [...prev.problems, problem]
    }))
  }

  const handleGoalToggle = (goal: string) => {
    setFormData(prev => ({
      ...prev,
      goals: prev.goals.includes(goal) 
        ? prev.goals.filter(g => g !== goal)
        : [...prev.goals, goal]
    }))
  }

  const handleStartPlanning = async () => {
    setLoading(true)
    try {
      const output = await farmSetupGuide(formData)
      setResult(output)

      if (db && user) {
        const farmsRef = collection(db, "farms")
        addDocumentNonBlocking(farmsRef, {
          ...formData,
          userId: user.uid,
          aiAnalysis: output,
          createdAt: serverTimestamp()
        })
      }

      toast({
        title: "Intelligence Generated!",
        description: formData.status === 'beginner' ? "Your Roadmap is ready." : "Farm Audit complete."
      })
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

  const nextStep = () => setStep(s => s + 1)
  const prevStep = () => setStep(s => s - 1)

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
            <div className="space-y-5">
               <div className="space-y-3">
                  <Label className="text-xs font-black uppercase tracking-widest text-primary/60">Select Your Path</Label>
                  <Tabs 
                    value={formData.status} 
                    onValueChange={(v) => setFormData(p => ({...p, status: v as any}))}
                    className="w-full"
                  >
                    <TabsList className="grid w-full grid-cols-2 h-16 rounded-2xl bg-slate-100 p-1.5 shadow-inner">
                      <TabsTrigger value="beginner" className="rounded-xl font-bold text-xs md:text-sm data-[state=active]:shadow-md">
                        New Farmer
                      </TabsTrigger>
                      <TabsTrigger value="existing" className="rounded-xl font-bold text-xs md:text-sm data-[state=active]:shadow-md">
                        Existing Farm
                      </TabsTrigger>
                    </TabsList>
                  </Tabs>
               </div>
               <div className="space-y-2">
                 <Label className="font-bold text-slate-700">Farm Name</Label>
                 <Input 
                   placeholder="e.g. Green Fields Padi" 
                   value={formData.basicInfo.farmName}
                   onChange={(e) => setFormData(p => ({...p, basicInfo: {...p.basicInfo, farmName: e.target.value}}))}
                   className="rounded-xl h-12 bg-white border-slate-200"
                 />
               </div>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div className="space-y-2">
                   <Label className="font-bold text-slate-700">Country</Label>
                   <Select value={formData.basicInfo.country} onValueChange={(v) => setFormData(p => ({...p, basicInfo: {...p.basicInfo, country: v}}))}>
                     <SelectTrigger className="rounded-xl h-12 bg-white border-slate-200"><SelectValue /></SelectTrigger>
                     <SelectContent>
                        <SelectItem value="Malaysia">Malaysia</SelectItem>
                        <SelectItem value="Indonesia">Indonesia</SelectItem>
                        <SelectItem value="Thailand">Thailand</SelectItem>
                     </SelectContent>
                   </Select>
                 </div>
                 <div className="space-y-2">
                   <Label className="font-bold text-slate-700">Region/State</Label>
                   <Input 
                     placeholder="e.g. Kedah" 
                     value={formData.basicInfo.region}
                     onChange={(e) => setFormData(p => ({...p, basicInfo: {...p.basicInfo, region: e.target.value}}))}
                     className="rounded-xl h-12 bg-white border-slate-200"
                   />
                 </div>
               </div>
            </div>
            <Button onClick={nextStep} className="w-full h-14 rounded-2xl bg-primary text-white font-bold text-lg shadow-lg shadow-primary/20">
              Continue <ChevronRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        )
      case 2:
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
            {formData.status === 'existing' ? (
              <div className="space-y-5">
                <div className="space-y-2">
                  <Label className="font-bold text-slate-700">Main Crop / Plant Type</Label>
                  <Select value={formData.farmType} onValueChange={(v) => setFormData(p => ({...p, farmType: v}))}>
                    <SelectTrigger className="rounded-xl h-12"><SelectValue placeholder="Select type" /></SelectTrigger>
                    <SelectContent>
                      {['Rice / Padi', 'Vegetables', 'Fruits', 'Palm Oil', 'Rubber'].map(t => (
                        <SelectItem key={t} value={t}>{t}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="font-bold text-slate-700">Land Area</Label>
                    <Input 
                      type="number"
                      value={formData.sizeValue}
                      onChange={(e) => setFormData(p => ({...p, sizeValue: Number(e.target.value)}))}
                      className="rounded-xl h-12"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="font-bold text-slate-700">Unit</Label>
                    <Select value={formData.sizeUnit} onValueChange={(v) => setFormData(p => ({...p, sizeUnit: v}))}>
                      <SelectTrigger className="rounded-xl h-12"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="hectares">Hectares</SelectItem>
                        <SelectItem value="acres">Acres</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-3 p-4 rounded-2xl bg-slate-50 border">
                  <Label className="font-bold text-slate-700">Do you have Livestock?</Label>
                  <Tabs value={formData.hasLivestock ? "yes" : "no"} onValueChange={(v) => setFormData(p => ({...p, hasLivestock: v === "yes"}))}>
                    <TabsList className="grid grid-cols-2 h-10 bg-white border p-1 rounded-lg">
                      <TabsTrigger value="no" className="rounded-md">No</TabsTrigger>
                      <TabsTrigger value="yes" className="rounded-md">Yes</TabsTrigger>
                    </TabsList>
                  </Tabs>
                  {formData.hasLivestock && (
                    <Input 
                      placeholder="e.g. 50 Chickens, 5 Cows" 
                      value={formData.livestockDetails}
                      onChange={(e) => setFormData(p => ({...p, livestockDetails: e.target.value}))}
                      className="mt-2 rounded-xl bg-white"
                    />
                  )}
                </div>
              </div>
            ) : (
              <div className="space-y-5">
                <div className="space-y-2">
                  <Label className="font-bold text-slate-700">What do you want to plant/raise?</Label>
                  <Input 
                    placeholder="e.g. Padi Grade A" 
                    value={formData.targetCrop}
                    onChange={(e) => setFormData(p => ({...p, targetCrop: e.target.value}))}
                    className="rounded-xl h-12"
                  />
                </div>
                <div className="space-y-3 p-4 rounded-2xl bg-slate-50 border">
                  <Label className="font-bold text-slate-700">Do you already have land?</Label>
                  <Tabs value={formData.hasLand ? "yes" : "no"} onValueChange={(v) => setFormData(p => ({...p, hasLand: v === "yes"}))}>
                    <TabsList className="grid grid-cols-2 h-10 bg-white border p-1 rounded-lg">
                      <TabsTrigger value="yes" className="rounded-md">Yes</TabsTrigger>
                      <TabsTrigger value="no" className="rounded-md">No (Need AI Scouting)</TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>
                <div className="flex items-start space-x-3 p-4 rounded-2xl border bg-primary/5">
                   <Checkbox id="techInterest" checked={formData.techInterest} onCheckedChange={(v) => setFormData(p => ({...p, techInterest: !!v}))} className="mt-1" />
                   <Label htmlFor="techInterest" className="text-sm font-medium text-slate-700 leading-relaxed cursor-pointer">
                      <strong>AI Interest:</strong> I want to use robots or AI automation to minimize labor.
                   </Label>
                </div>
              </div>
            )}
            <div className="flex flex-col sm:flex-row gap-3">
              <Button variant="outline" onClick={prevStep} className="flex-1 h-14 rounded-2xl font-bold">Back</Button>
              <Button onClick={nextStep} className="flex-1 h-14 rounded-2xl bg-primary text-white font-bold">Continue</Button>
            </div>
          </div>
        )
      case 3:
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
            {formData.status === 'existing' ? (
              <div className="space-y-4">
                <Label className="text-xs font-black uppercase tracking-widest text-primary/60">Current Pain Points</Label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {['Crop disease', 'Low yield', 'Expensive fertilizer', 'Water issues', 'Labor shortage', 'High mortality rate'].map(p => (
                    <div key={p} className={cn(
                      "flex items-center space-x-3 p-4 rounded-xl border transition-colors cursor-pointer",
                      formData.problems.includes(p) ? "bg-primary/5 border-primary" : "bg-white border-slate-200"
                    )} onClick={() => handleProblemToggle(p)}>
                      <Checkbox 
                        id={p} 
                        checked={formData.problems.includes(p)}
                        onCheckedChange={() => handleProblemToggle(p)}
                      />
                      <Label htmlFor={p} className="text-sm font-bold text-slate-700 flex-1 cursor-pointer">{p}</Label>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-5">
                <div className="space-y-2">
                  <Label className="font-bold text-slate-700">Why do you want to become a farmer?</Label>
                  <Textarea 
                    placeholder="e.g. To secure food for my family and reduce import reliance..."
                    value={formData.motivation}
                    onChange={(e) => setFormData(p => ({...p, motivation: e.target.value}))}
                    className="rounded-xl h-32 resize-none"
                  />
                </div>
                <div className="space-y-3">
                  <Label className="text-xs font-black uppercase tracking-widest text-primary/60">Your Goals</Label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                     {['Full time income', 'Side hustle', 'Food security', 'Sustainability'].map(g => (
                        <div key={g} className={cn(
                          "flex items-center space-x-3 p-4 rounded-xl border transition-colors cursor-pointer",
                          formData.goals.includes(g) ? "bg-primary/5 border-primary" : "bg-white border-slate-200"
                        )} onClick={() => handleGoalToggle(g)}>
                          <Checkbox checked={formData.goals.includes(g)} onCheckedChange={() => handleGoalToggle(g)} />
                          <Label className="text-sm font-bold text-slate-700 flex-1 cursor-pointer">{g}</Label>
                        </div>
                     ))}
                  </div>
                </div>
              </div>
            )}
            <div className="flex flex-col sm:flex-row gap-3">
              <Button variant="outline" onClick={prevStep} className="flex-1 h-14 rounded-2xl font-bold">Back</Button>
              <Button onClick={nextStep} className="flex-1 h-14 rounded-2xl bg-primary text-white font-bold">Continue</Button>
            </div>
          </div>
        )
      case 4:
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
            <div className="space-y-5">
               {formData.status === 'existing' ? (
                 <div className="space-y-5">
                   <Label className="text-xs font-black uppercase tracking-widest text-primary/60">Production Data</Label>
                   <div className="grid grid-cols-1 gap-4">
                      <div className="space-y-2">
                        <Label className="text-sm font-bold text-slate-600">Average Yield (Kg/Metric Ton)</Label>
                        <Input 
                          placeholder="e.g. 5.5 tons/hectare"
                          value={formData.productionData.averageYield} 
                          onChange={(e) => setFormData(p => ({...p, productionData: {...p.productionData, averageYield: e.target.value}}))} 
                          className="rounded-xl h-12" 
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm font-bold text-slate-600">Monthly Feed/Fertilizer Usage</Label>
                        <Input 
                          placeholder="e.g. 500kg NPK"
                          value={formData.productionData.feedUsage} 
                          onChange={(e) => setFormData(p => ({...p, productionData: {...p.productionData, feedUsage: e.target.value}}))} 
                          className="rounded-xl h-12" 
                        />
                      </div>
                   </div>
                 </div>
               ) : (
                 <div className="space-y-5">
                   <Label className="text-xs font-black uppercase tracking-widest text-primary/60">Budget & Modal</Label>
                   <div className="space-y-3">
                     <Select value={formData.budget} onValueChange={(v) => setFormData(p => ({...p, budget: v}))}>
                      <SelectTrigger className="rounded-xl h-16 bg-white border-slate-200 px-6 font-bold text-slate-700">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="RM 0–500 (Small Scale)">RM 0–500 (Small Scale)</SelectItem>
                        <SelectItem value="RM 5,000–20,000 (Commercial)">RM 5,000–20,000 (Commercial)</SelectItem>
                        <SelectItem value="RM 50,000+ (Enterprise)">RM 50,000+ (Enterprise)</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-[10px] text-muted-foreground font-medium px-2">
                      *AI uses this to calculate seeds, tools, and labor requirements.
                    </p>
                   </div>
                 </div>
               )}
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button variant="outline" onClick={prevStep} className="flex-1 h-14 rounded-2xl font-bold">Back</Button>
              <Button onClick={nextStep} className="flex-1 h-14 rounded-2xl bg-primary text-white font-bold">Review</Button>
            </div>
          </div>
        )
      case 5:
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
            <div className="space-y-5 text-center py-10 bg-emerald-50/50 rounded-3xl border border-emerald-100">
               <div className="h-20 w-20 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-emerald-500/20">
                 <CheckCircle2 className="h-10 w-10 text-white" />
               </div>
               <div className="space-y-2 px-6">
                 <h3 className="text-2xl font-headline font-bold text-slate-900">Analysis Ready</h3>
                 <p className="text-sm text-slate-600 font-medium">
                    Our Gemini AI is ready to synthesize your data and generate a professional roadmap.
                 </p>
               </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button variant="outline" onClick={prevStep} className="flex-1 h-14 rounded-2xl font-bold">Back</Button>
              <Button onClick={handleStartPlanning} disabled={loading} className="flex-1 h-14 rounded-2xl bg-primary text-white font-bold shadow-xl shadow-primary/30">
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  "Generate AI Intelligence"
                )}
              </Button>
            </div>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-32">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-2">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-black uppercase tracking-widest mb-4">
            <Compass className="h-3.5 w-3.5" />
            AI Pathfinder Wizard
          </div>
          <h2 className="text-4xl font-headline font-bold text-slate-900 tracking-tight leading-none">Farm Intelligence Setup</h2>
          <p className="text-muted-foreground mt-3 text-lg font-medium">Guide your journey or perform a deep performance audit.</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-8 px-2">
        <div className="lg:col-span-5 space-y-6">
          <Card className="rounded-[2.5rem] shadow-2xl border-none bg-white overflow-hidden">
            <CardHeader className="bg-slate-50 border-b p-8 space-y-4">
              <div className="flex justify-between items-center">
                 <CardTitle className="text-2xl font-headline font-bold flex items-center gap-2 text-primary">
                   <Map className="h-6 w-6" />
                   Journey Setup
                 </CardTitle>
                 <div className="text-xs font-black text-primary bg-primary/10 px-4 py-1.5 rounded-full">
                   Step {step} of 5
                 </div>
              </div>
              <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary transition-all duration-700 ease-out" 
                  style={{ width: `${(step/5) * 100}%` }}
                />
              </div>
            </CardHeader>
            <CardContent className="p-8">
               {renderStep()}
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-7 space-y-8">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-32 gap-8 animate-pulse">
              <div className="relative">
                <Loader2 className="h-24 w-24 animate-spin text-primary opacity-20" />
                <Sparkles className="h-10 w-10 text-primary absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
              </div>
              <div className="text-center space-y-3">
                <h3 className="text-3xl font-headline font-bold text-slate-900">AI is Synthesizing...</h3>
                <p className="text-lg text-muted-foreground font-medium max-w-[400px]">
                  Analyzing state data, commodity price shock metrics, and your operational capacity.
                </p>
              </div>
            </div>
          ) : result ? (
            <div className="animate-in fade-in slide-in-from-bottom-10 duration-1000 space-y-8">
              {/* Health Scores for Existing */}
              {result.healthReport && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                   {[
                     { label: 'Productivity', val: `${result.healthReport.productivityScore}%`, icon: Activity, color: 'text-emerald-600', bg: 'bg-emerald-50' },
                     { label: 'Efficiency', val: `${result.healthReport.costEfficiency}%`, icon: TrendingUp, color: 'text-blue-600', bg: 'bg-blue-50' },
                     { label: 'Disease Risk', val: result.healthReport.diseaseRisk, icon: ShieldAlert, color: 'text-orange-600', bg: 'bg-orange-50' },
                     { label: 'Water Risk', val: result.healthReport.waterRisk, icon: Droplets, color: 'text-cyan-600', bg: 'bg-cyan-50' },
                   ].map((item, i) => (
                     <Card key={i} className="rounded-3xl border-none shadow-xl p-6 text-center bg-white group hover:scale-105 transition-transform">
                        <div className={cn("h-12 w-12 mx-auto rounded-2xl flex items-center justify-center mb-3", item.bg)}>
                          <item.icon className={cn("h-6 w-6", item.color)} />
                        </div>
                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{item.label}</div>
                        <div className="text-2xl font-black text-slate-900 mt-1">{item.val}</div>
                     </Card>
                   ))}
                </div>
              )}

              {/* Financial Dashboard */}
              {result.financialEstimate && (
                <Card className="rounded-[2.5rem] border-none shadow-2xl bg-white p-10 border-l-[12px] border-l-primary relative overflow-hidden group">
                  <DollarSign className="absolute -right-8 -bottom-8 h-48 w-48 text-slate-50 group-hover:scale-110 transition-transform duration-1000" />
                  <div className="grid md:grid-cols-3 gap-10 relative z-10">
                    <div className="space-y-2">
                       <Label className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                         <DollarSign className="h-4 w-4" /> Start-up Capital
                       </Label>
                       <div className="text-3xl font-black text-primary leading-none">{result.financialEstimate.initialCapital}</div>
                    </div>
                    <div className="space-y-2">
                       <Label className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                         <TrendingDown className="h-4 w-4" /> Monthly OpEx
                       </Label>
                       <div className="text-3xl font-black text-slate-800 leading-none">{result.financialEstimate.operatingExpense}</div>
                    </div>
                    <div className="space-y-2">
                       <Label className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                         <TrendingUp className="h-4 w-4" /> Target ROI
                       </Label>
                       <div className="text-3xl font-black text-emerald-600 leading-none">{result.financialEstimate.expectedRoiTime}</div>
                    </div>
                  </div>
                </Card>
              )}

              {/* AI Motivation */}
              <Card className="rounded-[3rem] border-none bg-primary text-white p-12 relative overflow-hidden shadow-[0_30px_60px_-15px_rgba(32,91,90,0.4)]">
                <Sparkles className="absolute -top-6 -right-6 h-40 w-40 opacity-10 rotate-12" />
                <div className="relative z-10 space-y-6">
                  <h3 className="text-3xl md:text-4xl font-headline font-bold leading-tight">Farmer's Calling</h3>
                  <p className="text-xl md:text-2xl text-primary-foreground font-medium leading-relaxed italic opacity-90">
                    "{result.motivationAI}"
                  </p>
                </div>
              </Card>

              {/* Scouting Results */}
              {result.landOptions && result.landOptions.length > 0 && (
                <Card className="rounded-[3rem] shadow-2xl border-none bg-white overflow-hidden">
                  <CardHeader className="bg-blue-50 p-10 border-b">
                     <CardTitle className="text-2xl font-headline font-bold flex items-center gap-3 text-blue-900">
                        <MapPin className="h-7 w-7 text-blue-600" />
                        AI Land Scout Report
                     </CardTitle>
                  </CardHeader>
                  <CardContent className="p-10">
                    <div className="grid md:grid-cols-1 lg:grid-cols-3 gap-6">
                      {result.landOptions.map((land, i) => (
                        <div key={i} className="p-6 rounded-[2rem] bg-slate-50 border border-slate-200 space-y-4 hover:border-blue-400 transition-all hover:bg-white hover:shadow-xl group">
                           <div className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em]">{land.location}</div>
                           <div className="text-2xl font-black text-slate-800 tracking-tighter">{land.priceEstimate}</div>
                           <Badge variant="outline" className="bg-white border-blue-100 text-blue-700">{land.size}</Badge>
                           <div className="pt-4 border-t border-slate-200 mt-2">
                             <p className="text-xs italic leading-relaxed text-slate-500 font-medium">
                               "{land.suitabilityReason}"
                             </p>
                           </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Action Plan */}
              <Card className="rounded-[3rem] shadow-2xl border-none bg-white overflow-hidden">
                <CardHeader className="bg-primary/5 p-10 border-b">
                  <CardTitle className="text-2xl font-headline font-bold flex items-center gap-3 text-primary">
                    <Zap className="h-7 w-7 fill-primary/20" />
                    AI Action Directives
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-10 space-y-4">
                  {result.recommendations.map((rec, i) => (
                    <div key={i} className="flex gap-5 p-6 rounded-[2rem] bg-white border border-slate-100 shadow-sm transition-all hover:translate-x-2">
                      <div className="h-10 w-10 rounded-2xl bg-primary text-white flex items-center justify-center shrink-0 font-black text-sm">
                        {i + 1}
                      </div>
                      <p className="text-base font-bold leading-relaxed text-slate-700">{rec}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Roadmap Steps */}
              <Card className="rounded-[3rem] shadow-2xl border-none bg-white overflow-hidden">
                <CardHeader className="bg-emerald-500 p-10 border-b">
                  <CardTitle className="text-2xl font-headline font-bold flex items-center gap-3 text-white">
                    <CheckCircle2 className="h-7 w-7" />
                    Pathfinder Execution Plan
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-10 space-y-4">
                  {result.roadmap.map((stepStr, i) => (
                    <div key={i} className="flex gap-5 p-5 rounded-2xl bg-slate-50 border border-slate-100 group hover:bg-white transition-colors">
                      <div className="h-10 w-10 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0 text-sm font-black shadow-lg">
                        {i + 1}
                      </div>
                      <p className="text-base font-bold text-slate-700 leading-relaxed group-hover:text-slate-900">
                        {stepStr}
                      </p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          ) : (
            <div className="h-full min-h-[600px] flex flex-col items-center justify-center bg-white/40 backdrop-blur-sm border-4 border-dashed rounded-[4rem] p-12 text-center gap-8 shadow-inner group">
              <div className="h-32 w-32 bg-primary/10 rounded-[3rem] flex items-center justify-center transition-all group-hover:scale-110 group-hover:rotate-12 duration-500 shadow-xl">
                <Compass className="h-16 w-16 text-primary" />
              </div>
              <div className="space-y-4 max-w-[450px]">
                <h3 className="text-3xl font-headline font-bold text-slate-900 tracking-tight leading-none">Unlock Deep Farm Intelligence</h3>
                <p className="text-slate-500 text-lg font-medium leading-relaxed">
                  Provide your farm details to trigger our high-fidelity Gemini analysis. We'll identify risks, calculate needs, and build your roadmap to self-sufficiency.
                </p>
              </div>
              <div className="flex items-center gap-2 text-[10px] font-black text-primary uppercase tracking-[0.3em] opacity-40">
                Grounded in ASEAN regional agriculture data
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
