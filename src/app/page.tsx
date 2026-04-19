import Link from 'next/link';
import Image from 'next/image';
import { Sprout, ShieldCheck, MapPin, Zap, ArrowRight, MessageCircle, ClipboardList, BarChart3, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function LandingPage() {
  // Define hero and feature images directly for clarity in this example.
  // Replace these with your actual image objects or URLs.
  const heroImage = {
    imageUrl: 'https://images.unsplash.com/photo-1590761611093-96b6b3e9432f?q=80&w=2070&auto=format&fit=crop', // A lush rice field
    description: 'Lush green rice terrace in Southeast Asia',
  };

  const featureImages = [
    {
      id: 'disease-ai',
      imageUrl: 'https://images.unsplash.com/photo-1628155913217-1a052e46c986?q=80&w=1974&auto=format&fit=crop', // Close up of plant with disease
    },
    {
      id: 'risk-advisor',
      imageUrl: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=2084&auto=format&fit=crop', // People looking at global map
    },
    {
      id: 'farmer-copilot',
      imageUrl: 'https://images.unsplash.com/photo-1599420186946-7b6fb4e297f0?q=80&w=1974&auto=format&fit=crop', // Person using tablet in a field
    }
  ]

  const featuresData = [
    { title: "Crop Disease AI", desc: "Upload a photo and let our vision agents diagnose issues in seconds using Gemini Flash.", icon: Sprout, color: "bg-emerald-500" },
    { title: "Risk Advisor", desc: "Autonomous monitoring of global news and commodity prices to predict supply shocks.", icon: ShieldCheck, color: "bg-blue-500" },
    { title: "Farmer Copilot", desc: "Ask anything. Our LLM-powered assistant retrieves policy and weather data for real answers.", icon: MessageCircle, color: "bg-cyan-500" },
    { title: "Supplier Finder", desc: "Instant location-based searching for fertilizer, seeds, and equipment.", icon: MapPin, color: "bg-orange-500" },
    { title: "Records Ledger", desc: "Keep all your harvest and treatment data secure and accessible anywhere.", icon: ClipboardList, color: "bg-purple-500" },
    { title: "Smart Alerts", desc: "Push notifications for localized weather risks and market fluctuations.", icon: Zap, color: "bg-yellow-500" }
  ].map((feature, index) => ({
    ...feature,
    // Cycle through feature images for the first few features, or provide alternatives.
    image: featureImages[index % featureImages.length]?.imageUrl 
  }));

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 text-slate-900 selection:bg-primary/20 scroll-smooth font-sans">
      {/* Navigation */}
      <header className="px-6 lg:px-16 h-24 flex items-center justify-between sticky top-0 bg-white/90 backdrop-blur-md z-50 border-b border-slate-100 shadow-sm">
        <Link className="flex items-center justify-center gap-3 group" href="/">
          <div className="bg-primary p-2.5 rounded-xl group-hover:rotate-6 transition-transform shadow-inner">
            <Sprout className="h-7 w-7 text-white" />
          </div>
          <span className="text-3xl font-extrabold text-primary tracking-tighter">TUAI</span>
        </Link>
        
        <nav className="hidden md:flex gap-12">
          {['Features', 'Mission', 'Impact'].map(item => (
            <Link key={item} className="text-base font-semibold text-slate-700 hover:text-primary transition-colors relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 hover:after:w-full after:bg-primary after:transition-all" href={`#${item.toLowerCase()}`}>
              {item}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <Link href="/login">
            <Button variant="ghost" className="text-base font-bold text-slate-700 hover:bg-slate-100 px-6">Login</Button>
          </Link>
          <Link href="/signup">
            <Button className="bg-primary hover:bg-primary/90 rounded-full px-10 h-12 text-base font-bold shadow-lg shadow-primary/20 hover:shadow-xl transition-all">
              Get Started
            </Button>
          </Link>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-24 lg:py-36 bg-white">
          <div className="container mx-auto px-6 lg:px-16 grid lg:grid-cols-2 gap-20 items-center">
            <div className="flex flex-col gap-10 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-emerald-100 text-emerald-800 text-sm font-bold w-fit mx-auto lg:mx-0 border border-emerald-200">
                <Zap className="h-4 w-4 fill-emerald-800" />
                <span className="uppercase tracking-widest">Next-Gen AgTech for ASEAN</span>
              </div>
              <h1 className="text-7xl lg:text-9xl font-extrabold text-slate-950 leading-[1.0] tracking-tighter">
                Farm with <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-emerald-500 to-green-400">
                  Intelligence.
                </span>
              </h1>
              <p className="text-2xl text-slate-700 max-w-[620px] mx-auto lg:mx-0 leading-relaxed font-normal">
                TUAI moves beyond simple advice. Our AI agents monitor global risks, diagnose crop diseases, and execute action plans to secure your harvest.
              </p>
              <div className="flex flex-col sm:flex-row gap-5 justify-center lg:justify-start pt-6">
                <Button size="lg" className="bg-primary hover:bg-primary/90 rounded-full text-xl h-20 px-12 shadow-2xl shadow-primary/30 group font-bold">
                  Start Your Free Trial 
                  <ArrowRight className="ml-3 h-6 w-6 group-hover:translate-x-1.5 transition-transform" />
                </Button>
                <Button size="lg" variant="outline" className="rounded-full text-xl h-20 px-12 border-2 border-slate-200 hover:border-primary/50 hover:text-primary font-bold transition-all" asChild>
                  <Link href="#features">Explore Features</Link>
                </Button>
              </div>
            </div>

            <div className="relative group">
              <div className="absolute -inset-6 bg-gradient-to-br from-primary/30 via-emerald-100 to-transparent rounded-[48px] blur-3xl group-hover:blur-[40px] transition-all opacity-60" />
              <div className="relative aspect-[4/5] lg:aspect-[5/6] h-[600px] lg:h-[750px] w-full rounded-[40px] overflow-hidden shadow-2xl border-12 border-white">
                <Image
                  src={heroImage.imageUrl}
                  alt={heroImage.description}
                  fill
                  className="object-cover transition-transform duration-1000 group-hover:scale-105"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />
                
                {/* Floating UI Element */}
                <div className="absolute bottom-10 left-10 right-10 bg-white/95 backdrop-blur-lg p-8 rounded-3xl shadow-3xl flex items-center gap-6 border border-white/60 animate-in fade-in slide-in-from-bottom-6 duration-1000">
                  <div className="h-16 w-16 bg-emerald-100 rounded-2xl flex items-center justify-center shadow-inner border border-emerald-200">
                    <ShieldCheck className="text-emerald-700 h-9 w-9" />
                  </div>
                  <div>
                    <div className="text-lg font-extrabold text-slate-900 uppercase tracking-wider">System Status: Active</div>
                    <div className="text-base text-slate-600 font-medium italic">Monitoring 42 Hectares in Kedah, MY</div>
                  </div>
                  <div className='ml-auto bg-primary/10 text-primary text-xs font-bold px-3 py-1 rounded-full'>Real-time</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section id="features" className="py-32 lg:py-40 bg-slate-100/50">
          <div className="container mx-auto px-6 lg:px-16">
            <div className="max-w-4xl mb-24 text-center mx-auto">
              <h2 className="text-base font-extrabold text-primary uppercase tracking-[0.25em] mb-5">The TUAI Platform</h2>
              <h3 className="text-5xl lg:text-7xl font-extrabold text-slate-950 mb-8 tracking-tight">
                Everything you need to <br/> scale your production.
              </h3>
              <p className="text-2xl text-slate-600 font-normal leading-relaxed max-w-3xl mx-auto">
                Built on Google Cloud & Vertex AI to provide enterprise-grade insights tailored for local farmers.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuresData.map((f, i) => (
                <div key={i} className="rounded-[36px] bg-white border border-slate-100 hover:border-primary/30 transition-all hover:shadow-3xl hover:-translate-y-2 group overflow-hidden flex flex-col">
                  {f.image && (
                    <div className="relative h-60 w-full overflow-hidden">
                      <Image src={f.image} alt={f.title} fill className='object-cover group-hover:scale-110 transition-transform duration-500'/>
                      <div className='absolute inset-0 bg-gradient-to-t from-white via-white/20 to-transparent' />
                    </div>
                  )}
                  <div className='p-12 pt-8 flex-1 flex flex-col'>
                    <div className={`h-16 w-16 ${f.color} rounded-2xl flex items-center justify-center mb-10 shadow-lg shadow-${f.color.split('-')[0]}-200 group-hover:-rotate-6 transition-transform`}>
                      <f.icon className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-3xl font-extrabold mb-5 text-slate-950 tracking-tight">{f.title}</h3>
                    <p className="text-lg text-slate-600 leading-relaxed font-normal flex-1">{f.desc}</p>
                    <Link href="#" className="inline-flex items-center gap-2 text-primary font-bold mt-8 group-hover:gap-3 transition-all">
                      Learn More <ArrowRight className='h-5 w-5'/>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Mission Section */}
        <section id="mission" className="py-32 lg:py-44 bg-primary text-white overflow-hidden relative">
          <div className="absolute top-0 right-0 opacity-10 translate-x-1/3 -translate-y-1/3">
              <Globe className="w-[800px] h-[800px]" strokeWidth={1}/>
          </div>
          <div className="container mx-auto px-6 lg:px-16 relative z-10">
            <div className="grid lg:grid-cols-2 gap-20 items-center">
              <div>
                <h2 className="text-5xl lg:text-8xl font-extrabold mb-10 tracking-tighter leading-tight">Our Mission: <br/>Resilient ASEAN Agriculture</h2>
                <p className="text-2xl text-primary-foreground/90 leading-relaxed mb-12 font-normal">
                  Technology shouldn't just be for big corporations. TUAI was founded to bring the power of Generative AI to every smallholder farmer in Southeast Asia, ensuring food security for the next generation.
                </p>
                <Button variant="secondary" size="lg" className="rounded-full font-bold px-12 h-16 text-lg shadow-xl text-primary hover:bg-white transition-colors">Read Our Whitepaper</Button>
              </div>
              <div className="bg-white/10 backdrop-blur-xl rounded-[40px] p-12 border border-white/20 shadow-2xl">
                  <div className="space-y-8">
                    {[
                      { label: "Data-Driven Decisions", val: "100%" },
                      { label: "Localization Support", val: "ASEAN-wide" },
                      { label: "AI Response Time", val: "< 2.0s" },
                      { label: "Uptime SLA", val: "99.9%" }
                    ].map((item, idx) => (
                      <div key={idx} className="flex justify-between items-end border-b border-white/15 pb-6">
                        <span className="font-semibold text-xl text-white/90">{item.label}</span>
                        <span className="text-5xl font-extrabold text-emerald-300 tracking-tight">{item.val}</span>
                      </div>
                    ))}
                  </div>
              </div>
            </div>
          </div>
        </section>

        {/* Impact Section */}
        <section id="impact" className="py-32 lg:py-40 bg-white">
          <div className="container mx-auto px-6 lg:px-16 text-center">
            <h2 className="text- base font-extrabold text-primary uppercase tracking-[0.25em] mb-6">Real Results</h2>
            <h3 className="text-5xl lg:text-7xl font-extrabold mb-24 tracking-tight text-slate-950">Creating Tangible Impact</h3>
            <div className="grid md:grid-cols-3 gap-16 max-w-6xl mx-auto">
                {[
                  { val: "15k+", label: "Farmers Empowered" },
                  { val: "30%", label: "Average Yield Increase" },
                  { val: "24/7", label: "AI Monitoring" }
                ].map(stat => (
                  <div key={stat.label} className="space-y-5 p-10 bg-slate-50 rounded-3xl border border-slate-100 shadow-sm">
                    <div className="text-7xl font-extrabold text-primary tracking-tighter">{stat.val}</div>
                    <div className="font-bold text-slate-700 uppercase tracking-widest text-base">{stat.label}</div>
                  </div>
                ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-slate-950 text-slate-300 py-24 px-6 lg:px-16">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start gap-16 mb-20">
            <div className="space-y-8 max-w-sm">
              <Link className="flex items-center gap-3" href="/">
                <div className="bg-primary p-2 rounded-lg">
                  <Sprout className="h-7 w-7 text-white" />
                </div>
                <span className="text-3xl font-extrabold text-white tracking-tighter">TUAI</span>
              </Link>
              <p className="text-lg leading-relaxed font-normal">
                Leading the digital transformation of agriculture across the ASEAN region.
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-16 text-lg">
              {[
                { title: 'Product', links: ['Features', 'Pricing', 'Integrations'] },
                { title: 'Company', links: ['About Us', 'Careers', 'Press Kit'] },
                { title: 'Legal', links: ['Privacy Policy', 'Terms of Service', 'Security'] }
              ].map(section => (
                <div key={section.title} className="flex flex-col gap-5">
                  <span className="text-white font-bold mb-2 text-xl">{section.title}</span>
                  {section.links.map(link => (
                    <Link key={link} href="#" className="hover:text-primary transition-colors">{link}</Link>
                  ))}
                </div>
              ))}
            </div>
          </div>
          <div className="pt-10 border-t border-slate-800 text-base flex flex-col md:flex-row justify-between items-center gap-6 text-slate-500">
            <p>© 2024 TUAI Agriculture. All rights reserved. Built in Malaysia.</p>
            <div className="flex gap-8">
              {/* Add social media icons here if needed */}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}