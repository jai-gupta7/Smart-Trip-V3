
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Package, Truck, Map, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';

const HomePage = () => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1565891741441-64926e441838" 
            alt="Modern warehouse operations with stacked boxes" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-slate-950/80 mix-blend-multiply" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
        </div>
        
        <div className="om-container relative z-10 text-center pt-20">
          <span className="inline-block py-1 px-3 rounded-full bg-primary/20 text-primary-foreground border border-primary/30 text-sm font-medium mb-6 backdrop-blur-sm">
            Next-Generation Logistics
          </span>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-white tracking-tight mb-6 max-w-4xl mx-auto text-balance">
            Intelligent Trip Management System
          </h1>
          <p className="text-lg md:text-xl text-slate-300 mb-10 max-w-2xl mx-auto leading-relaxed">
            Optimize your first-mile and last-mile operations with real-time tracking, smart consolidation, and automated vehicle assignment.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button asChild size="lg" className="h-14 px-8 text-base w-full sm:w-auto">
              <Link to="/first-mile">
                Access Dashboard <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-background">
        <div className="om-container">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Streamlined Operations</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Comprehensive tools designed specifically for modern logistics challenges.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: Package, title: "First Mile", desc: "Manage scheduled and potential pickups with automated E-waybill verification." },
              { icon: Truck, title: "Last Mile", desc: "Handle appointment CNs, resolve yellow flags, and ensure timely deliveries." },
              { icon: Map, title: "Smart Routing", desc: "AI-driven consolidation and route optimization for maximum efficiency." },
              { icon: ShieldCheck, title: "Real-time Tracking", desc: "Monitor loading progress and on-route movement with live updates." }
            ].map((feature, i) => (
              <div key={i} className="bg-card p-6 rounded-2xl border shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center mb-6">
                  <feature.icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
