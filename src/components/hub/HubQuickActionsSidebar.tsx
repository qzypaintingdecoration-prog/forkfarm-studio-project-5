import React, { useState } from 'react';
import { 
  Zap, 
  ChevronRight, 
  ChevronLeft, 
  FileEdit, 
  TrendingUp, 
  Sparkles, 
  Compass, 
  Download, 
  CheckCircle2, 
  ArrowRight,
  ShieldCheck,
  Calculator,
  Search
} from 'lucide-react';
import { DestinationId } from '../../types';
import { soundEngine } from '../../services/soundEngine';

interface HubQuickActionsSidebarProps {
  onTriggerAction: (dest: DestinationId, extraParams?: Record<string, any>) => void;
  onInstantDownloadReport: () => void;
  reportDownloaded: boolean;
  onOpenSearch?: () => void;
}

interface QuickActionItem {
  id: string;
  title: string;
  tagline: string;
  badge: string;
  badgeColor: string;
  icon: React.ComponentType<{ className?: string }>;
  destination?: DestinationId;
  actionType: 'navigate' | 'download' | 'search';
}

export const HubQuickActionsSidebar: React.FC<HubQuickActionsSidebarProps> = ({
  onTriggerAction,
  onInstantDownloadReport,
  reportDownloaded,
  onOpenSearch
}) => {
  const [isOpen, setIsOpen] = useState(true);

  const quickActions: QuickActionItem[] = [
    {
      id: 'search',
      title: 'Global OmniSearch (⌘K)',
      tagline: 'Search destinations, case studies, formulas',
      badge: 'Fast Finder',
      badgeColor: '#FF6A2A',
      icon: Search,
      actionType: 'search'
    },
    {
      id: 'briefing',
      title: 'Generate New Briefing',
      tagline: 'Start formal venue scope & quote request',
      badge: 'Priority Intake',
      badgeColor: '#FF6A2A',
      icon: FileEdit,
      destination: 'briefing',
      actionType: 'navigate'
    },
    {
      id: 'pricing-trends',
      title: 'Check Pricing Trends',
      tagline: 'Audit food cost % against UK inflation',
      badge: 'Margin Engine',
      badgeColor: '#C8A879',
      icon: TrendingUp,
      destination: 'tools',
      actionType: 'navigate'
    },
    {
      id: 'social-creator',
      title: 'Launch Social Studio',
      tagline: 'Create promo graphic or weekend drop banner',
      badge: 'Instant Canvas',
      badgeColor: '#38BDF8',
      icon: Sparkles,
      destination: 'social-studio',
      actionType: 'navigate'
    },
    {
      id: 'free-guidance',
      title: 'Book Free Guidance Session',
      tagline: '30-minute honest tech appraisal with directors',
      badge: '100% Free',
      badgeColor: '#10B981',
      icon: Compass,
      destination: 'services',
      actionType: 'navigate'
    },
    {
      id: 'download-report',
      title: 'Export Margin Sample',
      tagline: 'Download benchmark recipe costing sheet (.txt)',
      badge: 'Instant File',
      badgeColor: '#C8A879',
      icon: Download,
      actionType: 'download'
    }
  ];

  const handleActionClick = (item: QuickActionItem) => {
    soundEngine.playSelectClick();
    if (item.actionType === 'download') {
      onInstantDownloadReport();
    } else if (item.actionType === 'search') {
      if (onOpenSearch) onOpenSearch();
    } else if (item.destination) {
      onTriggerAction(item.destination);
    }
  };

  return (
    <aside 
      className={`fixed top-20 right-4 z-40 transition-all duration-300 pointer-events-auto select-none ${
        isOpen ? 'w-80 sm:w-88' : 'w-12'
      }`}
      aria-label="Hub Quick Actions"
    >
      <div className="relative rounded-2xl bg-[#191A1D]/90 border border-white/10 backdrop-blur-xl shadow-2xl overflow-hidden transition-all duration-300">
        {/* Header Bar */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-white/[0.02]">
          {isOpen ? (
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-[#FF6A2A]/15 text-[#FF6A2A]">
                <Zap className="w-4 h-4 fill-current" />
              </span>
              <div>
                <h3 className="text-xs font-bold text-[#F4F0E8] uppercase tracking-wider">
                  Quick Actions
                </h3>
                <span className="text-[10px] text-[#A7A39B]">Instant Hub Operations</span>
              </div>
            </div>
          ) : (
            <div className="w-full flex justify-center">
              <span className="p-1 rounded-md text-[#FF6A2A]">
                <Zap className="w-4 h-4 fill-current" />
              </span>
            </div>
          )}

          <button
            onClick={() => {
              soundEngine.playSelectClick();
              setIsOpen(!isOpen);
            }}
            title={isOpen ? 'Collapse Quick Actions' : 'Expand Quick Actions'}
            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white transition-colors cursor-pointer"
          >
            {isOpen ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Collapsible Content */}
        {isOpen && (
          <div className="p-3 space-y-2 max-h-[calc(100vh-180px)] overflow-y-auto">
            <span className="text-[10px] uppercase tracking-wider font-semibold text-[#A7A39B] px-1 block mb-1">
              Direct Short-Cuts
            </span>

            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <button
                  key={action.id}
                  onClick={() => handleActionClick(action)}
                  className="w-full text-left p-2.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/5 hover:border-[#FF6A2A]/40 transition-all group flex items-start justify-between gap-3 cursor-pointer hover:translate-x-0.5"
                >
                  <div className="flex items-start gap-2.5 min-w-0">
                    <div className="p-2 rounded-lg bg-black/40 border border-white/5 group-hover:border-[#FF6A2A]/30 text-neutral-300 group-hover:text-[#FF6A2A] transition-colors shrink-0 mt-0.5">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <h4 className="text-xs font-bold text-[#F4F0E8] group-hover:text-white transition-colors truncate">
                          {action.title}
                        </h4>
                        <span 
                          className="text-[9px] font-mono font-semibold px-1.5 py-0.2 rounded"
                          style={{ 
                            backgroundColor: `${action.badgeColor}20`, 
                            color: action.badgeColor,
                            border: `1px solid ${action.badgeColor}40`
                          }}
                        >
                          {action.id === 'download-report' && reportDownloaded ? 'Downloaded!' : action.badge}
                        </span>
                      </div>
                      <p className="text-[11px] text-[#A7A39B] mt-0.5 leading-snug line-clamp-1">
                        {action.tagline}
                      </p>
                    </div>
                  </div>

                  <ArrowRight className="w-3.5 h-3.5 text-neutral-500 group-hover:text-[#FF6A2A] group-hover:translate-x-0.5 transition-transform shrink-0 mt-2" />
                </button>
              );
            })}

            {/* Hub Direct Advisory Note */}
            <div className="mt-3 p-2.5 rounded-xl bg-black/50 border border-white/5 text-[10px] text-[#A7A39B] space-y-1">
              <span className="font-semibold text-[#C8A879] flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Confidential Venue Review</span>
              </span>
              <p className="leading-relaxed">
                All client enquiries and calculations are processed under strict UK confidentiality standards.
              </p>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};
