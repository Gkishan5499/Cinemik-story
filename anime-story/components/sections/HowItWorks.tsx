'use client';
import { useState } from 'react';

export default function HowItWorks() {
  const [activeTab, setActiveTab] = useState<'reader' | 'creator'>('reader');

  const readerSteps = [
    { num: '01', title: 'DISCOVER YOUR REEL', desc: 'Browse curated story categories, trending motion comics, and original releases.' },
    { num: '02', title: 'CONTROL THE MOTION', desc: 'Scroll vertically at your own pace. Watch panels shift, visual effects glow, and audio sync.' },
    { num: '03', title: 'ENGAGE & SUPPORT', desc: 'Like episodes, post chapter comments, and support creators as stories unfold.' },
  ];

  const creatorSteps = [
    { num: '01', title: 'CREATE & UPLOAD', desc: 'Upload your visual story artwork, vertical panel layouts, and audio soundtrack assets.' },
    { num: '02', title: 'PUBLISH TO MILLIONS', desc: 'Publish chapters directly to an engaged global audience of passionate story enthusiasts.' },
    { num: '03', title: 'INCUBATE YOUR IP', desc: 'Top performing titles gain access to industry incubation for animation, film, and games.' },
  ];

  const steps = activeTab === 'reader' ? readerSteps : creatorSteps;

  return (
    <section className="py-24 px-6 md:px-16 bg-[#121216] border-b border-white/10 relative">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div>
            <span className="font-manrope text-xs font-bold tracking-[0.3em] text-[#2596be] uppercase">
              SIMPLE & POWERFUL
            </span>
            <h2 className="font-bricolage text-4xl md:text-5xl font-extrabold text-white uppercase tracking-tight mt-2">
              HOW IT <span className="text-gradient-01">WORKS</span>
            </h2>
          </div>

          {/* Toggle buttons */}
          <div className="flex items-center p-1 bg-[#0A0A0A] border border-white/10 rounded-sm">
            <button
              onClick={() => setActiveTab('reader')}
              className={`px-6 py-2.5 font-manrope text-xs font-bold uppercase tracking-wider transition-all rounded-sm ${
                activeTab === 'reader'
                  ? 'bg-gradient-to-r from-[#2596be] to-[#E63946] text-white shadow-md'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              FOR READERS
            </button>
            <button
              onClick={() => setActiveTab('creator')}
              className={`px-6 py-2.5 font-manrope text-xs font-bold uppercase tracking-wider transition-all rounded-sm ${
                activeTab === 'creator'
                  ? 'bg-gradient-to-r from-[#2596be] to-[#FFC857] text-white shadow-md'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              FOR CREATORS
            </button>
          </div>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, i) => (
            <div
              key={i}
              className="bg-[#0A0A0A] border border-white/10 p-8 rounded-sm relative group hover:border-[#2596be]/50 transition-all duration-300"
            >
              <span className="font-bricolage text-5xl font-extrabold text-[#2596be]/25 group-hover:text-[#2596be] transition-colors block mb-4">
                {step.num}
              </span>
              <h3 className="font-bricolage text-2xl font-bold text-white uppercase mb-3 leading-tight">
                {step.title}
              </h3>
              <p className="font-manrope text-white/60 text-sm leading-relaxed">
                {step.desc}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
