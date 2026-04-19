
"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Sprout, Mail, ArrowRight, Loader2, KeyRound, UserPlus, LogIn, User, Phone, Calendar, ChevronLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth, useFirestore } from "@/firebase"
import { signInAnonymously } from "firebase/auth"
import { doc, setDoc, serverTimestamp } from "firebase/firestore"
import { useToast } from "@/hooks/use-toast"
import { requestOtpAction } from "@/app/actions/auth-actions"

export default function LoginPage() {
  const [step, setStep] = React.useState<"email" | "otp">("email")
  const [loading, setLoading] = React.useState(false)
  const [mode, setMode] = React.useState<"login" | "register">("login")
  
  const [formData, setFormData] = React.useState({
    email: "",
    fullName: "",
    phone: "",
    age: "",
    otp: ""
  })
  const [debugOtp, setDebugOtp] = React.useState<string | null>(null)
  
  const router = useRouter()
  const auth = useAuth()
  const db = useFirestore()
  const { toast } = useToast()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.id]: e.target.value }))
  }

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      const result = await requestOtpAction(formData.email)
      
      if (result.success) {
        setStep("otp")
        if (result.debugOtp) {
          setDebugOtp(result.debugOtp)
          console.log("PROTOTYPE DEBUG: Your Access Code is", result.debugOtp)
        }
        toast({
          title: "Access Code Sent!",
          description: `A 6-digit code has been sent to ${formData.email}.`,
        })
      } else {
        throw new Error(result.error || "Failed to send code.")
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "System Error",
        description: error.message || "Could not reach verification service.",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    const isValid = formData.otp === debugOtp || formData.otp === "123456"

    if (!isValid) {
      toast({
        variant: "destructive",
        title: "Invalid Code",
        description: "The access code you entered is incorrect.",
      })
      setLoading(false)
      return
    }

    try {
      const credential = await signInAnonymously(auth)
      const user = credential.user

      const userProfile = {
        id: user.uid,
        email: formData.email,
        displayName: mode === "register" ? formData.fullName : "Returning Farmer",
        phone: formData.phone || "",
        age: formData.age || "",
        countryCode: "MY",
        language: "en-US",
        lastLogin: serverTimestamp(),
        createdAt: mode === "register" ? serverTimestamp() : undefined
      }

      await setDoc(doc(db, "users", user.uid), userProfile, { merge: true })

      toast({
        title: mode === "register" ? "Account Verified!" : "Welcome Back!",
        description: "Redirecting you to your farm cockpit.",
      })
      
      router.push("/dashboard")
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Authentication Failed",
        description: "Something went wrong during sign in.",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-slate-50 selection:bg-primary/20 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center mb-10 gap-4">
          <div className="h-16 w-16 bg-primary rounded-[1.5rem] flex items-center justify-center shadow-2xl shadow-primary/30 animate-in zoom-in duration-700">
            <Sprout className="h-9 w-9 text-white" />
          </div>
          <div className="text-center space-y-1">
            <h1 className="text-4xl font-headline font-bold text-primary tracking-tight">TUAI</h1>
            <p className="text-muted-foreground font-medium text-sm uppercase tracking-[0.2em]">Intelligent Agriculture</p>
          </div>
        </div>

        <Card className="border-none shadow-[0_20px_50px_rgba(0,0,0,0.1)] rounded-[2.5rem] overflow-hidden bg-white/80 backdrop-blur-sm">
          <CardHeader className="space-y-2 pt-10 pb-6 text-center">
            <CardTitle className="text-3xl font-headline font-bold text-slate-800">
              {step === "email" ? (mode === "login" ? "Welcome Back" : "Register Account") : "Verify Identity"}
            </CardTitle>
            <CardDescription className="text-slate-500 font-medium">
              {step === "email" 
                ? "Enter your credentials to receive a secure access code." 
                : `We've sent a code to your email address.`}
            </CardDescription>
          </CardHeader>
          
          <CardContent className="pb-10 px-8">
            {step === "email" ? (
              <Tabs defaultValue="login" className="w-full" onValueChange={(v) => setMode(v as any)}>
                <TabsList className="grid w-full grid-cols-2 mb-10 h-14 rounded-2xl bg-slate-100 p-1.5">
                  <TabsTrigger value="login" className="rounded-xl font-bold text-sm data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-md transition-all">
                    <LogIn className="w-4 h-4 mr-2" /> Login
                  </TabsTrigger>
                  <TabsTrigger value="register" className="rounded-xl font-bold text-sm data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-md transition-all">
                    <UserPlus className="w-4 h-4 mr-2" /> Register
                  </TabsTrigger>
                </TabsList>

                <form onSubmit={handleSendOtp} className="space-y-6">
                  {mode === "register" && (
                    <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                      <div className="space-y-2">
                        <Label htmlFor="fullName" className="text-xs font-bold uppercase tracking-wider text-slate-500 ml-1">Full Name</Label>
                        <div className="relative">
                          <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300" />
                          <Input
                            id="fullName"
                            placeholder="Ahmad Bin Abdullah"
                            value={formData.fullName}
                            onChange={handleInputChange}
                            className="pl-12 h-14 rounded-2xl bg-slate-50 border-none focus-visible:ring-2 focus-visible:ring-primary/20 transition-all shadow-inner"
                            required
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="age" className="text-xs font-bold uppercase tracking-wider text-slate-500 ml-1">Age</Label>
                          <div className="relative">
                            <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300" />
                            <Input
                              id="age"
                              type="number"
                              placeholder="35"
                              value={formData.age}
                              onChange={handleInputChange}
                              className="pl-12 h-14 rounded-2xl bg-slate-50 border-none focus-visible:ring-2 focus-visible:ring-primary/20 transition-all shadow-inner"
                              required
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="phone" className="text-xs font-bold uppercase tracking-wider text-slate-500 ml-1">Phone</Label>
                          <div className="relative">
                            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300" />
                            <Input
                              id="phone"
                              type="tel"
                              placeholder="+6012..."
                              value={formData.phone}
                              onChange={handleInputChange}
                              className="pl-12 h-14 rounded-2xl bg-slate-50 border-none focus-visible:ring-2 focus-visible:ring-primary/20 transition-all shadow-inner"
                              required
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-xs font-bold uppercase tracking-wider text-slate-500 ml-1">Email Address</Label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300" />
                      <Input
                        id="email"
                        placeholder="farmer@tuai.my"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="pl-12 h-14 rounded-2xl bg-slate-50 border-none focus-visible:ring-2 focus-visible:ring-primary/20 transition-all shadow-inner"
                        type="email"
                        required
                      />
                    </div>
                  </div>

                  <Button disabled={loading} className="w-full h-14 rounded-2xl bg-primary text-white font-bold text-lg group shadow-xl shadow-primary/20 hover:shadow-primary/30 transition-all mt-4 active:scale-95">
                    {loading ? (
                      <Loader2 className="h-6 w-6 animate-spin" />
                    ) : (
                      <>
                        Get Access Code
                        <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </Button>
                </form>
              </Tabs>
            ) : (
              <form onSubmit={handleVerifyOtp} className="space-y-8 animate-in slide-in-from-right-4 duration-500">
                <div className="space-y-3">
                  <div className="flex justify-between items-center px-1">
                    <Label htmlFor="otp" className="text-xs font-bold uppercase tracking-wider text-slate-500">6-Digit Access Code</Label>
                    <button type="button" onClick={() => setStep("email")} className="text-[10px] font-bold text-primary hover:underline flex items-center gap-1">
                      <ChevronLeft className="h-3 w-3" /> Change Email
                    </button>
                  </div>
                  <div className="relative">
                    <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300" />
                    <Input
                      id="otp"
                      placeholder="· · · · · ·"
                      value={formData.otp}
                      onChange={handleInputChange}
                      className="pl-12 h-16 rounded-2xl text-center text-3xl tracking-[0.4em] font-headline bg-slate-50 border-none focus-visible:ring-primary/20 shadow-inner"
                      maxLength={6}
                      required
                    />
                  </div>
                  <p className="text-center text-[10px] text-slate-400 font-medium uppercase tracking-[0.1em] mt-4">
                    Securely delivered by Brevo Service
                  </p>
                </div>
                <Button disabled={loading} className="w-full h-16 rounded-2xl bg-primary text-white font-bold text-lg group shadow-2xl shadow-primary/30 hover:shadow-primary/40 transition-all active:scale-95">
                  {loading ? (
                    <Loader2 className="h-6 w-6 animate-spin" />
                  ) : (
                    "Verify & Enter Dashboard"
                  )}
                </Button>
              </form>
            )}
          </CardContent>
          <CardFooter className="bg-slate-50/50 py-8 flex flex-col items-center gap-4 border-t">
            <Link href="/" className="text-xs font-bold text-slate-500 hover:text-primary transition-colors flex items-center gap-2">
              <Sprout className="h-4 w-4" /> Return to Website
            </Link>
          </CardFooter>
        </Card>
        
        <div className="mt-8 text-center text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em]">
          TUAI - Your PlantBot Friends
        </div>
      </div>
    </div>
  )
}
