import React, { useState } from 'react';
import { Mail, Copy, Check, ArrowRight, ShieldCheck, Clock, MessageSquare, Download } from 'lucide-react';
import { soundEngine } from '../../services/soundEngine';

interface ContactGatewayWorkspaceProps {
  onNavigateToBriefing: () => void;
}

const CONTACT_EXHIBITS = [
  { id: '01', title: 'Direct Concierge', desc: 'Encrypted inbound communication channel to senior leadership', img: '/images/contact/01_direct_inbox_concierge.svg' },
  { id: '02', title: 'Confidentiality & NDA', desc: 'Mutual NDA and proprietary recipe security for dining concepts', img: '/images/contact/02_confidential_nda_protection.svg' },
  { id: '03', title: 'Same-Day Response SLA', desc: 'Guaranteed 24-business-hour scoping and review turnaround', img: '/images/contact/03_same_day_response_sla.svg' },
  { id: '04', title: 'UK Studio Presence', desc: 'Operating across London, Manchester, Edinburgh, and across the UK', img: '/images/contact/04_london_studio_presence.svg' },
  { id: '05', title: 'Video Discovery Terminal', desc: 'Direct 30-minute technical review via Google Meet or Zoom', img: '/images/contact/05_video_conference_terminal.svg' },
  { id: '06', title: 'Fixed-Price Quotation', desc: 'Clear deliverables, transparent timelines, and zero surprise fees', img: '/images/contact/06_instant_quote_estimator.svg' },
  { id: '07', title: 'Emergency Menu Hotline', desc: 'Priority support line for live menu and price changes before service', img: '/images/contact/07_emergency_menu_hotline.svg' },
  { id: '08', title: 'Client Onboarding', desc: 'Seamless transition with dedicated tech director and Slack/WhatsApp link', img: '/images/contact/08_client_onboarding_handshake.svg' },
  { id: '09', title: 'Post-Brief Roadmap', desc: 'From initial requirements to working prototype within 10 days', img: '/images/contact/09_post_briefing_roadmap.svg' },
  { id: '10', title: 'Trade Partnerships', desc: 'Collaborations with UK commercial printers, POS vendors, and interior designers', img: '/images/contact/10_trade_partnership_inquiries.svg' }
];

export const ContactGatewayWorkspace: React.FC<ContactGatewayWorkspaceProps> = ({
  onNavigateToBriefing
}) => {
  const [copied, setCopied] = useState(false);
  const officialEmail = 'studioforkframe@gmail.com';

  const handleCopyEmail = () => {
    soundEngine.playSelectClick();
    navigator.clipboard.writeText(officialEmail);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="w-full max-w-5xl mx-auto p-4 md:p-8 animate-fadeIn space-y-12">
      {/* Header with Official Logo */}
      <div className="text-center max-w-2xl mx-auto flex flex-col items-center">
        <div className="w-16 h-16 rounded-2xl overflow-hidden bg-black/60 border border-[#FF6A2A]/40 p-1 mb-3 shadow-[0_0_25px_rgba(255,106,42,0.35)]">
          <img
            src="/images/brand/logo.jpeg"
            alt="Forkframe Studio Logo"
            className="w-full h-full object-cover rounded-xl"
          />
        </div>
        <span className="text-xs uppercase tracking-widest text-[#FF6A2A] font-semibold block mb-2">
          Destination 08 · Contact Gateway
        </span>
        <h2 className="text-3xl md:text-5xl font-extrabold text-[#F4F0E8] tracking-tight">
          Direct Commercial Communication
        </h2>
        <p className="text-sm md:text-base text-[#A7A39B] mt-3 leading-relaxed">
          Connect directly with Forkframe Studio’s technical leadership. We are based in the United Kingdom and review all inbound enquiries within 24 business hours.
        </p>
      </div>

      {/* Main Email Hero Card */}
      <div className="p-8 md:p-12 rounded-3xl bg-gradient-to-b from-[#191A1D] to-[#101113] border border-[#FF6A2A]/40 shadow-2xl text-center space-y-6 relative overflow-hidden">
        <div className="w-16 h-16 rounded-2xl bg-[#FF6A2A]/10 border border-[#FF6A2A]/30 flex items-center justify-center mx-auto text-[#FF6A2A] shadow-[0_0_25px_rgba(255,106,42,0.2)]">
          <Mail className="w-8 h-8" />
        </div>

        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-[#C8A879] block mb-1">
            Official Studio Channel
          </span>
          <span className="text-2xl md:text-4xl font-extrabold font-mono text-[#F4F0E8] tracking-tight block">
            {officialEmail}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
          <button
            onClick={handleCopyEmail}
            className="w-full sm:w-auto px-6 py-3 text-xs font-semibold text-white bg-white/10 hover:bg-white/15 rounded-xl border border-white/10 transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-400" />
                <span>Email Copied to Clipboard</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 text-[#C8A879]" />
                <span>Copy Email Address</span>
              </>
            )}
          </button>

          <a
            href={`mailto:${officialEmail}?subject=Forkframe%20Studio%20Food%20Business%20Enquiry`}
            onClick={() => soundEngine.playSelectClick()}
            className="w-full sm:w-auto px-6 py-3 text-xs font-semibold text-black bg-[#FF6A2A] hover:bg-[#ff7e47] rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Open Email Client</span>
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </div>

      {/* Structured Brief Option */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 rounded-2xl bg-[#191A1D]/80 border border-white/10 space-y-3">
          <div className="flex items-center gap-2 text-[#FF6A2A]">
            <Clock className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-wider">Rapid Response Protocol</span>
          </div>
          <h4 className="text-lg font-bold text-[#F4F0E8]">24-Hour Review Turnaround</h4>
          <p className="text-xs text-[#A7A39B] leading-relaxed">
            All project enquiries, menu print questions, and guidance requests receive an initial technical and commercial response within 1 business day.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-[#191A1D]/80 border border-white/10 space-y-3 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-[#C8A879]">
              <MessageSquare className="w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-wider">Detailed Project Scope</span>
            </div>
            <h4 className="text-lg font-bold text-[#F4F0E8] mt-2">Submit a Project Brief</h4>
            <p className="text-xs text-[#A7A39B] leading-relaxed mt-1">
              Have specific deliverables, budget tiers, or launch dates in mind? Complete our confidential intake form in the Briefing Chamber.
            </p>
          </div>

          <button
            onClick={() => {
              soundEngine.playSelectClick();
              onNavigateToBriefing();
            }}
            className="mt-4 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-bold transition-all flex items-center justify-between cursor-pointer"
          >
            <span>Open Briefing Chamber</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#FF6A2A]" />
          </button>
        </div>
      </div>

      {/* 10 Visual SLA & Communication Standards */}
      <div className="pt-8 border-t border-white/10">
        <div className="mb-6 flex flex-col md:flex-row md:items-end justify-between gap-2">
          <div>
            <span className="text-xs uppercase tracking-widest text-[#FF6A2A] font-semibold block mb-1">
              Commercial SLA Framework
            </span>
            <h3 className="text-xl md:text-2xl font-bold text-[#F4F0E8]">
              10 Inbound Communication & SLA Commitments
            </h3>
            <p className="text-xs text-[#A7A39B] mt-1 max-w-2xl">
              Visual overview of our client communication channels, emergency hotlines, and security standards for UK food businesses.
            </p>
          </div>
          <span className="text-[11px] font-mono text-[#C8A879]">10 SLA Protocols</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
          {CONTACT_EXHIBITS.map((item) => (
            <div
              key={item.id}
              className="p-3.5 rounded-xl bg-[#191A1D]/80 border border-white/10 hover:border-[#FF6A2A]/50 transition-all group flex flex-col justify-between"
            >
              <div>
                <div className="w-full h-24 rounded-lg overflow-hidden bg-black/60 border border-white/10 mb-2 relative">
                  <img
                    src={item.img}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    loading="lazy"
                  />
                  <div className="absolute top-1 left-1">
                    <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-black/80 text-[#FF6A2A]">
                      {item.id}
                    </span>
                  </div>
                </div>
                <h4 className="text-xs font-bold text-[#F4F0E8] group-hover:text-white truncate">
                  {item.title}
                </h4>
                <p className="text-[10px] text-[#A7A39B] line-clamp-2 mt-0.5 leading-snug">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Download Full Project ZIP banner */}
      <div className="p-6 rounded-2xl bg-white/5 border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h4 className="text-sm font-bold text-white">Full Application Source & Visual Assets Package</h4>
          <p className="text-xs text-[#A7A39B] mt-0.5">
            Download the complete standalone project archive containing all source code, 3D engines, and 80+ visual assets.
          </p>
        </div>
        <a
          href="/download/forkframe-studio-infinite-dimension.zip"
          download="forkframe-studio-infinite-dimension.zip"
          onClick={() => soundEngine.playArrivalChime()}
          className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs flex items-center gap-2 transition-all cursor-pointer border border-white/20 shrink-0"
        >
          <Download className="w-4 h-4 text-[#FF6A2A]" />
          <span>Download Project ZIP</span>
        </a>
      </div>
    </div>
  );
};
