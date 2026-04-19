
"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Sprout, Mail, ArrowRight, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/firebase"
import { signInAnonymously } from "firebase/auth"
import { useToast } from "@/hooks/use-toast"

export default function LoginPage() {
  const [step, setStep] = React.useState<"email" | "otp">("email")
  const [email, setEmail] = React.useState("")
  const [otp, setOtp] = React.useState("")
  const [loading, setLoading] = React.useState(false)
  const router = useRouter()
  const auth = useAuth()
  const { toast } = useToast()

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    // Simulate sending OTP via Brevo (Backend would handle this)
    // For MVP prototyping, we'll simulate the delay then move to OTP step
    setTimeout(() => {
      setStep("otp")
      setLoading(false)
      toast({
        title: "OTP Sent",
        description: `Verification code sent to ${email}`,
      })
    }, 1500)
  }

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      // In a real app, you'd verify the OTP server-side and then sign in.
      // For this prototype, we'll sign in anonymously to initialize the Firebase session.
      await signInAnonymously(auth)
      router.push("/dashboard")
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Login Failed",
        description: "Invalid OTP or authentication error.",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 gradient-bg">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center mb-8 gap-2">
          <div className="h-16 w-16 bg-primary rounded-3xl flex items-center justify-center shadow-lg shadow-primary/20">
            <Sprout className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-3xl font-headline font-bold text-primary tracking-tight text-center">TUAI</h1>
          <p className="text-muted-foreground font-medium text-center">Smart Farming. Secure Future.</p>
        </div>

        <Card className="border-none shadow-2xl rounded-3xl overflow-hidden">
          <CardHeader className="space-y-1 bg-white pt-8">
            <CardTitle className="text-2xl font-headline font-bold text-center">
              {step === "email" ? "Welcome Back" : "Verify It's You"}
            </CardTitle>
            <CardDescription className="text-center">
              {step === "email" 
                ? "Enter your email address to sign in" 
                : `Enter the 6-digit code sent to ${email}`}
            </CardDescription>
          </CardHeader>
          <CardContent className="bg-white pb-8 px-8">
            {step === "email" ? (
              <form onSubmit={handleSendOtp} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                      id="email"
                      placeholder="farmer@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10 h-12 rounded-xl"
                      type="email"
                      required
                    />
                  </div>
                </div>
                <Button disabled={loading} className="w-full h-12 rounded-xl bg-primary text-white font-bold group">
                  {loading ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <>
                      Send Login Link
                      <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </Button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOtp} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="otp">6-Digit Code</Label>
                  <Input
                    id="otp"
                    placeholder="000000"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="h-12 rounded-xl text-center text-2xl tracking-[0.5em] font-headline"
                    maxLength={6}
                    required
                  />
                </div>
                <Button disabled={loading} className="w-full h-12 rounded-xl bg-primary text-white font-bold group">
                  {loading ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    "Verify & Sign In"
                  )}
                </Button>
                <div className="text-center">
                   <button 
                    type="button"
                    onClick={() => setStep("email")}
                    className="text-sm font-medium text-primary hover:underline"
                   >
                     Change email address
                   </button>
                </div>
              </form>
            )}
          </CardContent>
          <CardFooter className="bg-accent/30 py-4 flex flex-col items-center gap-2">
            <p className="text-xs text-muted-foreground">By signing in, you agree to our terms.</p>
            <Link href="/" className="text-xs font-semibold text-primary hover:underline">Back to Home</Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
