
"use client"

import * as React from "react"
import { Sprout, Upload, Camera, Loader2, CheckCircle2, AlertCircle, Info, History } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { scanCrop, type ScanCropOutput } from "@/ai/flows/scan-crop-flow"
import { useToast } from "@/hooks/use-toast"
import Image from "next/image"
import { useFirestore, useUser, useMemoFirebase, useCollection } from "@/firebase"
import { collection, doc, serverTimestamp } from "firebase/firestore"
import { addDocumentNonBlocking } from "@/firebase/non-blocking-updates"

export default function DiseaseScanPage() {
  const [image, setImage] = React.useState<string | null>(null)
  const [description, setDescription] = React.useState("")
  const [isAnalyzing, setIsAnalyzing] = React.useState(false)
  const [result, setResult] = React.useState<ScanCropOutput | null>(null)
  const fileInputRef = React.useRef<HTMLInputElement>(null)
  const { toast } = useToast()
  const { user } = useUser()
  const db = useFirestore()

  const scansQuery = useMemoFirebase(() => {
    if (!db || !user) return null
    return collection(db, "users", user.uid, "cropScanResults")
  }, [db, user])

  const { data: scanHistory } = useCollection(scansQuery)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setImage(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleScan = async () => {
    if (!image || !user) {
      toast({
        variant: "destructive",
        title: "No Image",
        description: "Please upload or take a photo of the crop.",
      })
      return
    }

    setIsAnalyzing(true)
    setResult(null)

    try {
      const output = await scanCrop({
        photoDataUri: image,
        description: description || "Analyzing crop health...",
      })
      setResult(output)

      // Save to Firestore
      const scanRef = collection(db, "users", user.uid, "cropScanResults")
      addDocumentNonBlocking(scanRef, {
        userId: user.uid,
        imageStoragePath: "simulated_path", // In production, upload to Firebase Storage
        scanDate: new Date().toISOString(),
        diseaseIdentified: output.diseaseName || "None",
        confidenceScore: output.confidenceScore,
        recommendations: output.treatmentRecommendation,
        status: "Processed",
        createdAt: serverTimestamp()
      })

      toast({
        title: "Scan Complete",
        description: "Diagnosis saved to your records.",
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Analysis Failed",
        description: "An error occurred while analyzing the image.",
      })
    } finally {
      setIsAnalyzing(false)
    }
  }

  const reset = () => {
    setImage(null)
    setDescription("")
    setResult(null)
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-2">
          <h2 className="text-3xl font-headline font-bold text-primary">Crop Disease Intelligence</h2>
          <p className="text-muted-foreground">Upload a photo for instant AI diagnosis grounded in regional data.</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <Card className="rounded-3xl shadow-xl border-none overflow-hidden bg-white">
            <CardHeader className="bg-primary/5 pb-4">
              <CardTitle className="text-lg flex items-center gap-2">
                <Camera className="h-5 w-5 text-primary" />
                New Analysis
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              <div 
                className={`aspect-video md:aspect-square md:max-w-md mx-auto rounded-2xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-colors relative overflow-hidden ${image ? 'border-primary bg-primary/5' : 'border-muted-foreground/20 hover:border-primary/50'}`}
                onClick={() => !image && fileInputRef.current?.click()}
              >
                {image ? (
                  <>
                    <Image src={image} alt="Crop to analyze" fill className="object-cover" />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                      <Button variant="secondary" onClick={() => fileInputRef.current?.click()}>Change Image</Button>
                    </div>
                  </>
                ) : (
                  <>
                    <Upload className="h-12 w-12 text-muted-foreground/30 mb-4" />
                    <p className="text-sm font-medium text-muted-foreground">Click to upload or take photo</p>
                    <p className="text-xs text-muted-foreground/50 mt-1">JPEG, PNG up to 10MB</p>
                  </>
                )}
              </div>
              <input 
                type="file" 
                accept="image/*" 
                className="hidden" 
                ref={fileInputRef} 
                onChange={handleFileChange}
                capture="environment"
              />
              
              <div className="space-y-2">
                <label className="text-sm font-bold">Describe symptoms (Optional)</label>
                <Textarea 
                  placeholder="E.g. Brown spots on edges, wilting since Tuesday..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="rounded-xl resize-none h-24"
                />
              </div>

              <Button 
                className="w-full h-12 rounded-xl bg-primary text-white font-bold text-lg shadow-lg shadow-primary/20"
                onClick={handleScan}
                disabled={isAnalyzing || !image}
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Gemini AI Analyzing...
                  </>
                ) : (
                  "Start Diagnosis"
                )}
              </Button>
            </CardContent>
          </Card>

          {result && (
            <Card className="rounded-3xl shadow-xl border-none overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
              <CardHeader className={result.diseaseIdentified ? "bg-orange-500 text-white" : "bg-emerald-500 text-white"}>
                <div className="flex justify-between items-center">
                  <CardTitle className="flex items-center gap-2">
                    {result.diseaseIdentified ? <AlertCircle className="h-6 w-6" /> : <CheckCircle2 className="h-6 w-6" />}
                    {result.diseaseIdentified ? "Disease Identified" : "Healthy Crop Detected"}
                  </CardTitle>
                  <div className="text-xs font-bold bg-white/20 px-2 py-1 rounded-full">
                    Confidence: {result.confidenceScore}%
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-8 space-y-6 bg-white">
                {result.diseaseName && (
                  <div>
                    <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">Diagnosis</h4>
                    <p className="text-2xl font-headline font-bold text-foreground">{result.diseaseName}</p>
                  </div>
                )}
                
                <div>
                  <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Recommended Actions</h4>
                  <div className="p-5 rounded-2xl bg-accent/10 text-sm leading-relaxed whitespace-pre-line text-foreground/80">
                    {result.treatmentRecommendation}
                  </div>
                </div>

                <div className="flex gap-4">
                   <Button variant="outline" className="flex-1 rounded-xl" onClick={reset}>Scan Another</Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          <Card className="rounded-3xl shadow-xl border-none bg-white h-fit">
            <CardHeader className="border-b">
              <CardTitle className="text-lg flex items-center gap-2">
                <History className="h-5 w-5 text-primary" />
                Recent Scans
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 px-0">
              <div className="space-y-1">
                {scanHistory?.map((scan) => (
                  <div key={scan.id} className="flex items-center justify-between px-6 py-3 hover:bg-accent/5 transition-colors border-b last:border-0">
                    <div>
                      <div className="text-sm font-bold">{scan.diseaseIdentified}</div>
                      <div className="text-[10px] text-muted-foreground">{new Date(scan.scanDate).toLocaleDateString()}</div>
                    </div>
                    <div className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                      {scan.confidenceScore}%
                    </div>
                  </div>
                ))}
                {(!scanHistory || scanHistory.length === 0) && (
                  <div className="px-6 py-8 text-center text-muted-foreground text-sm italic">
                    No scan history yet.
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-3xl shadow-xl border-none bg-secondary/10 p-6 space-y-4">
            <div className="h-10 w-10 bg-white rounded-full flex items-center justify-center shadow-sm">
              <Info className="h-6 w-6 text-secondary" />
            </div>
            <div>
              <h3 className="text-lg font-headline font-bold">Pro Tip</h3>
              <p className="text-sm text-muted-foreground leading-relaxed mt-1">
                For best results, take photos in natural light and focus on the transition area between healthy and affected tissue.
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
