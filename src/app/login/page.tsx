"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Sprout, Smartphone, ArrowRight, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function LoginPage() {
  const [step, setStep] = React.useState<"phone" | "otp">("phone")
  const [phone, setPhone] = React.useState("")
  const [otp, setOtp] = React.useState("")
  const [loading, setLoading] = React.useState(false)
  const router = useRouter()

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    // Simulate API call
    setTimeout(() => {
      setStep("otp")
      setLoading(false)
    }, 1500)
  }

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    // Simulate verification
    setTimeout(() => {
      router.push("/dashboard")
      setLoading(false)
    }, 1500)
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 gradient-bg">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center mb-8 gap-2">
          <div className="h-16 w-16 bg-primary rounded-3xl flex items-center justify-center shadow-lg shadow-primary/20">
            <Sprout className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-3xl font-headline font-bold text-primary tracking-tight">TUAI</h1>
          <p className="text-muted-foreground font-medium">Smart Farming. Secure Future.</p>
        </div>

        <Card className="border-none shadow-2xl rounded-3xl overflow-hidden">
          <CardHeader className="space-y-1 bg-white pt-8">
            <CardTitle className="text-2xl font-headline font-bold text-center">
              {step === "phone" ? "Welcome Back" : "Verify It's You"}
            </CardTitle>
            <CardDescription className="text-center">
              {step === "phone" 
                ? "Enter your mobile number to sign in" 
                : `Enter the code we sent to +${phone}`}
            </CardDescription>
          </CardHeader>
          <CardContent className="bg-white pb-8 px-8">
            {step === "phone" ? (
              <form onSubmit={handleSendOtp} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <div className="relative">
                    <Smartphone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                      id="phone"
                      placeholder="60123456789"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="pl-10 h-12 rounded-xl"
                      type="tel"
                      required
                    />
                  </div>
                </div>
                <Button disabled={loading} className="w-full h-12 rounded-xl bg-primary text-white font-bold group">
                  {loading ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <>
                      Send OTP 
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
                    className="h-12 rounded-xl text-center text-2xl tracking-[1em] font-headline"
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
                    onClick={() => setStep("phone")}
                    className="text-sm font-medium text-primary hover:underline"
                   >
                     Change phone number
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