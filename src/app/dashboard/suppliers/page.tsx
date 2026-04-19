
"use client"

import * as React from "react"
import { Search, MapPin, Phone, Navigation, Star, Loader2, Info, Navigation2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { findSuppliers, type SupplierFinderOutput } from "@/ai/flows/supplier-finder-flow"
import { useToast } from "@/hooks/use-toast"

export default function SuppliersPage() {
  const [query, setQuery] = React.useState("")
  const [isSearching, setIsSearching] = React.useState(false)
  const [results, setResults] = React.useState<SupplierFinderOutput | null>(null)
  const [location, setLocation] = React.useState<{lat: number, lng: number} | null>(null)
  const [locationLoading, setLocationLoading] = React.useState(false)
  const { toast } = useToast()

  const getUserLocation = () => {
    setLocationLoading(true)
    if (!navigator.geolocation) {
      toast({
        variant: "destructive",
        title: "Geolocation Not Supported",
        description: "Your browser doesn't support geolocation."
      })
      setLocationLoading(false)
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        })
        setLocationLoading(false)
        toast({
          title: "Location Updated",
          description: "Finding suppliers near you."
        })
      },
      (error) => {
        toast({
          variant: "destructive",
          title: "Location Denied",
          description: "Please enable location access to find nearest suppliers."
        })
        setLocationLoading(false)
      }
    )
  }

  const handleSearch = async (e?: React.FormEvent) => {
    e?.preventDefault()
    if (!query.trim()) return

    setIsSearching(true)
    try {
      // Use actual location if available, fallback to default
      const lat = location?.lat || 3.1390
      const lng = location?.lng || 101.6869
      
      const output = await findSuppliers({
        latitude: lat,
        longitude: lng,
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
          <p className="text-muted-foreground">AI-powered search for fertilizer, seeds, and equipment near you.</p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            className="rounded-xl border-primary text-primary"
            onClick={getUserLocation}
            disabled={locationLoading}
          >
            {locationLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Navigation2 className="h-4 w-4 mr-2" />}
            {location ? "Location Set" : "Detect Location"}
          </Button>
        </div>
      </div>

      <form onSubmit={handleSearch} className="flex gap-2 w-full max-w-2xl mx-auto">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input 
            placeholder="Search e.g. 'Urea', 'Rice seeds', 'Tractor parts'..." 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-10 h-14 rounded-2xl shadow-sm bg-white border-none text-lg"
          />
        </div>
        <Button type="submit" className="h-14 px-8 rounded-2xl bg-primary text-lg font-bold" disabled={isSearching}>
          {isSearching ? <Loader2 className="h-6 w-6 animate-spin" /> : "Search"}
        </Button>
      </form>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {!results && !isSearching && (
             <div className="h-[400px] flex flex-col items-center justify-center bg-white border rounded-3xl p-8 text-center gap-4 shadow-sm">
                <div className="h-20 w-20 bg-accent/20 rounded-full flex items-center justify-center">
                  <MapPin className="h-10 w-10 text-primary/40" />
                </div>
                <div>
                   <h3 className="text-xl font-headline font-bold">Find Local Resources</h3>
                   <p className="text-sm text-muted-foreground max-w-[300px] mx-auto">Enter what you need to see authorized suppliers and AI summaries.</p>
                </div>
                <div className="flex flex-wrap justify-center gap-2 mt-2">
                  {['Fertilizer', 'Seeds', 'Pesticides', 'Equipment'].map(tag => (
                    <Button key={tag} variant="outline" size="sm" className="rounded-full px-4" onClick={() => {setQuery(tag); setTimeout(() => handleSearch(), 100);}}>
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
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="p-6 rounded-3xl bg-secondary/10 border border-secondary/20 space-y-2">
                 <h4 className="text-xs font-bold uppercase tracking-wider text-secondary-foreground flex items-center gap-2">
                   <Star className="h-3 w-3 fill-current" />
                   AI Copilot Recommendation
                 </h4>
                 <p className="text-sm text-foreground/80 leading-relaxed font-medium">{results.summary}</p>
              </div>

              <div className="grid gap-4">
                {results.suppliers.map((s, i) => (
                  <Card key={i} className="rounded-3xl border-none shadow-md hover:shadow-xl transition-all overflow-hidden bg-white">
                    <CardContent className="p-6 space-y-4">
                      <div className="flex justify-between items-start">
                         <div className="space-y-1">
                           <h3 className="text-xl font-headline font-bold text-primary">{s.name}</h3>
                           <p className="text-sm text-muted-foreground flex items-center gap-1">
                             <MapPin className="h-3 w-3" />
                             {s.address}
                           </p>
                           <p className="text-xs font-bold text-emerald-600 bg-emerald-50 w-fit px-2 py-0.5 rounded-full">
                             {s.distanceKm} km away
                           </p>
                         </div>
                         <div className="flex gap-2">
                            <Button size="icon" variant="outline" className="rounded-full h-10 w-10 border-primary text-primary">
                               <Phone className="h-4 w-4" />
                            </Button>
                            <Button size="icon" variant="outline" className="rounded-full h-10 w-10 border-primary text-primary" asChild>
                               <a href={s.mapLink} target="_blank" rel="noopener noreferrer"><Navigation className="h-4 w-4" /></a>
                            </Button>
                         </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="space-y-6">
           <Card className="rounded-3xl shadow-xl border-none bg-primary h-[400px] relative overflow-hidden group">
              <div className="absolute inset-0 bg-[url('https://picsum.photos/seed/map/800/800')] bg-cover opacity-20 grayscale group-hover:scale-110 transition-transform duration-1000" />
              <div className="absolute inset-0 flex items-center justify-center p-8 text-center flex-col gap-4 text-white">
                 <div className="h-20 w-20 bg-white/20 rounded-full flex items-center justify-center">
                   <Navigation className="h-10 w-10" />
                 </div>
                 <h3 className="text-2xl font-headline font-bold">Interactive Map</h3>
                 <p className="text-primary-foreground/70 text-sm">Visualize suppliers near your location in real-time.</p>
                 <Button className="bg-white text-primary hover:bg-white/90 rounded-full font-bold px-8">Launch Maps</Button>
              </div>
           </Card>

           <Card className="rounded-3xl shadow-xl border-none bg-white p-6 space-y-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-accent/50 rounded-full flex items-center justify-center">
                  <Info className="h-5 w-5 text-primary" />
                </div>
                <h4 className="font-bold">Verified Partners</h4>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                TUAI only lists suppliers verified by the Ministry of Agriculture to ensure you get genuine high-quality inputs for your farm.
              </p>
           </Card>
        </div>
      </div>
    </div>
  )
}
