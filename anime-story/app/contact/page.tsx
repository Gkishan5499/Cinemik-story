'use client';

import { useState, FormEvent } from 'react';
import Link from 'next/link';

const FAQ_ITEMS = [
  {
    q: 'How quickly does the CINEMIKS team respond?',
    a: 'We usually respond to all email inquiries, creator applications, and partnership messages within 24 hours during business days (Mon - Sat, 10 AM - 7 PM IST).',
  },
  {
    q: 'How can I submit my story or comic to CINEMIKS?',
    a: 'You can select "Story Submission / Creator Incubation" in the contact form or apply directly through our Creator Studio page. Make sure to share links to your portfolio, script drafts, or artwork.',
  },
  {
    q: 'Where is CINEMIKS located?',
    a: 'CINEMIKS headquarters is based in Bengaluru, Karnataka – 560037, India. We collaborate with creators globally across Asia, Europe, and America.',
  },
  {
    q: 'Can brands & studios partner with CINEMIKS for IP development?',
    a: 'Yes! We collaborate with animation studios, comic publishers, and brand sponsors for motion comic adaptation, soundtrack production, and IP incubation.',
  },
];

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'General Inquiry',
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedPhone, setCopiedPhone] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText('cinemiks@gmail.com');
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2500);
  };

  const handleCopyPhone = () => {
    navigator.clipboard.writeText('+91 90087 79309');
    setCopiedPhone(true);
    setTimeout(() => setCopiedPhone(false), 2500);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
    }, 1000);
  };

  return (
    <main className="min-h-screen bg-[#0A0A0A] text-[#F5F5F7] pt-28 pb-24 px-6 md:px-12 relative overflow-hidden">
      {/* Background Decorative Ambient Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-radial from-[#2596be]/15 via-[#E63946]/5 to-transparent blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-10 right-10 w-[450px] h-[450px] bg-radial from-[#FFC857]/10 to-transparent blur-3xl pointer-events-none -z-10" />

      <div className="max-w-6xl mx-auto">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 font-manrope text-xs tracking-widest text-white/50 mb-8 uppercase">
          <Link href="/" className="hover:text-[#2596be] transition-colors">
            HOME
          </Link>
          <span>/</span>
          <span className="text-[#FFC857]">CONTACT US</span>
        </div>

        {/* Hero Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#2596be]/40 bg-[#2596be]/10 text-[#FFC857] font-manrope text-[11px] font-bold tracking-[0.25em] uppercase mb-6">
            <span className="w-2 h-2 rounded-full bg-[#2596be] animate-pulse" />
            GET IN TOUCH WITH CINEMIKS
          </div>

          <h1 className="font-bricolage text-4xl md:text-6xl font-extrabold tracking-tight uppercase leading-tight">
            CONNECT WITH <span className="text-gradient-02">CINEMIKS</span>
          </h1>

          <p className="font-manrope text-base md:text-lg text-white/70 mt-6 leading-relaxed">
            Have a project idea, creator application, story feedback, or partnership request? Reach out directly to our team in Bengaluru or drop us a message below.
          </p>
        </div>

        {/* Key Contact Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {/* Card 1: Headquarters */}
          <div className="relative group p-6 rounded-xl bg-[#121216]/90 border border-white/10 hover:border-[#2596be]/50 transition-all duration-300 shadow-xl flex flex-col justify-between">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#2596be]/20 to-[#E63946]/20 border border-[#2596be]/30 flex items-center justify-center text-[#FFC857] mb-6 text-xl">
              📍
            </div>
            <div>
              <span className="font-manrope text-[10px] font-bold tracking-[0.25em] text-[#FFC857] uppercase block mb-1">
                HEADQUARTERS
              </span>
              <h3 className="font-bricolage text-xl font-bold text-white mb-2">CINEMIKS</h3>
              <p className="font-manrope text-xs text-white/70 leading-relaxed">
                Bengaluru, Karnataka – 560037<br />
                India
              </p>
            </div>
            <a
              href="https://maps.google.com/?q=Bengaluru+Karnataka+560037+India"
              target="_blank"
              rel="noreferrer"
              className="mt-6 inline-flex items-center gap-1.5 font-manrope text-xs font-semibold text-[#2596be] hover:text-[#FFC857] transition-colors uppercase group/link"
            >
              <span>Get Directions</span>
              <span className="group-hover/link:translate-x-1 transition-transform">→</span>
            </a>
          </div>

          {/* Card 2: Email */}
          <div className="relative group p-6 rounded-xl bg-[#121216]/90 border border-white/10 hover:border-[#2596be]/50 transition-all duration-300 shadow-xl flex flex-col justify-between">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#2596be]/20 to-[#E63946]/20 border border-[#2596be]/30 flex items-center justify-center text-[#FFC857] mb-6 text-xl">
              📧
            </div>
            <div>
              <span className="font-manrope text-[10px] font-bold tracking-[0.25em] text-[#FFC857] uppercase block mb-1">
                EMAIL ADDRESS
              </span>
              <h3 className="font-bricolage text-lg font-bold text-white mb-2 select-all break-all">
                cinemiks@gmail.com
              </h3>
              <p className="font-manrope text-xs text-white/60">
                Direct inbox for general support, submissions & press.
              </p>
            </div>
            <div className="mt-6 flex items-center gap-3">
              <a
                href="mailto:cinemiks@gmail.com"
                className="font-manrope text-xs font-semibold text-[#2596be] hover:text-[#FFC857] transition-colors uppercase"
              >
                Send Email →
              </a>
              <button
                type="button"
                onClick={handleCopyEmail}
                className="px-2.5 py-1 text-[10px] font-manrope font-semibold rounded bg-white/5 hover:bg-white/15 text-white/80 border border-white/10 transition-colors uppercase ml-auto"
              >
                {copiedEmail ? 'Copied! ✓' : 'Copy'}
              </button>
            </div>
          </div>

          {/* Card 3: Phone */}
          <div className="relative group p-6 rounded-xl bg-[#121216]/90 border border-white/10 hover:border-[#2596be]/50 transition-all duration-300 shadow-xl flex flex-col justify-between">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#2596be]/20 to-[#E63946]/20 border border-[#2596be]/30 flex items-center justify-center text-[#FFC857] mb-6 text-xl">
              📞
            </div>
            <div>
              <span className="font-manrope text-[10px] font-bold tracking-[0.25em] text-[#FFC857] uppercase block mb-1">
                PHONE & WHATSAPP
              </span>
              <h3 className="font-bricolage text-lg font-bold text-white mb-2">
                +91 90087 79309
              </h3>
              <p className="font-manrope text-xs text-white/60">
                Available Mon - Sat<br />
                10:00 AM - 7:00 PM IST
              </p>
            </div>
            <div className="mt-6 flex items-center gap-3">
              <a
                href="tel:+919008779309"
                className="font-manrope text-xs font-semibold text-[#2596be] hover:text-[#FFC857] transition-colors uppercase"
              >
                Call Now →
              </a>
              <button
                type="button"
                onClick={handleCopyPhone}
                className="px-2.5 py-1 text-[10px] font-manrope font-semibold rounded bg-white/5 hover:bg-white/15 text-white/80 border border-white/10 transition-colors uppercase ml-auto"
              >
                {copiedPhone ? 'Copied! ✓' : 'Copy'}
              </button>
            </div>
          </div>

          {/* Card 4: Instagram */}
          <div className="relative group p-6 rounded-xl bg-[#121216]/90 border border-white/10 hover:border-[#2596be]/50 transition-all duration-300 shadow-xl flex flex-col justify-between">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#2596be]/20 to-[#E63946]/20 border border-[#2596be]/30 flex items-center justify-center text-[#FFC857] mb-6 text-xl">
              📸
            </div>
            <div>
              <span className="font-manrope text-[10px] font-bold tracking-[0.25em] text-[#FFC857] uppercase block mb-1">
                INSTAGRAM
              </span>
              <h3 className="font-bricolage text-xl font-bold text-white mb-2">
                @thecinemiks
              </h3>
              <p className="font-manrope text-xs text-white/60">
                Follow us for behind-the-scenes, motion teasers & community artwork.
              </p>
            </div>
            <a
              href="https://instagram.com/thecinemiks"
              target="_blank"
              rel="noreferrer"
              className="mt-6 inline-flex items-center gap-1.5 font-manrope text-xs font-semibold text-[#2596be] hover:text-[#FFC857] transition-colors uppercase group/link"
            >
              <span>Visit Instagram</span>
              <span className="group-hover/link:translate-x-1 transition-transform">→</span>
            </a>
          </div>
        </div>

        {/* Main Content Layout: Contact Form + Location Banner */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start mb-24">
          {/* Contact Form Section (7 cols) */}
          <div className="lg:col-span-7 bg-[#121216]/80 rounded-2xl border border-white/10 p-8 md:p-10 shadow-2xl relative">
            <div className="mb-8">
              <h2 className="font-bricolage text-2xl md:text-3xl font-extrabold text-white tracking-tight uppercase">
                SEND US A <span className="text-gradient-02">MESSAGE</span>
              </h2>
              <p className="font-manrope text-xs md:text-sm text-white/60 mt-2">
                Fill in the details below and we will get back to you within 24 hours.
              </p>
            </div>

            {submitted ? (
              <div className="p-8 rounded-xl bg-[#2596be]/10 border border-[#2596be]/40 text-center animate-fadeIn">
                <div className="w-16 h-16 rounded-full bg-[#2596be]/20 text-[#FFC857] flex items-center justify-center text-3xl mx-auto mb-4 border border-[#2596be]/50">
                  ✓
                </div>
                <h3 className="font-bricolage text-2xl font-bold text-white uppercase mb-2">
                  MESSAGE SENT SUCCESSFULLY!
                </h3>
                <p className="font-manrope text-sm text-white/70 max-w-md mx-auto leading-relaxed mb-6">
                  Thank you, <span className="text-[#FFC857] font-semibold">{formData.name}</span>. We have received your message regarding "{formData.subject}" and will respond to <span className="text-[#2596be]">{formData.email}</span> shortly.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSubmitted(false);
                    setFormData({ name: '', email: '', phone: '', subject: 'General Inquiry', message: '' });
                  }}
                  className="px-6 py-2.5 rounded bg-gradient-to-r from-[#2596be] to-[#E63946] text-white font-manrope text-xs font-bold tracking-wider uppercase hover:opacity-90 transition-opacity"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Name Input */}
                  <div>
                    <label className="font-manrope text-xs font-semibold text-white/70 uppercase tracking-wider block mb-2">
                      YOUR NAME <span className="text-[#2596be]">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Peter Parker"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg bg-black/60 border border-white/15 text-white placeholder-white/30 focus:border-[#2596be] focus:ring-1 focus:ring-[#2596be] outline-none transition-colors text-sm font-manrope"
                    />
                  </div>

                  {/* Email Input */}
                  <div>
                    <label className="font-manrope text-xs font-semibold text-white/70 uppercase tracking-wider block mb-2">
                      EMAIL ADDRESS <span className="text-[#2596be]">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. peter@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg bg-black/60 border border-white/15 text-white placeholder-white/30 focus:border-[#2596be] focus:ring-1 focus:ring-[#2596be] outline-none transition-colors text-sm font-manrope"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Phone Input (Optional) */}
                  <div>
                    <label className="font-manrope text-xs font-semibold text-white/70 uppercase tracking-wider block mb-2">
                      PHONE NUMBER <span className="text-white/40 font-normal">(OPTIONAL)</span>
                    </label>
                    <input
                      type="tel"
                      placeholder="e.g. +91 98765 43210"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg bg-black/60 border border-white/15 text-white placeholder-white/30 focus:border-[#2596be] focus:ring-1 focus:ring-[#2596be] outline-none transition-colors text-sm font-manrope"
                    />
                  </div>

                  {/* Subject Dropdown */}
                  <div>
                    <label className="font-manrope text-xs font-semibold text-white/70 uppercase tracking-wider block mb-2">
                      TOPIC / SUBJECT
                    </label>
                    <select
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg bg-black/60 border border-white/15 text-white focus:border-[#2596be] focus:ring-1 focus:ring-[#2596be] outline-none transition-colors text-sm font-manrope"
                    >
                      <option value="General Inquiry" className="bg-[#121216] text-white">General Inquiry</option>
                      <option value="Story Submission / Creator Incubation" className="bg-[#121216] text-white">Story Submission / Creator Incubation</option>
                      <option value="Business & Partnerships" className="bg-[#121216] text-white">Business & Partnerships</option>
                      <option value="Media & Press" className="bg-[#121216] text-white">Media & Press</option>
                      <option value="Technical Support" className="bg-[#121216] text-white">Technical Support</option>
                    </select>
                  </div>
                </div>

                {/* Message Textarea */}
                <div>
                  <label className="font-manrope text-xs font-semibold text-white/70 uppercase tracking-wider block mb-2">
                    YOUR MESSAGE <span className="text-[#2596be]">*</span>
                  </label>
                  <textarea
                    required
                    rows={5}
                    placeholder="Tell us about your inquiry, story concept, or how we can help..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg bg-black/60 border border-white/15 text-white placeholder-white/30 focus:border-[#2596be] focus:ring-1 focus:ring-[#2596be] outline-none transition-colors text-sm font-manrope resize-none"
                  />
                  <div className="text-right text-[10px] text-white/40 mt-1 font-manrope">
                    {formData.message.length} / 1000 characters
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 rounded-lg bg-gradient-to-r from-[#2596be] via-[#E63946] to-[#FFC857] hover:opacity-95 text-white font-bricolage text-base font-bold tracking-wider uppercase transition-all shadow-lg shadow-[#2596be]/25 disabled:opacity-50 flex items-center justify-center gap-3 cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      SENDING MESSAGE...
                    </>
                  ) : (
                    <>
                      <span>SUBMIT MESSAGE</span>
                      <span>→</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>

          {/* Location & Map Showcase (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-[#121216]/80 rounded-2xl border border-white/10 p-8 shadow-xl relative overflow-hidden">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <span className="font-manrope text-[10px] font-bold tracking-[0.25em] text-[#FFC857] uppercase block mb-1">
                    OUR BASE
                  </span>
                  <h3 className="font-bricolage text-2xl font-bold text-white uppercase">
                    BENGALURU, INDIA
                  </h3>
                </div>
                <div className="px-3 py-1 rounded bg-[#2596be]/15 border border-[#2596be]/30 text-[#FFC857] font-manrope text-[10px] font-bold tracking-wider uppercase">
                  IST (UTC+5:30)
                </div>
              </div>

              {/* Styled Interactive Location Map Frame */}
              <div className="relative w-full h-64 rounded-xl overflow-hidden border border-white/15 bg-black group mb-6">
                {/* Embed Map Google Maps Iframe */}
                <iframe
                  title="CINEMIKS Bengaluru Location"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3888.583345470763!2d77.7126!3d12.9348!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae12ff5e67926d%3A0x6b772c842b10a950!2sBengaluru%2C%20Karnataka%20560037!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
                  width="100%"
                  height="100%"
                  style={{ border: 0, filter: 'invert(90%) hue-rotate(180deg) contrast(1.2)' }}
                  allowFullScreen={false}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="w-full h-full opacity-80 group-hover:opacity-100 transition-opacity duration-300"
                />
                
                {/* Pin Badge Overlay */}
                <div className="absolute bottom-3 left-3 bg-[#0A0A0A]/90 backdrop-blur-md px-3 py-1.5 rounded-md border border-[#2596be]/40 flex items-center gap-2 pointer-events-none">
                  <span className="w-2 h-2 rounded-full bg-[#2596be] animate-ping" />
                  <span className="font-manrope text-[10px] font-bold text-white tracking-widest uppercase">
                    560037 · KARNATAKA
                  </span>
                </div>
              </div>

              <div className="space-y-3 font-manrope text-xs text-white/70">
                <div className="flex items-start gap-3">
                  <span className="text-[#2596be] font-bold">🏢</span>
                  <p><strong className="text-white">Postal Code:</strong> 560037 (Marathahalli / Kundalahalli Region, Bengaluru)</p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-[#2596be] font-bold">⚡</span>
                  <p><strong className="text-white">Studio Focus:</strong> Motion Comic Production, Storyboarding, Audio Soundscapes & Digital Publishing</p>
                </div>
              </div>
            </div>

            {/* Direct Connect Quick Action Card */}
            <div className="bg-gradient-to-br from-[#2596be]/15 via-[#121216] to-[#E63946]/10 rounded-2xl border border-[#2596be]/30 p-6 flex flex-col justify-between">
              <div>
                <span className="font-manrope text-[10px] font-bold tracking-[0.25em] text-[#FFC857] uppercase block mb-1">
                  DIRECT CREATOR INCUBATION
                </span>
                <h4 className="font-bricolage text-lg font-bold text-white uppercase mb-2">
                  ARE YOU A STORYTELLER OR ARTIST?
                </h4>
                <p className="font-manrope text-xs text-white/70 leading-relaxed">
                  Join our creator ecosystem. Turn your manga, webtoon, or script into interactive motion comics with dynamic audio and vertical scrolling.
                </p>
              </div>
              <Link
                href="/creator-setup"
                className="mt-5 inline-flex items-center justify-center gap-2 py-3 px-5 rounded-lg bg-[#2596be] hover:bg-[#FFC857] text-[#0A0A0A] font-bricolage text-xs font-extrabold tracking-wider uppercase transition-colors"
              >
                <span>APPLY TO CREATOR STUDIO</span>
                <span>→</span>
              </Link>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="max-w-4xl mx-auto pt-10 border-t border-white/10">
          <div className="text-center mb-12">
            <span className="font-manrope text-[10px] font-bold tracking-[0.3em] text-[#FFC857] uppercase block mb-2">
              FREQUENTLY ASKED QUESTIONS
            </span>
            <h2 className="font-bricolage text-3xl font-extrabold text-white tracking-tight uppercase">
              NEED QUICK <span className="text-gradient-02">ANSWERS?</span>
            </h2>
          </div>

          <div className="space-y-4">
            {FAQ_ITEMS.map((item, idx) => (
              <div
                key={idx}
                className="rounded-xl bg-[#121216]/90 border border-white/10 overflow-hidden transition-all duration-300"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full px-6 py-5 flex items-center justify-between text-left font-bricolage text-base md:text-lg font-bold text-white hover:text-[#2596be] transition-colors"
                >
                  <span>{item.q}</span>
                  <span className="text-xl text-[#FFC857] ml-4">
                    {openFaq === idx ? '−' : '+'}
                  </span>
                </button>
                {openFaq === idx && (
                  <div className="px-6 pb-6 font-manrope text-sm text-white/70 leading-relaxed border-t border-white/5 pt-4">
                    {item.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
