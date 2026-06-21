import React, { useState, useEffect, useRef, type Dispatch, type SetStateAction } from 'react';

import Sidebar from '../../small/sidebar';
import Footer from '../../small/footer';
import Header from '../../small/header';
import StatusCard from '../../small/statusCard';
import { BlackHole } from '../../small/bh_anim';
import { BlackHolePerf } from '../../small/bh_anim_performance';
import '../../../assets/scrn1.png'
import StatusPulse from '../../small/statusPulse';
import ManifestSection from '../../small/manifest';
import ScreenshotCard from '../../small/screenCard';
import GuideSection from '../../small/guide';
import AuthModal from '../auth/auth';
import PriceCarousel from '../../small/prices';
import ProfileSection from '../profile/profile';


import bgr2 from '../../../assets/bgr2.jpeg'
import DownloadSection from '../../small/download';

import { CheckoutPage } from '../../small/purchase';



export const fetchMe = async (setUser: any) => {
  try {
    const res = await fetch(import.meta.env.VITE_ME_ENDPOINT, { credentials: 'include' });
    if (res.status === 401) {
      setUser(null);
      return;
    }
    const data = await res.json();
    setUser(data); 
  } catch (error) {
    console.log("Сессия не найдена или ошибка сервера");
    setUser(null);
  }
};

export default function MainPage() {
  const [tab, setTab] = useState('HOME');
  const [performanceMode, setPerformanceMode] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isPurchaseOpen, setIsPurchaseOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState<any>(null);

  const [isFooterAtBottom, setIsFooterAtBottom] = useState(false);

  const homeRef = useRef<HTMLDivElement>(null);
  const priceRef = useRef<HTMLDivElement>(null);
  const guideRef = useRef<HTMLDivElement>(null);
  const infoRef = useRef<HTMLDivElement>(null);
  const downloadRef = useRef<HTMLDivElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);

  const [isProfileClosing, setIsProfileClosing] = useState(false);


  useEffect(() => {
    if (!user) {
      fetchMe(setUser);
    }
  }, []);

  


  const handleTabChange = (targetTab: string) => {
   
    if (tab === 'PROFILE' && targetTab !== 'PROFILE') {
      setIsProfileClosing(true); 

      setTimeout(() => {
        setIsProfileClosing(false); 
        if (targetTab === 'HOME') {
          setTab('HOME');
        } else {
          scrollToSection(targetTab);
        }
      }, 500); 
    } else if (targetTab === 'PROFILE') {
      setTab('PROFILE');
    } else {
      scrollToSection(targetTab);
    }
  };

  
  const scrollToSection = (section: string) => {
    
    setTab(section);

    setTimeout(() => {
      const refs: any = {
        'HOME': homeRef,
        'PRICES': priceRef,
        'GUIDE': guideRef,
        'FAQ': infoRef,
        'DOWNLOAD': downloadRef, 
        'PREVIEW': previewRef,
      };

      refs[section]?.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };



  const handleMainScroll = (e: React.UIEvent<HTMLElement>) => {
    const target = e.currentTarget;
    const scrollHeight = target.scrollHeight;
    const currentPosition = Math.ceil(target.scrollTop + target.clientHeight);

 
    const isBottom = currentPosition >= scrollHeight - 10;

    if (isBottom !== isFooterAtBottom) {
      setIsFooterAtBottom(isBottom);
    }
  };


  const handleLogout = async () => {
    try {
      
      await fetch(import.meta.env.VITE_LOGOUT_ENDPOINT, {
        method: 'POST',
        credentials: 'include',
      });
    } catch (err) {
      console.error("Logout network error:", err);
    } finally {
      console.log("юзер очищен локально");
      setUser(null);
    }
  };

  return (


    <div className="flex h-screen overflow-hidden bg-[#07090d] text-white">
      <Sidebar
        active={tab}
        setActive={handleTabChange} 
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header
          perf={performanceMode}
          setPerf={setPerformanceMode}
          user={user}
          onAuthClick={() => setIsAuthOpen(true)}
          onProfileClick={() => setTab('PROFILE')} 
        />

        
        <main className="flex-1 overflow-y-auto custom-scrollbar bg-[#07090d] select-none"
          onScroll={handleMainScroll}>

          {tab === 'PROFILE' ? (
           
            <div className="max-w-6xl mx-auto p-20">
              <ProfileSection
                user={user}
                isExternalClosing={isProfileClosing} 
                onBack={() => handleTabChange('HOME')}
                refreshUser={() => fetchMe(setUser)}
                onLogout={() => {
                  
                  handleLogout();
                  handleTabChange('HOME');
                }}
                openPurchase={() => setIsPurchaseOpen(true)}
              />
            </div>
          ) : (
            <>
              <div ref={homeRef}>
                <section className="relative h-[80vh] flex flex-col items-center justify-center border-b border-white/5 overflow-hidden group/hero bg-[#07090d]">

      
                  <div
                    className="absolute inset-0 z-0 transition-opacity duration-1000 opacity-90 pointer-events-none"
                    style={{
                      backgroundImage: `url(${bgr2})`, //
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
        
                      maskImage: 'radial-gradient(circle, transparent 20%, black 70%)',
                      WebkitMaskImage: 'radial-gradient(circle, transparent 20%, black 70%)'
                    }}
                  />

                
                  <div className="absolute inset-0 z-10 flex items-center justify-center">
                    {performanceMode ? <BlackHolePerf /> : <BlackHole />}
                  </div>

                 
                  <div className="relative z-20 text-center space-y-4">
                    <h1 className="text-8xl font-black italic uppercase tracking-tighter leading-none drop-shadow-[0_10px_30px_rgba(0,0,0,0.8)]">
                      VOID<span className="text-cyan-400">CORE</span>
                    </h1>
                    <div className="flex items-center justify-center gap-4">
                      <div className="h-[2px] w-12 bg-cyan-500/50" />
                      <p className="text-[12px] font-black uppercase tracking-[0.6em] text-white/80">Kernel Drivers</p>
                      <div className="h-[2px] w-12 bg-cyan-500/50" />
                    </div>
                  </div>

                 
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_30%,#07090d_100%)] pointer-events-none z-30" />
                </section>
              </div>

           
              <div className="max-w-8xl mx-auto px-12 space-y-10 relative z-20">



                <section className="mt-12 max-w-full px-4 overflow-hidden relative">
           
                  <div className="absolute top-0 bottom-0 left-0 w-12 bg-gradient-to-r from-[#020204] to-transparent z-20 pointer-events-none" />
                  <div className="absolute top-0 bottom-0 right-0 w-12 bg-gradient-to-l from-[#020204] to-transparent z-20 pointer-events-none" />


                    <div className="animate-infinite-scroll pt-8 gap-4">

                 
                      <StatusPulse label="Cheat Status" value="Undetected" color="bg-cyan-500" />
                      <StatusPulse label="Active Users" value="1,248" color="bg-cyan-500" />
                      <StatusPulse label="Current Version" value="v2.0.4-STABLE" color="bg-purple-500" />
                      <StatusPulse label="Last Update" value="24.03.2026" color="bg-cyan-500" />
                      <StatusPulse label="Server Latency" value="14ms" color="bg-green-500" />
                      <StatusPulse label="Global Bans" value="ZERO" color="bg-red-500" />

                      <StatusPulse label="Cheat Status" value="Undetected" color="bg-cyan-500" />
                      <StatusPulse label="Active Users" value="1,248" color="bg-cyan-500" />
                      <StatusPulse label="Current Version" value="v2.0.4-STABLE" color="bg-purple-500" />
                      <StatusPulse label="Last Update" value="24.03.2026" color="bg-cyan-500" />
                      <StatusPulse label="Server Latency" value="14ms" color="bg-green-500" />
                      <StatusPulse label="Global Bans" value="ZERO" color="bg-red-500" />

                    </div>
              
                </section>

                
                <div ref={previewRef}>
                  <section className="space-y-8">
                    <div className="flex items-center gap-4">
                      <h2 className="text-xs font-black uppercase tracking-[0.5em] text-white/30">Interface Preview</h2>
                      <div className="h-[1px] w-full bg-white/5" />
                    </div>

                    <div className="grid grid-cols-2 gap-10">
                     
                      <ScreenshotCard src={new URL('../../../assets/scrn1.png', import.meta.url).href} title="Settings Menu" />
                      <ScreenshotCard src={new URL('../../../assets/scrn2.png', import.meta.url).href} title="User Profile" />
                    </div>
                  </section>
                </div>
                <div ref={infoRef}>
                  <section className="space-y-8">
                    <div className="flex items-center gap-4 mb-10">
                      <h2 className="text-xs font-black uppercase tracking-[0.5em] text-white/30 whitespace-nowrap">Core Philosophy</h2>
                      <div className="h-[1px] w-full bg-white/5" />
                    </div>
                    <ManifestSection />
                  </section>
                </div>
                <div ref={guideRef}>
                  <section className="space-y-8">
                    <div className="flex items-center gap-4 mb-10">
                      <h2 className="text-xs font-black uppercase tracking-[0.5em] text-white/30 whitespace-nowrap">Operational Guide</h2>
                      <div className="h-[1px] w-full bg-white/5" />
                    </div>
                    <GuideSection />
                  </section>
                </div>


                
                <div ref={priceRef}>
                  <section className="relative space-y-8">
                    <div className="flex items-center gap-4 mb-10"
                      style={{
                        backgroundImage: `url(${new URL('../../assets/bgr.jpg', import.meta.url).href})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',

                      }}>
                      <h2 className="text-xs font-black uppercase tracking-[0.5em] text-white/30 whitespace-nowrap">Access Licenses</h2>
                      <div className="h-[1px] w-full bg-white/5" />
                    </div>
                    <PriceCarousel user={user}
                      openAuthModal={() => setIsAuthOpen(true)}
                      openPurchase={(plan) => {
                        setSelectedPlan(plan);
                        setIsPurchaseOpen(true);
                      }} />
                  </section>
                </div>

                <div ref={downloadRef}>
                  <DownloadSection />
                </div>

              </div>
            </>
          )}

        </main>

        <Footer isAtBottom={tab !== 'PROFILE' ? isFooterAtBottom : false} />


        {isAuthOpen && (
          <AuthModal
            onClose={() => setIsAuthOpen(false)}
            onLogin={(data: any) => { 
              setUser(data);          
              setIsAuthOpen(false);
            }}
          />
        )}

        {isPurchaseOpen && (
          <CheckoutPage
            user={user}
            refreshUser={() => fetchMe(setUser)}
            plan={selectedPlan}
            onClose={() => setIsPurchaseOpen(false)} />
        )}

      </div>
    </div>
  );
}