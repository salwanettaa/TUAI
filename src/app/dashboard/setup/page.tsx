
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
    targetCrop: '',
    hasLand: false,
    motivation: '',
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
                  <Label className="text-[10px] font-black uppercase tracking-widest text-primary/60">Select Your Path</Label>
                  <Tabs 
                    value={formData.status} 
                    onValueChange={(v) => setFormData(p => ({...p, status: v as any}))}
                    className="w-full"
                  >
                    <TabsList className="grid w-full grid-cols-2 h-14 md:h-16 rounded-2xl bg-slate-100 p-1 shadow-inner">
                      <TabsTrigger value="beginner" className="rounded-xl font-bold text-xs md:text-sm px-2">
                        New Farmer
                      </TabsTrigger>
                      <TabsTrigger value="existing" className="rounded-xl font-bold text-xs md:text-sm px-2">
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
            <Button onClick={nextStep} className="w-full h-14 rounded-2xl bg-primary text-white font-bold text-lg shadow-lg">
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
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                      className="mt-2 rounded-xl bg-white h-12"
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
                      <TabsTrigger value="no" className="rounded-md">No (AI Scout)</TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>
                <div className="flex items-start space-x-3 p-4 rounded-2xl border bg-primary/5">
                   <Checkbox id="techInterest" checked={formData.techInterest} onCheckedChange={(v) => setFormData(p => ({...p, techInterest: !!v}))} className="mt-1" />
                   <Label htmlFor="techInterest" className="text-sm font-medium text-slate-700 leading-relaxed cursor-pointer">
                      <strong>AI Interest:</strong> Use robots to minimize labor.
                   </Label>
                </div>
              </div>
            )}
            <div className="flex gap-3">
              <Button variant="outline" onClick={prevStep} className="flex-1 h-14 rounded-2xl font-bold">Back</Button>
              <Button onClick={nextStep} className="flex-1 h-14 rounded-2xl bg-primary text-white font-bold">Next</Button>
            </div>
          </div>
        )
      case 3:
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
            {formData.status === 'existing' ? (
              <div className="space-y-4">
                <Label className="text-[10px] font-black uppercase tracking-widest text-primary/60">Current Pain Points</Label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {['Crop disease', 'Low yield', 'Expensive fertilizer', 'Water issues', 'Labor shortage', 'High mortality'].map(p => (
                    <div key={p} className={cn(
                      "flex items-center space-x-3 p-4 rounded-xl border transition-all cursor-pointer",
                      formData.problems.includes(p) ? "bg-primary/5 border-primary shadow-sm" : "bg-white border-slate-200"
                    )} onClick={() => handleProblemToggle(p)}>
                      <Checkbox 
                        id={p} 
                        checked={formData.problems.includes(p)}
                        onCheckedChange={() => handleProblemToggle(p)}
                      />
                      <Label htmlFor={p} className="text-sm font-bold text-slate-700 flex-1 cursor-pointer truncate">{p}</Label>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-5">
                <div className="space-y-2">
                  <Label className="font-bold text-slate-700">Why start farming?</Label>
                  <Textarea 
                    placeholder="e.g. To secure food for my family..."
                    value={formData.motivation}
                    onChange={(e) => setFormData(p => ({...p, motivation: e.target.value}))}
                    className="rounded-xl h-24 resize-none"
                  />
                </div>
                <div className="space-y-3">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-primary/60">Your Goals</Label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                     {['Full time income', 'Side hustle', 'Food security', 'Sustainability'].map(g => (
                        <div key={g} className={cn(
                          "flex items-center space-x-3 p-4 rounded-xl border transition-all cursor-pointer",
                          formData.goals.includes(g) ? "bg-primary/5 border-primary shadow-sm" : "bg-white border-slate-200"
                        )} onClick={() => handleGoalToggle(g)}>
                          <Checkbox checked={formData.goals.includes(g)} onCheckedChange={() => handleGoalToggle(g)} />
                          <Label className="text-sm font-bold text-slate-700 flex-1 cursor-pointer">{g}</Label>
                        </div>
                     ))}
                  </div>
                </div>
              </div>
            )}
            <div className="flex gap-3">
              <Button variant="outline" onClick={prevStep} className="flex-1 h-14 rounded-2xl font-bold">Back</Button>
              <Button onClick={nextStep} className="flex-1 h-14 rounded-2xl bg-primary text-white font-bold">Next</Button>
            </div>
          </div>
        )
      case 4:
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
            <div className="space-y-5">
               {formData.status === 'existing' ? (
                 <div className="space-y-5">
                   <Label className="text-[10px] font-black uppercase tracking-widest text-primary/60">Production Data</Label>
                   <div className="grid grid-cols-1 gap-4">
                      <div className="space-y-2">
                        <Label className="text-sm font-bold text-slate-600">Avg Yield (Kg/Metric Ton)</Label>
                        <Input 
                          placeholder="e.g. 5.5 tons/hectare"
                          value={formData.productionData.averageYield} 
                          onChange={(e) => setFormData(p => ({...p, productionData: {...p.productionData, averageYield: e.target.value}}))} 
                          className="rounded-xl h-12" 
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm font-bold text-slate-600">Monthly Usage (Feed/Fertilizer)</Label>
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
                   <Label className="text-[10px] font-black uppercase tracking-widest text-primary/60">Budget & Modal</Label>
                   <div className="space-y-3">
                     <Select value={formData.budget} onValueChange={(v) => setFormData(p => ({...p, budget: v}))}>
                      <SelectTrigger className="rounded-xl h-14 bg-white border-slate-200 px-4 font-bold text-slate-700">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="RM 0–500 (Small Scale)">RM 0–500 (Small)</SelectItem>
                        <SelectItem value="RM 5,000–20,000 (Commercial)">RM 5k–20k (Com)</SelectItem>
                        <SelectItem value="RM 50,000+ (Enterprise)">RM 50k+ (Ent)</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-[10px] text-muted-foreground font-medium italic">
                      AI uses this to calculate seeds and tools.
                    </p>
                   </div>
                 </div>
               )}
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={prevStep} className="flex-1 h-14 rounded-2xl font-bold">Back</Button>
              <Button onClick={nextStep} className="flex-1 h-14 rounded-2xl bg-primary text-white font-bold">Review</Button>
            </div>
          </div>
        )
      case 5:
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
            <div className="space-y-5 text-center py-8 bg-emerald-50/50 rounded-3xl border border-emerald-100">
               <div className="h-16 w-16 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-emerald-500/20">
                 <CheckCircle2 className="h-8 w-8 text-white" />
               </div>
               <div className="space-y-2 px-4">
                 <h3 className="text-xl font-headline font-bold text-slate-900">Analysis Ready</h3>
                 <p className="text-xs text-slate-600 font-medium leading-relaxed">
                    AI will now synthesize your data and generate your professional roadmap.
                 </p>
               </div>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={prevStep} className="flex-1 h-14 rounded-2xl font-bold">Back</Button>
              <Button onClick={handleStartPlanning} disabled={loading} className="flex-1 h-14 rounded-2xl bg-primary text-white font-bold">
                {loading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  "Generate"
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
    <div className="max-w-6xl mx-auto space-y-6 pb-20">
      <div className="flex flex-col gap-4 px-1">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest mb-3">
            <Compass className="h-3 w-3" />
            AI Pathfinder
          </div>
          <h2 className="text-2xl md:text-3xl font-headline font-bold text-slate-900 leading-tight">Farm Intelligence</h2>
          <p className="text-xs md:text-sm text-muted-foreground mt-1 font-medium italic">Audit your farm or start a new path to zero dependency.</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5">
          <Card className="rounded-[2rem] shadow-xl border-none bg-white overflow-hidden">
            <CardHeader className="bg-slate-50 border-b p-6 space-y-3">
              <div className="flex justify-between items-center">
                 <CardTitle className="text-lg font-headline font-bold text-primary flex items-center gap-2">
                   <Map className="h-5 w-5" />
                   Setup
                 </CardTitle>
                 <div className="text-[10px] font-black text-primary bg-primary/10 px-3 py-1 rounded-full">
                   Step {step}/5
                 </div>
              </div>
              <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary transition-all duration-500 ease-out" 
                  style={{ width: `${(step/5) * 100}%` }}
                />
              </div>
            </CardHeader>
            <CardContent className="p-6">
               {renderStep()}
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-7 space-y-6">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-6 animate-pulse bg-white/50 border-2 border-dashed rounded-[2rem] px-6">
              <div className="relative">
                <Loader2 className="h-16 w-16 animate-spin text-primary opacity-20" />
                <Sparkles className="h-6 w-6 text-primary absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
              </div>
              <div className="text-center space-y-2">
                <h3 className="text-xl font-headline font-bold text-slate-900">Synthesizing...</h3>
                <p className="text-sm text-muted-foreground font-medium max-w-[300px] mx-auto leading-relaxed">
                  Analyzing regional price shocks and production capacity.
                </p>
              </div>
            </div>
          ) : result ? (
            <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 space-y-6">
              {result.healthReport && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                   {[
                     { label: 'Yield', val: `${result.healthReport.productivityScore}%`, icon: Activity, color: 'text-emerald-600', bg: 'bg-emerald-50' },
                     { label: 'Opex', val: `${result.healthReport.costEfficiency}%`, icon: TrendingUp, color: 'text-blue-600', bg: 'bg-blue-50' },
                     { label: 'Diseases', val: result.healthReport.diseaseRisk, icon: ShieldAlert, color: 'text-orange-600', bg: 'bg-orange-50' },
                     { label: 'Water', val: result.healthReport.waterRisk, icon: Droplets, color: 'text-cyan-600', bg: 'bg-cyan-50' },
                   ].map((item, i) => (
                     <Card key={i} className="rounded-2xl border-none shadow-md p-4 text-center bg-white">
                        <div className={cn("h-10 w-10 mx-auto rounded-xl flex items-center justify-center mb-2", item.bg)}>
                          <item.icon className={cn("h-5 w-5", item.color)} />
                        </div>
                        <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{item.label}</div>
                        <div className="text-base font-black text-slate-900 mt-0.5">{item.val}</div>
                     </Card>
                   ))}
                </div>
              )}

              {result.financialEstimate && (
                <Card className="rounded-[2rem] border-none shadow-xl bg-white p-6 border-l-[8px] border-l-primary relative overflow-hidden group">
                  <DollarSign className="absolute -right-6 -bottom-6 h-32 w-32 text-slate-50 group-hover:scale-110 transition-transform duration-1000" />
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 relative z-10">
                    <div className="space-y-1">
                       <Label className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                         <DollarSign className="h-3 w-3" /> Capital
                       </Label>
                       <div className="text-xl font-black text-primary leading-none">{result.financialEstimate.initialCapital}</div>
                    </div>
                    <div className="space-y-1">
                       <Label className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                         <TrendingDown className="h-3 w-3" /> Monthly
                       </Label>
                       <div className="text-xl font-black text-slate-800 leading-none">{result.financialEstimate.operatingExpense}</div>
                    </div>
                    <div className="space-y-1">
                       <Label className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                         <TrendingUp className="h-3 w-3" /> ROI
                       </Label>
                       <div className="text-xl font-black text-emerald-600 leading-none">{result.financialEstimate.expectedRoiTime}</div>
                    </div>
                  </div>
                </Card>
              )}

              <Card className="rounded-[2.5rem] border-none bg-primary text-white p-8 relative overflow-hidden shadow-xl">
                <div className="relative z-10 space-y-4">
                  <h3 className="text-xl font-headline font-bold">AI Motivation</h3>
                  <p className="text-base text-primary-foreground font-medium leading-relaxed italic opacity-95">
                    "{result.motivationAI}"
                  </p>
                </div>
              </Card>

              {result.landOptions && (
                <Card className="rounded-[2rem] shadow-xl border-none bg-white overflow-hidden">
                  <CardHeader className="bg-blue-50 p-6 border-b">
                     <CardTitle className="text-lg font-headline font-bold flex items-center gap-2 text-blue-900">
                        <MapPin className="h-5 w-5 text-blue-600" />
                        Land Scout
                     </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="grid grid-cols-1 gap-4">
                      {result.landOptions.map((land, i) => (
                        <div key={i} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 hover:border-blue-300 transition-all">
                           <div className="flex justify-between items-start">
                             <div className="text-[10px] font-black text-blue-600 uppercase tracking-widest">{land.location}</div>
                             <Badge variant="outline" className="bg-white text-[10px]">{land.size}</Badge>
                           </div>
                           <div className="text-xl font-black text-slate-800">{land.priceEstimate}</div>
                           <p className="text-[11px] italic leading-relaxed text-slate-500 font-medium">
                             {land.suitabilityReason}
                           </p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              <Card className="rounded-[2rem] shadow-xl border-none bg-white overflow-hidden">
                <CardHeader className="bg-primary/5 p-6 border-b">
                  <CardTitle className="text-lg font-headline font-bold flex items-center gap-2 text-primary">
                    <Zap className="h-5 w-5" />
                    Recommendations
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-3">
                  {result.recommendations.map((rec, i) => (
                    <div key={i} className="flex gap-4 p-4 rounded-xl bg-slate-50 border border-slate-100 shadow-sm text-sm font-bold text-slate-700 leading-relaxed">
                      <div className="h-6 w-6 rounded-lg bg-primary text-white flex items-center justify-center shrink-0 text-xs">
                        {i + 1}
                      </div>
                      {rec}
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card className="rounded-[2rem] shadow-xl border-none bg-white overflow-hidden">
                <CardHeader className="bg-emerald-500 p-6 border-b">
                  <CardTitle className="text-lg font-headline font-bold flex items-center gap-2 text-white">
                    <CheckCircle2 className="h-5 w-5" />
                    Pathfinder Roadmap
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-3">
                  {result.roadmap.map((stepStr, i) => (
                    <div key={i} className="flex gap-4 p-4 rounded-xl bg-slate-50 border border-slate-100 group hover:bg-white transition-colors">
                      <div className="h-7 w-7 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0 text-xs font-black">
                        {i + 1}
                      </div>
                      <p className="text-sm font-bold text-slate-700 leading-relaxed group-hover:text-slate-900">
                        {stepStr}
                      </p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          ) : (
            <div className="h-full min-h-[400px] flex flex-col items-center justify-center bg-white/60 backdrop-blur-sm border-2 border-dashed rounded-[3rem] p-8 text-center gap-6 shadow-inner group">
              <div className="h-20 w-20 bg-primary/10 rounded-[2rem] flex items-center justify-center transition-all group-hover:scale-110 group-hover:rotate-6 duration-500 shadow-lg">
                <Compass className="h-10 w-10 text-primary" />
              </div>
              <div className="space-y-2 max-w-[320px]">
                <h3 className="text-xl font-headline font-bold text-slate-900 leading-tight">Deep Farm Intelligence</h3>
                <p className="text-slate-500 text-sm font-medium leading-relaxed italic">
                  Complete the wizard to trigger Gemini AI analysis. We'll identify risks and build your roadmap.
                </p>
              </div>
              <div className="text-[9px] font-black text-primary uppercase tracking-[0.2em] opacity-40">
                Grounded in ASEAN regional data
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
