import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  Sprout, 
  ShieldAlert, 
  Thermometer, 
  CloudRain, 
  TrendingUp, 
  AlertTriangle,
  ArrowRight,
  Plus
} from "lucide-react"
import Link from "next/link"

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      {/* Welcome & Region Stats */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 flex flex-col justify-between p-8 rounded-3xl bg-primary text-white shadow-2xl shadow-primary/20">
          <div>
            <h2 className="text-3xl font-headline font-bold mb-2">Selamat Pagi, Farmer Ahmad!</h2>
            <p className="text-primary-foreground/80 max-w-[500px]">Your Padi fields in Selangor are showing healthy growth. Weather looks optimal for the next 48 hours.</p>
          </div>
          <div className="flex gap-4 mt-8">
            <Link href="/dashboard/disease-scan">
              <Button size="lg" className="bg-white text-primary hover:bg-white/90 rounded-xl font-bold">
                <Plus className="mr-2 h-5 w-5" /> New Analysis
              </Button>
            </Link>
          </div>
        </div>
        <Card className="rounded-3xl border-none shadow-xl bg-white overflow-hidden">
          <CardHeader className="bg-accent/30 pb-4">
             <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Local Weather</CardTitle>
          </CardHeader>
          <CardContent className="pt-6 space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center">
                  <Thermometer className="h-6 w-6 text-orange-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold">32°C</div>
                  <div className="text-xs text-muted-foreground">Hot & Humid</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <CloudRain className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold">12%</div>
                  <div className="text-xs text-muted-foreground">Rain Chance</div>
                </div>
              </div>
            </div>
            <div className="p-4 rounded-xl bg-[#F0F4F6] text-xs font-medium text-muted-foreground">
              Tip: Monitor moisture levels tonight. Potential dry spell starting Tuesday.
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Critical Alerts */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="rounded-2xl border-l-4 border-l-destructive shadow-md hover:shadow-lg transition-shadow">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <ShieldAlert className="h-5 w-5 text-destructive" />
              <span className="text-[10px] font-bold uppercase bg-destructive/10 text-destructive px-2 py-0.5 rounded-full">High Risk</span>
            </div>
            <CardTitle className="text-sm font-bold mt-2">Export Ban Detected</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground leading-relaxed">India has restricted fertilizer exports. Local prices may surge within 14 days.</p>
            <Link href="/dashboard/risk-intel">
              <Button variant="link" size="sm" className="px-0 h-auto text-primary text-xs mt-2 group">
                View Plan <ArrowRight className="ml-1 h-3 w-3 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-l-4 border-l-orange-500 shadow-md hover:shadow-lg transition-shadow">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <TrendingUp className="h-5 w-5 text-orange-500" />
              <span className="text-[10px] font-bold uppercase bg-orange-100 text-orange-600 px-2 py-0.5 rounded-full">Market</span>
            </div>
            <CardTitle className="text-sm font-bold mt-2">Padi Prices Up</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground leading-relaxed">Local commodity exchange reporting 4% increase in premium grain demand.</p>
            <Link href="/dashboard/chat">
              <Button variant="link" size="sm" className="px-0 h-auto text-primary text-xs mt-2 group">
                Ask Copilot <ArrowRight className="ml-1 h-3 w-3 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-l-4 border-l-primary shadow-md hover:shadow-lg transition-shadow">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <Sprout className="h-5 w-5 text-primary" />
              <span className="text-[10px] font-bold uppercase bg-primary/10 text-primary px-2 py-0.5 rounded-full">Health</span>
            </div>
            <CardTitle className="text-sm font-bold mt-2">Treatment Due</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground leading-relaxed">Recommended fungal prevention for Block A scheduled for tomorrow.</p>
            <Link href="/dashboard/records">
              <Button variant="link" size="sm" className="px-0 h-auto text-primary text-xs mt-2 group">
                Check Logs <ArrowRight className="ml-1 h-3 w-3 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-l-4 border-l-secondary shadow-md hover:shadow-lg transition-shadow">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <AlertTriangle className="h-5 w-5 text-secondary" />
              <span className="text-[10px] font-bold uppercase bg-secondary/10 text-secondary-foreground px-2 py-0.5 rounded-full">System</span>
            </div>
            <CardTitle className="text-sm font-bold mt-2">Cloud Synced</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground leading-relaxed">All regional data indexes are up to date. Latest ministry policies verified.</p>
            <Button variant="link" size="sm" className="px-0 h-auto text-primary text-xs mt-2">System Healthy</Button>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Area */}
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
           <Card className="rounded-3xl shadow-xl border-none">
             <CardHeader>
                <CardTitle className="font-headline font-bold">Recent Activities</CardTitle>
                <CardDescription>History of your farm actions and AI diagnostics</CardDescription>
             </CardHeader>
             <CardContent>
                <div className="space-y-6">
                  {[
                    { title: "Disease Scan: Blast Disease", date: "2 hours ago", type: "scan", result: "Treatment Applied" },
                    { title: "Price Check: Fertilizer", date: "Yesterday", type: "market", result: "Supplier Found" },
                    { title: "Policy Update", date: "2 days ago", type: "policy", result: "Subsidy Eligible" },
                  ].map((act, i) => (
                    <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-accent/20">
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-full bg-white flex items-center justify-center shadow-sm">
                          {act.type === 'scan' ? <Sprout className="h-5 w-5 text-primary" /> : act.type === 'market' ? <TrendingUp className="h-5 w-5 text-orange-500" /> : <ShieldAlert className="h-5 w-5 text-blue-500" />}
                        </div>
                        <div>
                          <div className="text-sm font-bold">{act.title}</div>
                          <div className="text-[10px] text-muted-foreground">{act.date}</div>
                        </div>
                      </div>
                      <div className="text-xs font-semibold px-3 py-1 rounded-full bg-white text-muted-foreground border">
                        {act.result}
                      </div>
                    </div>
                  ))}
                </div>
                <Button variant="ghost" className="w-full mt-6 text-primary font-bold">View Full Activity Log</Button>
             </CardContent>
           </Card>
        </div>

        <div className="space-y-8">
           <Card className="rounded-3xl shadow-xl border-none bg-secondary/10">
             <CardHeader>
                <CardTitle className="font-headline font-bold flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-secondary" />
                  Ask Copilot
                </CardTitle>
                <CardDescription>Instant help for your farm</CardDescription>
             </CardHeader>
             <CardContent className="space-y-4">
                <div className="p-3 bg-white rounded-2xl border text-sm italic text-muted-foreground">
                  "How much fertilizer should I use for 5 acres of Padi?"
                </div>
                <div className="p-3 bg-white rounded-2xl border text-sm italic text-muted-foreground">
                  "What's the best treatment for brown spots?"
                </div>
                <Link href="/dashboard/chat">
                  <Button className="w-full bg-secondary text-white hover:bg-secondary/90 rounded-xl font-bold mt-2">
                    Start Chatting
                  </Button>
                </Link>
             </CardContent>
           </Card>

           <Card className="rounded-3xl shadow-xl border-none">
             <CardHeader>
                <CardTitle className="font-headline font-bold">Quick Finder</CardTitle>
             </CardHeader>
             <CardContent className="grid grid-cols-2 gap-4">
                <Link href="/dashboard/suppliers?q=fertilizer" className="p-4 rounded-2xl bg-[#F0F4F6] hover:bg-primary hover:text-white transition-colors text-center">
                  <MapPin className="h-6 w-6 mx-auto mb-2" />
                  <span className="text-xs font-bold">Fertilizer</span>
                </Link>
                <Link href="/dashboard/suppliers?q=seeds" className="p-4 rounded-2xl bg-[#F0F4F6] hover:bg-primary hover:text-white transition-colors text-center">
                  <Sprout className="h-6 w-6 mx-auto mb-2" />
                  <span className="text-xs font-bold">Seeds</span>
                </Link>
             </CardContent>
           </Card>
        </div>
      </div>
    </div>
  )
}