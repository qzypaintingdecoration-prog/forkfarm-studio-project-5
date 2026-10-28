import React, { useState, useRef, useEffect } from 'react';
import { Download, Upload, Undo2, Redo2, RotateCcw, Type, Layers, Palette, Image as ImageIcon, CheckCircle2, AlertTriangle } from 'lucide-react';
import { soundEngine } from '../../services/soundEngine';

interface TemplateOption {
  id: string;
  name: string;
  category: string;
  defaultHeadline: string;
  defaultSubtitle: string;
  defaultBadge: string;
  defaultPrice: string;
  bgGradient: [string, string];
  accent: string;
  image: string;
}

interface CanvasState {
  headline: string;
  subtitle: string;
  badge: string;
  price: string;
  accent: string;
}

const TEMPLATES: TemplateOption[] = [
  {
    id: 'burger',
    name: 'Wagyu Burger & Brew',
    category: 'Gourmet Casual',
    defaultHeadline: 'SMOKED WAGYU TASTING',
    defaultSubtitle: 'Truffle aioli · aged red Leicester · toasted brioche',
    defaultBadge: 'CHEF’S SPECIAL',
    defaultPrice: '£16.50',
    bgGradient: ['#1c130c', '#080604'],
    accent: '#FF6A2A',
    image: '/images/social-studio/01_social_wagyu_burger.svg'
  },
  {
    id: 'pizza',
    name: 'Artisan Neapolitan',
    category: 'Pizzeria',
    defaultHeadline: '48-HR FERMENTED CRUST',
    defaultSubtitle: 'San Marzano DOP · fior di latte · wild oregano',
    defaultBadge: 'WOOD-FIRED DAILY',
    defaultPrice: '£14.00',
    bgGradient: ['#230f0f', '#090505'],
    accent: '#ef4444',
    image: '/images/social-studio/02_social_neapolitan_pizza.svg'
  },
  {
    id: 'omakase',
    name: 'Omakase & Raw Bar',
    category: 'Fine Dining',
    defaultHeadline: 'AUTUMN NIGIRI DROP',
    defaultSubtitle: 'Bluefin otoro · hokkaido uni · caviar garnish',
    defaultBadge: 'LIMITED 20 COVERS',
    defaultPrice: '£85.00',
    bgGradient: ['#0f172a', '#040711'],
    accent: '#38bdf8',
    image: '/images/social-studio/03_social_omakase_nigiri.svg'
  },
  {
    id: 'pasta',
    name: 'Handmade Pasta',
    category: 'Italian Osteria',
    defaultHeadline: 'TRUFFLE TAGLIOLINI',
    defaultSubtitle: 'Hand-rolled egg yolk pasta · 36-mo parmigiano',
    defaultBadge: 'FRESH TODAY',
    defaultPrice: '£22.00',
    bgGradient: ['#1e1b18', '#070605'],
    accent: '#C8A879',
    image: '/images/social-studio/04_social_truffle_pasta.svg'
  },
  {
    id: 'brunch',
    name: 'Weekend Brunch Drop',
    category: 'Café & Bakery',
    defaultHeadline: 'SIGNATURE BRUNCH',
    defaultSubtitle: 'Poached eggs · sourdough · house cured gravlax',
    defaultBadge: 'SAT & SUN ONLY',
    defaultPrice: '£15.00',
    bgGradient: ['#141c19', '#050a08'],
    accent: '#34d399',
    image: '/images/social-studio/05_social_weekend_brunch.svg'
  },
  {
    id: 'cocktail',
    name: 'Aperitivo & Spritz Hour',
    category: 'Cocktail Bar',
    defaultHeadline: 'GOLDEN HOUR SPRITZ',
    defaultSubtitle: 'Blood orange botanical bitters · prosecco DOCG',
    defaultBadge: '5PM - 7PM DAILY',
    defaultPrice: '2 FOR £18',
    bgGradient: ['#231505', '#0c0702'],
    accent: '#f97316',
    image: '/images/social-studio/06_social_cocktail_happy_hour.svg'
  },
  {
    id: 'roast',
    name: 'Heritage Sunday Roast',
    category: 'Gastro-Pub & Carvery',
    defaultHeadline: 'SLOW-ROASTED BEEF',
    defaultSubtitle: 'Giant Yorkshire pudding · bone marrow gravy',
    defaultBadge: 'EVERY SUNDAY',
    defaultPrice: '£24.50',
    bgGradient: ['#1c1208', '#080502'],
    accent: '#d97706',
    image: '/images/social-studio/07_social_sunday_roast.svg'
  },
  {
    id: 'dessert',
    name: 'Artisan Pâtisserie Drop',
    category: 'Bakery & Dessert Bar',
    defaultHeadline: 'PISTACHIO CHOUX',
    defaultSubtitle: 'Bronte pistachio praline · white chocolate cream',
    defaultBadge: 'LIMITED BATCH',
    defaultPrice: '£7.80',
    bgGradient: ['#121b18', '#040907'],
    accent: '#10b981',
    image: '/images/social-studio/08_social_dessert_drop.svg'
  },
  {
    id: 'tasting',
    name: 'Head Chef Secret Tasting',
    category: 'Tasting Room',
    defaultHeadline: '7-COURSE SURPRISE',
    defaultSubtitle: 'Seasonal British game · foraging pairings',
    defaultBadge: 'PRIVATE TABLE',
    defaultPrice: '£95.00',
    bgGradient: ['#181528', '#06050e'],
    accent: '#a855f7',
    image: '/images/social-studio/09_social_limited_tasting.svg'
  },
  {
    id: 'wine',
    name: 'Sommelier Wine Flight',
    category: 'Cellar & Wine Bar',
    defaultHeadline: 'PIEDMONT DISCOVERY',
    defaultSubtitle: 'Barolo DOCG · Barbera d’Alba · artisan cheeses',
    defaultBadge: 'CELLAR SELECT',
    defaultPrice: '£38.00',
    bgGradient: ['#1e0e16', '#090306'],
    accent: '#f43f5e',
    image: '/images/social-studio/10_social_wine_pairing.svg'
  }
];

export const SocialStudioWorkspace: React.FC = () => {
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateOption>(TEMPLATES[0]);
  const [headline, setHeadline] = useState(TEMPLATES[0].defaultHeadline);
  const [subtitle, setSubtitle] = useState(TEMPLATES[0].defaultSubtitle);
  const [badge, setBadge] = useState(TEMPLATES[0].defaultBadge);
  const [price, setPrice] = useState(TEMPLATES[0].defaultPrice);
  const [accentColor, setAccentColor] = useState(TEMPLATES[0].accent);
  const [presetFormat, setPresetFormat] = useState<'1:1' | '9:16' | 'custom'>('1:1');
  const [customWidth, setCustomWidth] = useState(1200);
  const [customHeight, setCustomHeight] = useState(630);
  const [uploadedImage, setUploadedImage] = useState<HTMLImageElement | null>(null);
  const [confirmReset, setConfirmReset] = useState(false);
  const [activeTab, setActiveTab] = useState<'text' | 'image' | 'presets'>('text');

  // History stack for Undo / Redo
  const [history, setHistory] = useState<CanvasState[]>([
    {
      headline: TEMPLATES[0].defaultHeadline,
      subtitle: TEMPLATES[0].defaultSubtitle,
      badge: TEMPLATES[0].defaultBadge,
      price: TEMPLATES[0].defaultPrice,
      accent: TEMPLATES[0].accent
    }
  ]);
  const [historyIndex, setHistoryIndex] = useState(0);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const pushState = (newState: CanvasState) => {
    const updated = history.slice(0, historyIndex + 1);
    updated.push(newState);
    setHistory(updated);
    setHistoryIndex(updated.length - 1);
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      soundEngine.playSelectClick();
      const prev = history[historyIndex - 1];
      setHeadline(prev.headline);
      setSubtitle(prev.subtitle);
      setBadge(prev.badge);
      setPrice(prev.price);
      setAccentColor(prev.accent);
      setHistoryIndex(historyIndex - 1);
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      soundEngine.playSelectClick();
      const next = history[historyIndex + 1];
      setHeadline(next.headline);
      setSubtitle(next.subtitle);
      setBadge(next.badge);
      setPrice(next.price);
      setAccentColor(next.accent);
      setHistoryIndex(historyIndex + 1);
    }
  };

  const handleSelectTemplate = (tpl: TemplateOption) => {
    soundEngine.playSelectClick();
    setSelectedTemplate(tpl);
    setHeadline(tpl.defaultHeadline);
    setSubtitle(tpl.defaultSubtitle);
    setBadge(tpl.defaultBadge);
    setPrice(tpl.defaultPrice);
    setAccentColor(tpl.accent);
    pushState({
      headline: tpl.defaultHeadline,
      subtitle: tpl.defaultSubtitle,
      badge: tpl.defaultBadge,
      price: tpl.defaultPrice,
      accent: tpl.accent
    });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    soundEngine.playSelectClick();
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        setUploadedImage(img);
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const loadStudioPhoto = (src: string) => {
    soundEngine.playSelectClick();
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      setUploadedImage(img);
    };
    img.src = src;
  };

  const handleReset = () => {
    soundEngine.playSelectClick();
    setUploadedImage(null);
    setHeadline(selectedTemplate.defaultHeadline);
    setSubtitle(selectedTemplate.defaultSubtitle);
    setBadge(selectedTemplate.defaultBadge);
    setPrice(selectedTemplate.defaultPrice);
    setConfirmReset(false);
  };

  // Re-draw canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = 1080;
    let height = 1080;
    if (presetFormat === '9:16') {
      width = 1080;
      height = 1920;
    } else if (presetFormat === 'custom') {
      width = customWidth;
      height = customHeight;
    }

    canvas.width = width;
    canvas.height = height;

    // Background Gradient
    const grad = ctx.createRadialGradient(
      width / 2,
      height * 0.45,
      100,
      width / 2,
      height * 0.5,
      width * 0.8
    );
    grad.addColorStop(0, selectedTemplate.bgGradient[0]);
    grad.addColorStop(1, selectedTemplate.bgGradient[1]);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);

    // If local image is imported, draw it centered
    if (uploadedImage) {
      ctx.save();
      ctx.globalAlpha = 0.75;
      const aspect = uploadedImage.width / uploadedImage.height;
      let drawW = width * 0.75;
      let drawH = drawW / aspect;
      if (drawH > height * 0.45) {
        drawH = height * 0.45;
        drawW = drawH * aspect;
      }
      const drawX = width / 2 - drawW / 2;
      const drawY = height * 0.42 - drawH / 2;

      ctx.beginPath();
      ctx.roundRect(drawX, drawY, drawW, drawH, 20);
      ctx.clip();
      ctx.drawImage(uploadedImage, drawX, drawY, drawW, drawH);
      ctx.restore();
    } else {
      // Geometric plate aura
      const auraGrad = ctx.createRadialGradient(
        width / 2,
        height * 0.44,
        50,
        width / 2,
        height * 0.44,
        320
      );
      auraGrad.addColorStop(0, accentColor + '33');
      auraGrad.addColorStop(1, 'transparent');
      ctx.fillStyle = auraGrad;
      ctx.beginPath();
      ctx.arc(width / 2, height * 0.44, 320, 0, Math.PI * 2);
      ctx.fill();

      // Plate geometry
      ctx.strokeStyle = accentColor;
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.arc(width / 2, height * 0.44, 180, 0, Math.PI * 2);
      ctx.stroke();

      ctx.strokeStyle = 'rgba(244, 240, 232, 0.2)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(width / 2, height * 0.44, 210, 0, Math.PI * 2);
      ctx.stroke();
    }

    // Outer border
    ctx.strokeStyle = 'rgba(244, 240, 232, 0.1)';
    ctx.lineWidth = 2;
    ctx.strokeRect(50, 50, width - 100, height - 100);

    // Forkframe brand tag
    ctx.fillStyle = 'rgba(244, 240, 232, 0.6)';
    ctx.font = '600 22px "Plus Jakarta Sans", sans-serif';
    ctx.textAlign = 'center';
    ctx.letterSpacing = '5px';
    ctx.fillText('FORKFRAME STUDIO · FOOD BUSINESS SUITE', width / 2, 110);

    // Badge
    if (badge) {
      const badgeText = badge.toUpperCase();
      ctx.font = 'bold 22px "Plus Jakarta Sans", sans-serif';
      const textWidth = ctx.measureText(badgeText).width;
      const pillWidth = textWidth + 48;
      const pillHeight = 44;
      const pillX = width / 2 - pillWidth / 2;
      const pillY = height * 0.23;

      ctx.fillStyle = accentColor;
      ctx.beginPath();
      ctx.roundRect(pillX, pillY, pillWidth, pillHeight, 22);
      ctx.fill();

      ctx.fillStyle = '#101113';
      ctx.textAlign = 'center';
      ctx.fillText(badgeText, width / 2, pillY + 30);
    }

    // Headline
    ctx.fillStyle = '#F4F0E8';
    ctx.font = '800 66px "Outfit", sans-serif';
    ctx.textAlign = 'center';
    ctx.letterSpacing = '2px';
    ctx.fillText(headline, width / 2, height * 0.72);

    // Subtitle
    ctx.fillStyle = 'rgba(244, 240, 232, 0.82)';
    ctx.font = '400 32px "Plus Jakarta Sans", sans-serif';
    ctx.textAlign = 'center';
    ctx.letterSpacing = '0px';
    ctx.fillText(subtitle, width / 2, height * 0.79);

    // Price
    if (price) {
      ctx.fillStyle = accentColor;
      ctx.font = '700 52px "Outfit", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(price, width / 2, height * 0.88);
    }

    // Footer note
    ctx.fillStyle = 'rgba(244, 240, 232, 0.4)';
    ctx.font = '400 20px "Plus Jakarta Sans", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Book table or order direct online', width / 2, height - 90);
  }, [selectedTemplate, headline, subtitle, badge, price, accentColor, presetFormat, customWidth, customHeight, uploadedImage]);

  const handleExport = (format: 'png' | 'jpeg') => {
    soundEngine.playSelectClick();
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dataUrl = canvas.toDataURL(`image/${format}`, 0.95);
    const link = document.createElement('a');
    link.download = `forkframe-media-${selectedTemplate.id}-${Date.now()}.${format}`;
    link.href = dataUrl;
    link.click();
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-4 md:p-8 animate-fadeIn">
      {/* Header */}
      <div className="mb-6 flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <span className="text-xs uppercase tracking-widest text-[#FF6A2A] font-semibold">
            Destination 03 · Social Studio
          </span>
          <h2 className="text-2xl md:text-4xl font-extrabold text-[#F4F0E8] mt-1">
            Social Creative Production Laboratory
          </h2>
          <p className="text-sm text-[#A7A39B] mt-1 max-w-2xl">
            A production workspace to compose, customize, and export genuine high-res promotional graphics, seasonal drops, and stories. Processed locally in your browser with zero server data retention.
          </p>
        </div>

        {/* Format Selector */}
        <div className="flex items-center gap-1.5 p-1 bg-white/5 rounded-xl border border-white/10 shrink-0">
          <button
            onClick={() => {
              soundEngine.playSelectClick();
              setPresetFormat('1:1');
            }}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
              presetFormat === '1:1' ? 'bg-[#FF6A2A] text-black shadow-sm' : 'text-[#A7A39B] hover:text-white'
            }`}
          >
            1:1 Post
          </button>
          <button
            onClick={() => {
              soundEngine.playSelectClick();
              setPresetFormat('9:16');
            }}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
              presetFormat === '9:16' ? 'bg-[#FF6A2A] text-black shadow-sm' : 'text-[#A7A39B] hover:text-white'
            }`}
          >
            9:16 Story
          </button>
        </div>
      </div>

      {/* Main Studio Workspace Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Interactive Canvas Viewport (7 cols) */}
        <div className="lg:col-span-7 flex flex-col items-center justify-center p-6 bg-[#191A1D]/80 rounded-2xl border border-white/10 shadow-2xl relative">
          {/* Top Canvas Controls Bar */}
          <div className="w-full flex items-center justify-between mb-4 text-xs text-[#A7A39B]">
            <div className="flex items-center gap-2">
              <button
                onClick={handleUndo}
                disabled={historyIndex === 0}
                className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 disabled:opacity-30 text-white cursor-pointer"
                title="Undo"
              >
                <Undo2 className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={handleRedo}
                disabled={historyIndex === history.length - 1}
                className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 disabled:opacity-30 text-white cursor-pointer"
                title="Redo"
              >
                <Redo2 className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setConfirmReset(true)}
                className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-red-400 cursor-pointer"
                title="Reset with Confirmation"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>

            <span className="font-mono text-[11px]">
              {presetFormat === '1:1' ? '1080 × 1080 px' : '1080 × 1920 px'} · Local Engine
            </span>
          </div>

          {/* Canvas Wrapper */}
          <div className="relative max-h-[520px] flex items-center justify-center overflow-hidden rounded-xl shadow-2xl border border-white/10 bg-[#101113]">
            <canvas
              ref={canvasRef}
              className="max-h-[480px] w-auto h-auto object-contain transition-all duration-300"
            />
          </div>

          {/* Export Strip */}
          <div className="w-full mt-6 flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-white/10">
            <span className="text-xs text-[#A7A39B]">Direct client-side render to verified file</span>
            <div className="flex items-center gap-3">
              <button
                onClick={() => handleExport('png')}
                className="px-4 py-2 text-xs font-semibold text-black bg-[#FF6A2A] hover:bg-[#ff7e47] rounded-xl flex items-center gap-2 transition-all cursor-pointer shadow-md"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export PNG (High-Res)</span>
              </button>
              <button
                onClick={() => handleExport('jpeg')}
                className="px-4 py-2 text-xs font-medium text-white bg-white/10 hover:bg-white/20 rounded-xl flex items-center gap-2 transition-colors cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export JPEG</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Editing Suite Controls (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-5">
          {/* Subtabs */}
          <div className="flex items-center gap-2 border-b border-white/10 pb-3">
            <button
              onClick={() => {
                soundEngine.playSelectClick();
                setActiveTab('text');
              }}
              className={`flex items-center gap-1.5 text-xs font-semibold py-1.5 px-3 rounded-lg transition-colors cursor-pointer ${
                activeTab === 'text' ? 'bg-[#FF6A2A]/20 text-[#FF6A2A] border border-[#FF6A2A]/30' : 'text-[#A7A39B] hover:text-white'
              }`}
            >
              <Type className="w-3.5 h-3.5" />
              <span>Typography</span>
            </button>
            <button
              onClick={() => {
                soundEngine.playSelectClick();
                setActiveTab('image');
              }}
              className={`flex items-center gap-1.5 text-xs font-semibold py-1.5 px-3 rounded-lg transition-colors cursor-pointer ${
                activeTab === 'image' ? 'bg-[#FF6A2A]/20 text-[#FF6A2A] border border-[#FF6A2A]/30' : 'text-[#A7A39B] hover:text-white'
              }`}
            >
              <ImageIcon className="w-3.5 h-3.5" />
              <span>Import Image</span>
            </button>
            <button
              onClick={() => {
                soundEngine.playSelectClick();
                setActiveTab('presets');
              }}
              className={`flex items-center gap-1.5 text-xs font-semibold py-1.5 px-3 rounded-lg transition-colors cursor-pointer ${
                activeTab === 'presets' ? 'bg-[#FF6A2A]/20 text-[#FF6A2A] border border-[#FF6A2A]/30' : 'text-[#A7A39B] hover:text-white'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Presets</span>
            </button>
          </div>

          {/* Tab 1: Text */}
          {activeTab === 'text' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-[#A7A39B] mb-1">Headline Text</label>
                <input
                  type="text"
                  value={headline}
                  onChange={(e) => {
                    setHeadline(e.target.value);
                    pushState({ headline: e.target.value, subtitle, badge, price, accent: accentColor });
                  }}
                  className="w-full px-3 py-2 text-sm bg-[#101113] border border-neutral-700 rounded-xl text-[#F4F0E8] focus:outline-none focus:border-[#FF6A2A]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#A7A39B] mb-1">Subtitle / Tasting Description</label>
                <input
                  type="text"
                  value={subtitle}
                  onChange={(e) => {
                    setSubtitle(e.target.value);
                    pushState({ headline, subtitle: e.target.value, badge, price, accent: accentColor });
                  }}
                  className="w-full px-3 py-2 text-sm bg-[#101113] border border-neutral-700 rounded-xl text-[#F4F0E8] focus:outline-none focus:border-[#FF6A2A]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-[#A7A39B] mb-1">Badge Callout</label>
                  <input
                    type="text"
                    value={badge}
                    onChange={(e) => {
                      setBadge(e.target.value);
                      pushState({ headline, subtitle, badge: e.target.value, price, accent: accentColor });
                    }}
                    className="w-full px-3 py-2 text-sm bg-[#101113] border border-neutral-700 rounded-xl text-[#F4F0E8] focus:outline-none focus:border-[#FF6A2A]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#A7A39B] mb-1">Price Tag</label>
                  <input
                    type="text"
                    value={price}
                    onChange={(e) => {
                      setPrice(e.target.value);
                      pushState({ headline, subtitle, badge, price: e.target.value, accent: accentColor });
                    }}
                    className="w-full px-3 py-2 text-sm bg-[#101113] border border-neutral-700 rounded-xl text-[#F4F0E8] focus:outline-none focus:border-[#FF6A2A]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#A7A39B] mb-2">Accent Color</label>
                <div className="flex items-center gap-3">
                  {['#FF6A2A', '#C8A879', '#38bdf8', '#ef4444', '#34d399'].map((c) => (
                    <button
                      key={c}
                      onClick={() => {
                        soundEngine.playSelectClick();
                        setAccentColor(c);
                        pushState({ headline, subtitle, badge, price, accent: c });
                      }}
                      className={`w-7 h-7 rounded-full border-2 transition-all cursor-pointer ${
                        accentColor === c ? 'border-white scale-110 shadow-lg' : 'border-transparent'
                      }`}
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: Local Image Import */}
          {activeTab === 'image' && (
            <div className="space-y-4">
              <span className="text-xs text-[#A7A39B] block">
                Import local food photography directly into the canvas. All processing remains on your device:
              </span>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />

              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full p-6 rounded-2xl border-2 border-dashed border-white/20 hover:border-[#FF6A2A] bg-white/5 flex flex-col items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <Upload className="w-6 h-6 text-[#FF6A2A]" />
                <span className="text-xs font-bold text-[#F4F0E8]">Choose Local Image File</span>
                <span className="text-[10px] text-[#A7A39B]">JPEG, PNG, WebP supported</span>
              </button>

              {uploadedImage && (
                <div className="p-3 bg-white/5 rounded-xl border border-white/10 flex items-center justify-between text-xs">
                  <span className="text-emerald-400 flex items-center gap-1.5 font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Image Loaded on Canvas</span>
                  </span>
                  <button
                    onClick={() => setUploadedImage(null)}
                    className="text-red-400 hover:underline cursor-pointer"
                  >
                    Remove Image
                  </button>
                </div>
              )}

              {/* 4K Photography Library */}
              <div className="pt-2">
                <span className="text-xs font-semibold text-[#F4F0E8] block mb-2">
                  Or load from Forkframe 4K Photography Archive:
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { label: 'Mayfair Cellar', src: '/images/photos/osteria_mayfair_4k.jpg' },
                    { label: 'Prime Fire Grill', src: '/images/photos/prime_fire_4k.jpg' },
                    { label: 'Matcha Bakery', src: '/images/photos/kuro_artisan_4k.jpg' },
                    { label: 'Paris Pâtisserie', src: '/images/photos/mirabelle_patisserie_4k.jpg' },
                    { label: 'Smokehouse BBQ', src: '/images/photos/smoke_barrel_4k.jpg' },
                    { label: 'Street Piadina', src: '/images/photos/veloce_piadina_4k.jpg' },
                    { label: 'Hearth Sourdough', src: '/images/photos/flour_hearth_4k.jpg' },
                    { label: 'Cornish Oysters', src: '/images/photos/neptune_oyster_4k.jpg' }
                  ].map((photo, i) => (
                    <button
                      key={i}
                      onClick={() => loadStudioPhoto(photo.src)}
                      className="p-1.5 rounded-lg bg-black/50 border border-white/10 hover:border-[#FF6A2A] text-left transition-all cursor-pointer group"
                    >
                      <div className="w-full h-14 rounded overflow-hidden mb-1">
                        <img
                          src={photo.src}
                          alt={photo.label}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                      </div>
                      <span className="text-[10px] text-neutral-300 group-hover:text-white truncate block">
                        {photo.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Tab 3: Presets (10 Visual Culinary Drop Templates) */}
          {activeTab === 'presets' && (
            <div className="space-y-3">
              <span className="text-xs text-[#A7A39B]">Select from 10 verified culinary drop designs:</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[500px] overflow-y-auto pr-1">
                {TEMPLATES.map((tpl) => (
                  <button
                    key={tpl.id}
                    onClick={() => handleSelectTemplate(tpl)}
                    className={`text-left p-2.5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between group overflow-hidden ${
                      selectedTemplate.id === tpl.id
                        ? 'border-[#FF6A2A] bg-[#FF6A2A]/15 shadow-lg ring-1 ring-[#FF6A2A]'
                        : 'border-white/10 bg-[#191A1D] hover:border-white/20 hover:bg-[#191A1D]/80'
                    }`}
                  >
                    <div className="w-full h-24 rounded-lg overflow-hidden bg-black/50 border border-white/10 mb-2 relative">
                      <img
                        src={tpl.image}
                        alt={tpl.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        loading="lazy"
                      />
                      <div className="absolute top-1 right-1">
                        <span
                          className="w-3 h-3 rounded-full border border-white/30 block shadow"
                          style={{ backgroundColor: tpl.accent }}
                        />
                      </div>
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-[#F4F0E8] truncate group-hover:text-white">
                        {tpl.name}
                      </h4>
                      <span className="text-[10px] text-[#A7A39B] block truncate">{tpl.category}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Reset Confirmation Modal */}
          {confirmReset && (
            <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 space-y-3 animate-fadeIn">
              <div className="flex items-center gap-2 text-xs font-bold text-red-300">
                <AlertTriangle className="w-4 h-4 text-red-400" />
                <span>Reset Canvas to Default Preset?</span>
              </div>
              <p className="text-[11px] text-neutral-300">
                This will clear any imported images and custom text modifications.
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleReset}
                  className="px-3 py-1.5 text-xs font-semibold text-black bg-red-400 hover:bg-red-300 rounded-lg cursor-pointer"
                >
                  Confirm Reset
                </button>
                <button
                  onClick={() => setConfirmReset(false)}
                  className="px-3 py-1.5 text-xs text-neutral-400 hover:text-white cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
