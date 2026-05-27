'use client';
import Link from 'next/link';
 
export default function HomePage() {
  // থিম কালার কনফিগ
  const theme = {
    bgMain: "#0f172a",      
    primary: "#487be8",      
    textMuted: "#94a3b8",    
    imgOpacity: "0.30"       
  };
 
  return (
    <div style={{ backgroundColor: theme.bgMain }} className="min-h-screen text-white flex flex-col font-sans antialiased">
     
     
      <header className="fixed top-0 left-0 w-full z-50 bg-slate-900/60 backdrop-blur-md border-b border-slate-800/40">
        <div className="max-w-full mx-auto px-6 md:px-16 h-20 flex items-center justify-between">
         
         
          <Link href="/home" className="text-2xl md:text-3xl font-black tracking-widest uppercase select-none">
            HOTEL <span style={{ color: theme.primary }}>ROYAL</span>
          </Link>
 
         
          <div>
            <Link
              href="/login"
              className="px-7 py-3 rounded-xl text-base font-bold text-white transition-all hover:brightness-125 hover:scale-105 shadow-lg shadow-blue-600/10"
              style={{ backgroundColor: theme.primary }}
            >
              Log In
            </Link>
          </div>
 
        </div>
      </header>
     
      {/* Hero Section */}
      <main className="relative h-screen flex items-center justify-center">
       
       
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2070')",
            opacity: theme.imgOpacity
          }}
        />
 
     
        <div className="absolute inset-0 bg-black/50" />
       
     
        <div className="relative text-center z-10 px-6 max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-8xl font-black mb-6 tracking-tight leading-none select-none transition-all duration-200 hover:brightness-125 hover:scale-105">
            <span className="text-white/90 font-light block text-3xl md:text-4xl tracking-widest uppercase mb-3">Welcome to</span>
            <span style={{ color: theme.primary, textShadow: '0 0 40px rgba(72, 123, 232, 0.2)' }} className="block uppercase tracking-wider font-extrabold">
              Hotel Royal
            </span>
          </h1>
         
          <p style={{ color: theme.textMuted }} className="text-lg md:text-xl max-w-2xl mx-auto font-normal tracking-wide leading-relaxed">
            Experience the pinnacle of <span className="text-white font-medium italic">Luxury & Comfort</span> tailored exclusively for your finest moments.
          </p>
        </div>
      </main>
 
     
      <footer className="bg-slate-950 py-6 text-center text-slate-600 text-xs tracking-widest uppercase border-t border-slate-900/40 mt-auto">
        <p>&copy; {new Date().getFullYear()} Hotel Royal. All rights reserved.</p>
      </footer>
 
    </div>
  );
}
 