"use client"

import * as React from "react"
import { Search, MapPin, Phone, Globe, Navigation, Star, Loader2, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { findSuppliers, type SupplierFinderOutput } from "@/ai/flows/supplier-finder-flow"
import { useToast } from "@/hooks/use-toast"

export default function SuppliersPage() {
  const [query, setQuery] = React.useState("")
  const [isSearching, setIsSearching] = React.useState(false)
  const [results, setResults] = React.useState<SupplierFinderOutput | null>(null)
  const { toast } = useToast()

  const handleSearch = async (e?: React.FormEvent) => {
    e?.preventDefault()
    if (!query.trim()) return

    setIsSearching(true)
    try {
      // Mock location for demo
      const output = await findSuppliers({
        latitude: 3.1390,
        longitude: 101.6869,
        productType: query
      })
      setResults(output)
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Search Failed",
        description: "Could not retrieve suppliers at this time."
      })
    } finally {
      setIsSearching(false)
    }
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-headline font-bold text-primary">Local Supplier Finder</h2>
          <p className="text-muted-foreground">Find the best resources for your farm, summarized by AI.</p>
        </div>
        <form onSubmit={handleSearch} className="flex gap-2 w-full md:max-w-md">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input 
              placeholder="e.g. Urea fertilizer, rice seeds..." 
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-10 h-12 rounded-xl shadow-sm"
            />
          </div>
          <Button type="submit" className="h-12 px-6 rounded-xl bg-primary" disabled={isSearching}>
            {isSearching ? <Loader2 className="h-5 w-5 animate-spin" /> : "Find"}
          </Button>
        </form>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Results List */}
        <div className="lg:col-span-2 space-y-6">
          {!results && !isSearching && (
             <div className="h-[400px] flex flex-col items-center justify-center bg-white border rounded-3xl p-8 text-center gap-4">
                <div className="h-20 w-20 bg-accent/20 rounded-full flex items-center justify-center">
                  <MapPin className="h-10 w-10 text-primary/40" />
                </div>
                <div>
                   <h3 className="text-xl font-headline font-bold">Search Local Resources</h3>
                   <p className="text-sm text-muted-foreground max-w-[300px] mx-auto">Enter what you need above to find authorized suppliers near your location.</p>
                </div>
                <div className="flex flex-wrap justify-center gap-2 mt-2">
                  {['Fertilizer', 'Pesticides', 'Organic Seeds', 'Irrigation Tools'].map(tag => (
                    <Button key={tag} variant="outline" size="sm" className="rounded-full" onClick={() => {setQuery(tag); handleSearch();}}>
                      {tag}
                    </Button>
                  ))}
                </div>
             </div>
          )}

          {isSearching && (
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-32 bg-white rounded-3xl border animate-pulse" />
              ))}
            </div>
          )}

          {results && (
            <div className="space-y-6">
              <div className="p-6 rounded-3xl bg-secondary/10 border border-secondary/20 space-y-2">
                 <h4 className="text-xs font-bold uppercase tracking-wider text-secondary-foreground flex items-center gap-2">
                   <Star className="h-3 w-3 fill-current" />
                   AI Recommendation Summary
                 </h4>
                 <p className="text-sm text-foreground/80 leading-relaxed font-medium">{results.summary}</p>
              </div>

              <div className="grid gap-4">
                {results.suppliers.map((s, i) => (
                  <Card key={i} className="rounded-3xl border-none shadow-md hover:shadow-xl transition-shadow overflow-hidden group">
                    <div className="flex flex-col md:flex-row">
                       <div className="md:w-1/3 h-32 md:h-auto bg-[#F0F4F6] relative overflow-hidden">
                          <div className="absolute inset-0 flex items-center justify-center">
                             <MapPin className="h-12 w-12 text-primary/10" />
                          </div>
                          <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-2 py-1 rounded-full text-[10px] font-bold shadow-sm">
                            {s.distanceKm} KM AWAY
                          </div>
                       </div>
                       <CardContent className="flex-1 p-6 space-y-4 bg-white">
                          <div className="flex justify-between items-start">
                             <div>
                               <h3 className="text-xl font-headline font-bold text-primary group-hover:underline cursor-pointer">{s.name}</h3>
                               <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                                 <MapPin className="h-3 w-3" />
                                 {s.address}
                               </p>
                             </div>
                             <div className="flex gap-2">
                                <Button size="icon" variant="outline" className="rounded-full h-10 w-10 border-primary text-primary hover:bg-primary hover:text-white">
                                   <Phone className="h-4 w-4" />
                                </Button>
                                <Button size="icon" variant="outline" className="rounded-full h-10 w-10 border-primary text-primary hover:bg-primary hover:text-white" asChild>
                                   <a href={s.mapLink} target="_blank" rel="noopener noreferrer"><Navigation className="h-4 w-4" /></a>
                                </Button>
                             </div>
                          </div>
                          <div className="flex items-center gap-4 text-xs font-medium pt-2">
                             <span className="flex items-center gap-1 text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
                               <Star className="h-3 w-3 fill-current" />
                               4.8 Rating
                             </span>
                             <span className="text-muted-foreground border-l pl-4">Verified Supplier</span>
                          </div>
                       </CardContent>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Info / Map Placeholder Sidebar */}
        <div className="space-y-6">
           <Card className="rounded-3xl shadow-xl border-none overflow-hidden bg-primary h-[500px] relative">
              <div className="absolute inset-0 flex items-center justify-center p-8 text-center flex-col gap-4 text-white">
                 <div className="h-20 w-20 bg-white/10 rounded-full flex items-center justify-center animate-pulse">
                   <Navigation className="h-10 w-10" />
                 </div>
                 <h3 className="text-2xl font-headline font-bold">Interactive Map</h3>
                 <p className="text-primary-foreground/70 text-sm">Visualizing {results?.suppliers.length || 0} locations near Selangor.</p>
                 <Button className="bg-white text-primary hover:bg-white/90 rounded-full font-bold">Launch Full Map</Button>
              </div>
              <div className="absolute bottom-6 left-6 right-6 p-4 rounded-2xl bg-white/10 backdrop-blur border border-white/20 text-xs text-white">
                 <div className="flex items-center gap-2 mb-2 font-bold uppercase tracking-widest text-[10px] opacity-70">
                    <Info className="h-3 w-3" />
                    Pro Tip
                 </div>
                 Suppliers with the 'Verified' badge are authorized by the Ministry of Agriculture.
              </div>
           </Card>
        </div>
      </div>
    </div>
  )
}