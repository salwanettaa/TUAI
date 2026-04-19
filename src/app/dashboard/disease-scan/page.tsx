"use client"

import * as React from "react"
import { Sprout, Upload, Camera, Loader2, CheckCircle2, AlertCircle, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { scanCrop, type ScanCropOutput } from "@/ai/flows/scan-crop-flow"
import { useToast } from "@/hooks/use-toast"
import Image from "next/image"

export default function DiseaseScanPage() {
  const [image, setImage] = React.useState<string | null>(null)
  const [description, setDescription] = React.useState("")
  const [isAnalyzing, setIsAnalyzing] = React.useState(false)
  const [result, setResult] = React.useState<ScanCropOutput | null>(null)
  const fileInputRef = React.useRef<HTMLInputElement>(null)
  const { toast } = useToast()

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
    if (!image) {
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
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Analysis Failed",
        description: "An error occurred while analyzing the image. Please try again.",
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
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-headline font-bold text-primary">Crop Disease Intelligence</h2>
        <p className="text-muted-foreground">Upload a clear photo of the affected area for instant AI diagnosis.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Input Section */}
        <Card className="rounded-3xl shadow-xl border-none overflow-hidden">
          <CardHeader className="bg-primary/5 pb-4">
            <CardTitle className="text-lg flex items-center gap-2">
              <Camera className="h-5 w-5 text-primary" />
              Capture or Upload
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6 space-y-6">
            <div 
              className={`aspect-square rounded-2xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-colors relative overflow-hidden ${image ? 'border-primary bg-primary/5' : 'border-muted-foreground/20 hover:border-primary/50'}`}
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
              <label className="text-sm font-bold">Add Symptoms (Optional)</label>
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
                  Analyzing with Gemini Flash...
                </>
              ) : (
                <>
                  Start Diagnosis
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Results Section */}
        <div className="space-y-6">
          {!result && !isAnalyzing && (
            <Card className="rounded-3xl border-none bg-accent/10 h-full flex items-center justify-center text-center p-12">
              <div className="space-y-4">
                <div className="h-20 w-20 bg-white rounded-full flex items-center justify-center mx-auto shadow-sm">
                  <Info className="h-10 w-10 text-muted-foreground/40" />
                </div>
                <div>
                  <h3 className="text-xl font-headline font-bold text-muted-foreground">Waiting for Scan</h3>
                  <p className="text-sm text-muted-foreground/60 max-w-[250px]">Upload a photo to see the diagnostic report here.</p>
                </div>
              </div>
            </Card>
          )}

          {isAnalyzing && (
             <Card className="rounded-3xl border-none shadow-xl animate-pulse">
                <div className="h-48 bg-muted rounded-t-3xl" />
                <div className="p-8 space-y-4">
                  <div className="h-6 w-3/4 bg-muted rounded" />
                  <div className="h-4 w-full bg-muted rounded" />
                  <div className="h-4 w-full bg-muted rounded" />
                  <div className="h-4 w-1/2 bg-muted rounded" />
                </div>
             </Card>
          )}

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
                   <Button className="flex-1 rounded-xl bg-primary">Log to Records</Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}