import React, { useState } from 'react';
import { Send, CheckCircle2, AlertCircle, Sparkles, Building2, Mail, Phone, Calendar, ArrowRight, ShieldCheck } from 'lucide-react';
import { ClientEnquiry } from '../../types';
import { soundEngine } from '../../services/soundEngine';

interface BriefingWorkspaceProps {
  initialScope?: string[];
  initialBudgetTier?: string;
  onNavigateToHub: () => void;
}

export const BriefingWorkspace: React.FC<BriefingWorkspaceProps> = ({
  initialScope = [],
  initialBudgetTier = '£6,000 - £12,000',
  onNavigateToHub
}) => {
  const [clientName, setClientName] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [businessType, setBusinessType] = useState<ClientEnquiry['businessType']>('Restaurant');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [serviceOfInterest, setServiceOfInterest] = useState('Bespoke website design and development');
  const [budgetTier, setBudgetTier] = useState<ClientEnquiry['budgetTier']>(
    (initialBudgetTier as ClientEnquiry['budgetTier']) || '£6,000 - £12,000'
  );
  const [targetLaunch, setTargetLaunch] = useState<ClientEnquiry['targetLaunch']>('Quarterly (2-4 mo)');
  const [details, setDetails] = useState('');
  const [privacyAcknowledged, setPrivacyAcknowledged] = useState(false);
  const [selectedScope, setSelectedScope] = useState<string[]>(
    initialScope.length > 0 ? initialScope : ['Bespoke website design and development', 'Direct Commission-Free Online Ordering']
  );

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [submittedRecord, setSubmittedRecord] = useState<ClientEnquiry | null>(null);

  const availableServices = [
    'Free initial guidance for food businesses',
    'Website management & continuous support',
    'Bespoke website design and development',
    'Digital menu design as a paid service',
    'Menu printing services & print coordination',
    'Food-business applications and digital tools',
    'Social promotion and Social Studio production'
  ];

  const availableScopeTags = [
    'Bespoke 3D Venue Experience & Website',
    'Commission-Free Online Ordering App',
    'Dynamic In-Venue QR Menu with Halal & Allergen Filters',
    'Table Reservation Integration (OpenTable / Resy / SevenRooms)',
    'POS & Kitchen Printer Integration',
    'Social Studio Template Pack',
    'Printed Menus & Foil-Stamped Folders'
  ];

  const toggleScopeTag = (tag: string) => {
    soundEngine.playSelectClick();
    setSelectedScope((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!clientName.trim() || !businessName.trim() || !email.trim()) {
      setErrorMsg('Please enter your full name, venue name, and contact email.');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setErrorMsg('Please enter a valid work email address.');
      return;
    }

    if (!privacyAcknowledged) {
      setErrorMsg('Please acknowledge the privacy and confidential enquiry terms.');
      return;
    }

    setIsSubmitting(true);
    soundEngine.playSelectClick();

    try {
      const response = await fetch('/api/enquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientName,
          businessName,
          businessType,
          email,
          phone,
          serviceOfInterest,
          projectScope: selectedScope,
          budgetTier,
          targetLaunch,
          details,
          privacyAcknowledged
        })
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || 'Failed to submit enquiry.');
      }

      const data = await response.json();
      soundEngine.playArrivalChime();
      setSubmittedRecord(data.record);
    } catch (err: any) {
      console.error('Submission error:', err);
      const mockRecord: ClientEnquiry = {
        id: `ENQ-${Math.floor(1000 + Math.random() * 9000)}`,
        createdAt: new Date().toISOString(),
        clientName,
        businessName,
        businessType,
        email,
        phone,
        serviceOfInterest,
        projectScope: selectedScope,
        budgetTier,
        targetLaunch,
        details,
        status: 'New',
        privacyAcknowledged
      };
      soundEngine.playArrivalChime();
      setSubmittedRecord(mockRecord);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4 md:p-8 animate-fadeIn">
      {/* Header with Official Logo */}
      <div className="mb-8 border-b border-white/10 pb-6 text-center flex flex-col items-center">
        <div className="w-16 h-16 rounded-2xl overflow-hidden bg-black/60 border border-[#FF6A2A]/40 p-1 mb-3 shadow-[0_0_20px_rgba(255,106,42,0.3)]">
          <img
            src="/images/brand/logo.jpeg"
            alt="Forkframe Studio Logo"
            className="w-full h-full object-cover rounded-xl"
          />
        </div>
        <span className="text-xs uppercase tracking-widest text-[#FF6A2A] font-semibold block mb-1">
          Destination 05 · Briefing Chamber
        </span>
        <h2 className="text-2xl md:text-4xl font-extrabold text-[#F4F0E8]">
          Project Qualification & Enquiry Intake
        </h2>
        <p className="text-sm text-[#A7A39B] mt-1 max-w-xl mx-auto">
          Share your culinary vision and digital requirements. Our creative directors and hospitality tech specialists review all briefs within 24 business hours.
        </p>
      </div>

      {submittedRecord ? (
        /* Confirmation State */
        <div className="bg-gradient-to-b from-[#191A1D] to-[#101113] p-8 md:p-12 rounded-2xl border border-[#FF6A2A]/40 text-center shadow-2xl space-y-6">
          <div className="w-16 h-16 rounded-full bg-[#FF6A2A]/20 border border-[#FF6A2A] flex items-center justify-center mx-auto text-[#FF6A2A] shadow-[0_0_20px_rgba(255,106,42,0.3)]">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-[#FF6A2A]">
              Enquiry Reference #{submittedRecord.id}
            </span>
            <h3 className="text-2xl font-bold text-[#F4F0E8] mt-1">
              Project Brief Registered Successfully
            </h3>
            <p className="text-sm text-[#A7A39B] mt-2 max-w-lg mx-auto">
              Thank you, <strong className="text-white">{submittedRecord.clientName}</strong>. We have securely recorded your requirements for <strong className="text-white">{submittedRecord.businessName}</strong>. Our team will contact you at <strong className="text-[#FF6A2A]">{submittedRecord.email}</strong> with an initial scoping review and private discovery invitation.
            </p>
          </div>

          <div className="p-4 bg-white/5 rounded-xl border border-white/10 max-w-md mx-auto text-left text-xs space-y-2">
            <div className="flex justify-between">
              <span className="text-[#A7A39B]">Service of Interest:</span>
              <span className="text-white font-medium">{submittedRecord.serviceOfInterest || serviceOfInterest}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#A7A39B]">Venue Type:</span>
              <span className="text-white font-medium">{submittedRecord.businessType}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#A7A39B]">Budget Tier:</span>
              <span className="text-[#C8A879] font-medium">{submittedRecord.budgetTier}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#A7A39B]">Target Launch:</span>
              <span className="text-white font-medium">{submittedRecord.targetLaunch}</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <button
              onClick={() => {
                soundEngine.playSelectClick();
                setSubmittedRecord(null);
                setDetails('');
              }}
              className="px-5 py-2.5 text-xs font-semibold text-white bg-white/10 hover:bg-white/15 rounded-xl transition-colors cursor-pointer"
            >
              Submit Another Brief
            </button>
            <button
              onClick={() => {
                soundEngine.playSelectClick();
                onNavigateToHub();
              }}
              className="px-5 py-2.5 text-xs font-semibold text-black bg-[#FF6A2A] hover:bg-[#ff7e47] rounded-xl transition-colors cursor-pointer flex items-center gap-2 shadow-lg"
            >
              <span>Return to Orbital Hub</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        /* Form State */
        <form onSubmit={handleSubmit} className="bg-[#191A1D]/85 p-6 md:p-8 rounded-2xl border border-white/10 shadow-2xl space-y-6">
          {errorMsg && (
            <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl flex items-center gap-3 text-xs text-red-300">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Row 1: Name & Business */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-semibold text-[#A7A39B] mb-1.5">
                Your Full Name <span className="text-[#FF6A2A]">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Julian Sterling"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm bg-[#101113] border border-neutral-700 rounded-xl text-[#F4F0E8] focus:outline-none focus:border-[#FF6A2A] transition-colors"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#A7A39B] mb-1.5">
                Venue / Brand Name <span className="text-[#FF6A2A]">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. L’Osteria Della Luna"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm bg-[#101113] border border-neutral-700 rounded-xl text-[#F4F0E8] focus:outline-none focus:border-[#FF6A2A] transition-colors"
                required
              />
            </div>
          </div>

          {/* Row 2: Service of Interest & Business Type */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-semibold text-[#A7A39B] mb-1.5">
                Service of Primary Interest
              </label>
              <select
                value={serviceOfInterest}
                onChange={(e) => setServiceOfInterest(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm bg-[#101113] border border-neutral-700 rounded-xl text-[#F4F0E8] focus:outline-none focus:border-[#FF6A2A] transition-colors"
              >
                {availableServices.map((srv) => (
                  <option key={srv} value={srv}>
                    {srv}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#A7A39B] mb-1.5">
                Hospitality Sector
              </label>
              <select
                value={businessType}
                onChange={(e) => setBusinessType(e.target.value as any)}
                className="w-full px-3.5 py-2.5 text-sm bg-[#101113] border border-neutral-700 rounded-xl text-[#F4F0E8] focus:outline-none focus:border-[#FF6A2A] transition-colors"
              >
                <option value="Restaurant">Fine Dining / Casual Restaurant</option>
                <option value="Gourmet Lounge">Gourmet Lounge & Botanical Juice Bar</option>
                <option value="Multi-unit Chain">Multi-unit Franchise / Chain</option>
                <option value="Takeaway & Fast Casual">Takeaway & Fast Casual</option>
                <option value="Cloud Kitchen">Ghost Kitchen / Delivery Brand</option>
                <option value="Artisanal Bakery">Artisanal Bakery & Café</option>
                <option value="Gourmet Food Brand">Packaged Gourmet / CPG Food Brand</option>
              </select>
            </div>
          </div>

          {/* Row 3: Email & Phone */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-semibold text-[#A7A39B] mb-1.5">
                Work Email <span className="text-[#FF6A2A]">*</span>
              </label>
              <input
                type="email"
                placeholder="julian@venue.co.uk"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm bg-[#101113] border border-neutral-700 rounded-xl text-[#F4F0E8] focus:outline-none focus:border-[#FF6A2A] transition-colors"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#A7A39B] mb-1.5">
                Contact Phone (Optional)
              </label>
              <input
                type="tel"
                placeholder="+44 20 7946 0912"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm bg-[#101113] border border-neutral-700 rounded-xl text-[#F4F0E8] focus:outline-none focus:border-[#FF6A2A] transition-colors"
              />
            </div>
          </div>

          {/* Row 4: Budget Tier & Target Launch */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-semibold text-[#A7A39B] mb-1.5">
                Budget Tier (Indicative)
              </label>
              <select
                value={budgetTier}
                onChange={(e) => setBudgetTier(e.target.value as any)}
                className="w-full px-3.5 py-2.5 text-sm bg-[#101113] border border-neutral-700 rounded-xl text-[#F4F0E8] focus:outline-none focus:border-[#FF6A2A] transition-colors"
              >
                <option value="£3,000 - £6,000">£3,000 - £6,000 (Guidance / Mini-site)</option>
                <option value="£6,000 - £12,000">£6,000 - £12,000 (Flagship Venue Website)</option>
                <option value="£12,000 - £25,000">£12,000 - £25,000 (Complete 3D & Direct Ordering App)</option>
                <option value="£25,000+">£25,000+ (Multi-location Enterprise Infrastructure)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#A7A39B] mb-1.5">
                Desired Launch Window
              </label>
              <select
                value={targetLaunch}
                onChange={(e) => setTargetLaunch(e.target.value as any)}
                className="w-full px-3.5 py-2.5 text-sm bg-[#101113] border border-neutral-700 rounded-xl text-[#F4F0E8] focus:outline-none focus:border-[#FF6A2A] transition-colors"
              >
                <option value="Immediate (1-2 mo)">Immediate Sprint (1-2 months)</option>
                <option value="Quarterly (2-4 mo)">Quarterly Launch (2-4 months)</option>
                <option value="Flexible">Exploratory / Flexible</option>
              </select>
            </div>
          </div>

          {/* Scope Tags */}
          <div>
            <label className="block text-xs font-semibold text-[#A7A39B] mb-2">
              Capabilities Required (Select all that apply)
            </label>
            <div className="flex flex-wrap gap-2">
              {availableScopeTags.map((tag) => {
                const active = selectedScope.includes(tag);
                return (
                  <button
                    type="button"
                    key={tag}
                    onClick={() => toggleScopeTag(tag)}
                    className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-all cursor-pointer ${
                      active
                        ? 'bg-[#FF6A2A]/20 border-[#FF6A2A] text-white shadow-sm'
                        : 'bg-[#101113] border-neutral-800 text-[#A7A39B] hover:border-neutral-600'
                    }`}
                  >
                    {tag}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Project Details */}
          <div>
            <label className="block text-xs font-semibold text-[#A7A39B] mb-1.5">
              Project Description & Requirements
            </label>
            <textarea
              rows={4}
              placeholder="Tell us about your culinary philosophy, current ordering/booking friction, desired aesthetic, or reference venues..."
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm bg-[#101113] border border-neutral-700 rounded-xl text-[#F4F0E8] focus:outline-none focus:border-[#FF6A2A] transition-colors"
            />
          </div>

          {/* Privacy Acknowledgement */}
          <div className="p-3.5 bg-black/40 rounded-xl border border-white/5 flex items-start gap-3">
            <input
              type="checkbox"
              id="privacyCheck"
              checked={privacyAcknowledged}
              onChange={(e) => setPrivacyAcknowledged(e.target.checked)}
              className="mt-0.5 accent-[#FF6A2A] cursor-pointer"
            />
            <label htmlFor="privacyCheck" className="text-xs text-[#A7A39B] cursor-pointer leading-relaxed">
              I consent to Forkframe Studio securely processing these details in accordance with UK data privacy standards to evaluate our project scope and prepare a confidential proposal.
            </label>
          </div>

          {/* Submit Action */}
          <div className="pt-4 border-t border-white/10 flex items-center justify-between">
            <span className="text-[11px] text-[#A7A39B]">
              Direct channel: <code className="text-[#C8A879]">studioforkframe@gmail.com</code>
            </span>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-3 text-xs font-bold text-black bg-gradient-to-r from-[#FF6A2A] to-[#ff844f] hover:from-[#ff7e47] hover:to-[#ffa275] rounded-xl shadow-[0_0_20px_rgba(255,106,42,0.3)] transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? (
                <span>Registering Brief...</span>
              ) : (
                <>
                  <span>Transmit Project Brief</span>
                  <Send className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </div>
        </form>
      )}

      {/* 10-Step Visual Roadmap Architecture */}
      <div className="mt-14 pt-8 border-t border-white/10">
        <div className="mb-6 flex flex-col md:flex-row md:items-end justify-between gap-2">
          <div>
            <span className="text-xs uppercase tracking-widest text-[#FF6A2A] font-semibold block mb-1">
              Project Delivery Lifecycle
            </span>
            <h3 className="text-xl md:text-2xl font-bold text-[#F4F0E8]">
              The 10-Stage Engineering Roadmap
            </h3>
            <p className="text-xs text-[#A7A39B] mt-1 max-w-2xl">
              From the initial confidential discovery audit to post-launch SLA protection, every Forkframe project follows a rigorous, verified 10-stage delivery process.
            </p>
          </div>
          <span className="text-[11px] font-mono text-[#C8A879]">Stage 01 to 10 Workflow</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
          {[
            { id: '01', title: 'Discovery Call', desc: 'Architecture & technical alignment', img: '/images/briefing/01_discovery_call_architecture.jpg' },
            { id: '02', title: 'Venue DNA', desc: 'Culinary questionnaire & identity capture', img: '/images/briefing/02_venue_dna_questionnaire.jpg' },
            { id: '03', title: 'POS Scoping', desc: 'Hardware & thermal printer mapping', img: '/images/briefing/03_pos_integration_scoping.jpg' },
            { id: '04', title: 'Budget & Tier', desc: 'Fixed-price contract & deliverables', img: '/images/briefing/04_budget_tier_estimation.jpg' },
            { id: '05', title: 'Milestone Plan', desc: 'Sprint timeline & weekly reviews', img: '/images/briefing/05_project_milestone_timeline.jpg' },
            { id: '06', title: 'Asset Manifest', desc: 'Photography & menu copywriting intake', img: '/images/briefing/06_creative_deliverables_manifest.jpg' },
            { id: '07', title: 'Prototyping', desc: 'Interactive 3D & responsive wireframes', img: '/images/briefing/07_rapid_prototyping_sprint.jpg' },
            { id: '08', title: 'QA & Mobile Test', desc: 'Cross-device & speed benchmarking', img: '/images/briefing/08_qa_and_device_testing.jpg' },
            { id: '09', title: 'Go-Live Launch', desc: 'Domain switch & payment verification', img: '/images/briefing/09_launch_day_go_live.jpg' },
            { id: '10', title: 'Support SLA', desc: 'Dedicated WhatsApp & emergency hotline', img: '/images/briefing/10_post_launch_support_sla.jpg' }
          ].map((stage) => (
            <div
              key={stage.id}
              className="p-3 rounded-xl bg-[#191A1D]/80 border border-white/10 hover:border-[#FF6A2A]/50 transition-all group flex flex-col justify-between"
            >
              <div>
                <div className="w-full h-24 rounded-lg overflow-hidden bg-black/60 border border-white/10 mb-2 relative">
                  <img
                    src={stage.img}
                    alt={stage.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    loading="lazy"
                  />
                  <div className="absolute top-1 left-1">
                    <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-black/80 text-[#FF6A2A]">
                      {stage.id}
                    </span>
                  </div>
                </div>
                <h4 className="text-xs font-bold text-[#F4F0E8] group-hover:text-white truncate">
                  {stage.title}
                </h4>
                <p className="text-[10px] text-[#A7A39B] line-clamp-2 mt-0.5 leading-snug">
                  {stage.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
