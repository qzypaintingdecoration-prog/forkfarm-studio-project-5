import React, { useState } from 'react';
import { Calculator, Download, Plus, Trash2, RotateCcw, TrendingUp, Tag, PieChart, FileText, CheckCircle2, AlertCircle } from 'lucide-react';
import { FoodRecipe, IngredientItem, MenuPricingScenario, PromotionScenario } from '../../types';
import { soundEngine } from '../../services/soundEngine';

export const FoodCostCalculatorWorkspace: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'food-cost' | 'menu-pricing' | 'promotion'>('food-cost');
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  // -------------------------------------------------------------
  // TOOL A: FOOD-COST CALCULATOR STATE
  // -------------------------------------------------------------
  const [recipeName, setRecipeName] = useState('Smoked Wagyu Burger & Truffle Chips');
  const [portions, setPortions] = useState(1);
  const [ingredients, setIngredients] = useState<IngredientItem[]>([
    { id: '1', name: 'Dry-Aged Wagyu Mince', purchaseCost: 22.0, purchaseQuantity: 1.0, quantityUsed: 0.2, unit: 'kg' },
    { id: '2', name: 'Brioche Bun (seeded)', purchaseCost: 6.5, purchaseQuantity: 10, quantityUsed: 1, unit: 'pcs' },
    { id: '3', name: 'Black Summer Truffle Aioli', purchaseCost: 18.0, purchaseQuantity: 1.0, quantityUsed: 0.03, unit: 'kg' },
    { id: '4', name: 'Aged Red Leicester', purchaseCost: 11.5, purchaseQuantity: 1.0, quantityUsed: 0.04, unit: 'kg' },
    { id: '5', name: 'Triple Cooked Chips', purchaseCost: 12.0, purchaseQuantity: 10.0, quantityUsed: 0.25, unit: 'kg' }
  ]);

  // Tool A Computations
  const getUnitCost = (item: IngredientItem) => {
    return item.purchaseQuantity > 0 ? item.purchaseCost / item.purchaseQuantity : 0;
  };
  const getLineCost = (item: IngredientItem) => {
    return getUnitCost(item) * item.quantityUsed;
  };
  const totalRecipeCost = ingredients.reduce((sum, item) => sum + getLineCost(item), 0);
  const costPerPortion = portions > 0 ? totalRecipeCost / portions : 0;

  const handleAddIngredient = () => {
    soundEngine.playSelectClick();
    setIngredients([
      ...ingredients,
      { id: String(Date.now()), name: 'New Ingredient', purchaseCost: 10.0, purchaseQuantity: 1.0, quantityUsed: 0.1, unit: 'kg' }
    ]);
  };

  const handleRemoveIngredient = (id: string) => {
    soundEngine.playSelectClick();
    setIngredients(ingredients.filter((it) => it.id !== id));
  };

  const handleResetRecipe = () => {
    soundEngine.playSelectClick();
    setRecipeName('Chef Special Recipe');
    setPortions(1);
    setIngredients([
      { id: '1', name: 'Main Protein / Base', purchaseCost: 15.0, purchaseQuantity: 1.0, quantityUsed: 0.2, unit: 'kg' },
      { id: '2', name: 'Garnish / Sauce', purchaseCost: 8.0, purchaseQuantity: 1.0, quantityUsed: 0.05, unit: 'kg' }
    ]);
  };

  // -------------------------------------------------------------
  // TOOL B: MENU-PRICING CALCULATOR STATE
  // -------------------------------------------------------------
  const [pricingScenario, setPricingScenario] = useState<MenuPricingScenario>({
    costPerPortion: 4.85,
    targetCostPercent: 28, // 28% industry benchmark
    additionalCostAllowance: 0.5, // e.g. packaging or tableware breakage
    proposedSellingPrice: 18.5,
    vatPercent: 20
  });

  // Tool B Computations
  // Formula: Suggested price = (Cost per portion + Additional allowance) ÷ (Target food-cost percentage ÷ 100)
  const effectiveCost = pricingScenario.costPerPortion + (pricingScenario.additionalCostAllowance || 0);
  const targetFraction = Math.max(0.01, pricingScenario.targetCostPercent / 100);
  const suggestedSellingPriceNet = effectiveCost / targetFraction;
  const suggestedSellingPriceGross = suggestedSellingPriceNet * (1 + pricingScenario.vatPercent / 100);

  // If proposed price is entered, compute its actual food cost % and gross contribution
  const proposedNet = (pricingScenario.proposedSellingPrice || suggestedSellingPriceGross) / (1 + pricingScenario.vatPercent / 100);
  const actualCostPercent = proposedNet > 0 ? (effectiveCost / proposedNet) * 100 : 0;
  const grossContribution = proposedNet - effectiveCost;

  // -------------------------------------------------------------
  // TOOL C: PROMOTION PLANNER STATE
  // -------------------------------------------------------------
  const [promoScenario, setPromoScenario] = useState<PromotionScenario>({
    originalPrice: 18.5,
    discountPercent: 20,
    unitCost: 5.35,
    targetQuantity: 150
  });

  // Tool C Computations
  const discountAmount = promoScenario.originalPrice * (promoScenario.discountPercent / 100);
  const discountedPrice = Math.max(0, promoScenario.originalPrice - discountAmount);
  const customerSaving = discountAmount;
  const promoGrossContributionPerItem = discountedPrice - promoScenario.unitCost;
  const scenarioTotalRevenue = discountedPrice * promoScenario.targetQuantity;
  const scenarioTotalContribution = promoGrossContributionPerItem * promoScenario.targetQuantity;

  // -------------------------------------------------------------
  // REPORT GENERATION & DOWNLOAD
  // -------------------------------------------------------------
  const handleDownloadReport = () => {
    soundEngine.playSelectClick();

    const timestamp = new Date().toUTCString();
    const reportContent = `
================================================================================
FORKFRAME STUDIO · THE INFINITE DIMENSION
HOSPITALITY COMMERCIAL PRICING & MARGIN REPORT
Generated on: ${timestamp}
Location: United Kingdom Food & Beverage Standards
================================================================================

1. TOOL A: FOOD-COST RECIPE CALCULATION
--------------------------------------------------------------------------------
Recipe Name: ${recipeName}
Batch Portions: ${portions}
Ingredients Breakdown:
${ingredients
  .map(
    (it) =>
      ` - ${it.name}: Bought ${it.purchaseQuantity} ${it.unit} @ £${it.purchaseCost.toFixed(2)} (Unit Cost: £${getUnitCost(it).toFixed(2)}/${it.unit}) | Used: ${it.quantityUsed} ${it.unit} -> Line Cost: £${getLineCost(it).toFixed(2)}`
  )
  .join('\n')}

Total Batch Prime Food Cost: £${totalRecipeCost.toFixed(2)}
Prime Food Cost Per Portion: £${costPerPortion.toFixed(2)}

--------------------------------------------------------------------------------
2. TOOL B: MENU-PRICING FORMULAS & TARGET MARGINS
--------------------------------------------------------------------------------
Formula: Suggested Selling Price (ex. VAT) = (Portion Cost + Allowance) ÷ (Target % ÷ 100)
- Cost Per Portion: £${pricingScenario.costPerPortion.toFixed(2)}
- Additional Allowance (Packaging/Deli): £${pricingScenario.additionalCostAllowance.toFixed(2)}
- Effective Base Cost: £${effectiveCost.toFixed(2)}
- Target Food Cost %: ${pricingScenario.targetCostPercent}%
- Suggested Menu Price (excl. VAT): £${suggestedSellingPriceNet.toFixed(2)}
- Recommended Retail Menu Price (incl. ${pricingScenario.vatPercent}% UK VAT): £${suggestedSellingPriceGross.toFixed(2)}

Proposed Menu Price Analysis:
- Proposed Retail Price (incl. VAT): £${pricingScenario.proposedSellingPrice?.toFixed(2) || 'N/A'}
- Net Proposed Price (ex. VAT): £${proposedNet.toFixed(2)}
- Resulting Food Cost %: ${actualCostPercent.toFixed(1)}%
- Gross Profit Contribution per dish: £${grossContribution.toFixed(2)}

--------------------------------------------------------------------------------
3. TOOL C: PROMOTION & CAMPAIGN PLANNER
--------------------------------------------------------------------------------
- Original Menu Price: £${promoScenario.originalPrice.toFixed(2)}
- Discount Applied: ${promoScenario.discountPercent}% (£${discountAmount.toFixed(2)} saving)
- Promotional Selling Price: £${discountedPrice.toFixed(2)}
- Unit Food Cost: £${promoScenario.unitCost.toFixed(2)}
- Gross Profit per item on promotion: £${promoGrossContributionPerItem.toFixed(2)}
- Target Campaign Sales Volume: ${promoScenario.targetQuantity} units
- Projected Campaign Revenue: £${scenarioTotalRevenue.toFixed(2)}
- Projected Campaign Gross Contribution: £${scenarioTotalContribution.toFixed(2)}

================================================================================
IMPORTANT FINANCIAL CAVEATS:
Gross Contribution reflects (Net Selling Price - Direct Food Cost). It does not
account for venue rent, front-of-house payroll, kitchen utility overheads, or
merchant card processing charges.
Produced by Forkframe Studio Food Business Tools · studioforkframe@gmail.com
================================================================================
    `.trim();

    const blob = new Blob([reportContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `forkframe-menu-pricing-report-${Date.now()}.txt`;
    link.click();
    URL.revokeObjectURL(url);

    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 3000);
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-4 md:p-8 animate-fadeIn">
      {/* Header */}
      <div className="mb-8 border-b border-white/10 pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <span className="text-xs uppercase tracking-widest text-[#FF6A2A] font-semibold block mb-1">
            Destination 04 · Project Calculator
          </span>
          <h2 className="text-2xl md:text-4xl font-extrabold text-[#F4F0E8]">
            Hospitality Pricing & Margin Suite
          </h2>
          <p className="text-sm text-[#A7A39B] mt-1 max-w-2xl">
            A precision-engineered planning environment providing three working commercial tools: Food-Cost Calculator, Menu-Pricing Calculator, and Promotion Planner.
          </p>
        </div>

        {/* Report Download Action */}
        <button
          onClick={handleDownloadReport}
          className="px-4 py-2.5 text-xs font-semibold text-black bg-[#FF6A2A] hover:bg-[#ff7e47] rounded-xl flex items-center gap-2 transition-all cursor-pointer shadow-lg shrink-0"
        >
          {downloadSuccess ? (
            <>
              <CheckCircle2 className="w-4 h-4 text-black" />
              <span>Report Downloaded (.txt)</span>
            </>
          ) : (
            <>
              <Download className="w-4 h-4 text-black" />
              <span>Download Commercial Report</span>
            </>
          )}
        </button>
      </div>

      {/* Calculator Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-white/10 mb-8 overflow-x-auto pb-2">
        <button
          onClick={() => {
            soundEngine.playSelectClick();
            setActiveTab('food-cost');
          }}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
            activeTab === 'food-cost'
              ? 'bg-[#FF6A2A] text-black shadow-md'
              : 'text-[#A7A39B] hover:text-white bg-white/5'
          }`}
        >
          <PieChart className="w-3.5 h-3.5" />
          <span>Tool A: Food-Cost Calculator</span>
        </button>

        <button
          onClick={() => {
            soundEngine.playSelectClick();
            setActiveTab('menu-pricing');
          }}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
            activeTab === 'menu-pricing'
              ? 'bg-[#FF6A2A] text-black shadow-md'
              : 'text-[#A7A39B] hover:text-white bg-white/5'
          }`}
        >
          <Calculator className="w-3.5 h-3.5" />
          <span>Tool B: Menu-Pricing Calculator</span>
        </button>

        <button
          onClick={() => {
            soundEngine.playSelectClick();
            setActiveTab('promotion');
          }}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
            activeTab === 'promotion'
              ? 'bg-[#FF6A2A] text-black shadow-md'
              : 'text-[#A7A39B] hover:text-white bg-white/5'
          }`}
        >
          <Tag className="w-3.5 h-3.5" />
          <span>Tool C: Promotion Planner</span>
        </button>
      </div>

      {/* ======================================================== */}
      {/* TOOL A: FOOD-COST CALCULATOR                             */}
      {/* ======================================================== */}
      {activeTab === 'food-cost' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-8 bg-[#191A1D]/90 rounded-2xl border border-white/10 p-6 shadow-xl space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex-1 min-w-[200px]">
                <label className="block text-xs font-semibold text-[#A7A39B] mb-1">Dish / Recipe Name</label>
                <input
                  type="text"
                  value={recipeName}
                  onChange={(e) => setRecipeName(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm bg-[#101113] border border-neutral-700 rounded-xl text-[#F4F0E8] font-semibold focus:outline-none focus:border-[#FF6A2A]"
                />
              </div>

              <div className="w-28">
                <label className="block text-xs font-semibold text-[#A7A39B] mb-1">Portions</label>
                <input
                  type="number"
                  min="1"
                  value={portions}
                  onChange={(e) => setPortions(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-full px-3.5 py-2 text-sm bg-[#101113] border border-neutral-700 rounded-xl text-[#F4F0E8] font-mono text-center focus:outline-none focus:border-[#FF6A2A]"
                />
              </div>
            </div>

            {/* Ingredients Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-white/10 text-[#A7A39B] uppercase tracking-wider">
                    <th className="py-2.5 px-2">Ingredient</th>
                    <th className="py-2.5 px-2 text-right">Pack Cost (£)</th>
                    <th className="py-2.5 px-2 text-right">Pack Size</th>
                    <th className="py-2.5 px-2 text-center">Unit</th>
                    <th className="py-2.5 px-2 text-right">Cost/Unit</th>
                    <th className="py-2.5 px-2 text-right">Qty Used</th>
                    <th className="py-2.5 px-2 text-right">Line Total</th>
                    <th className="py-2.5 px-1 text-center w-8"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {ingredients.map((item) => {
                    const unitCost = getUnitCost(item);
                    const lineTotal = getLineCost(item);
                    return (
                      <tr key={item.id} className="hover:bg-white/[0.02] transition-colors">
                        <td className="py-2 px-2">
                          <input
                            type="text"
                            value={item.name}
                            onChange={(e) => {
                              const v = e.target.value;
                              setIngredients(ingredients.map((it) => (it.id === item.id ? { ...it, name: v } : it)));
                            }}
                            className="w-full bg-transparent text-[#F4F0E8] font-medium focus:outline-none focus:text-[#FF6A2A]"
                          />
                        </td>
                        <td className="py-2 px-2 text-right">
                          <input
                            type="number"
                            step="0.1"
                            value={item.purchaseCost}
                            onChange={(e) => {
                              const v = parseFloat(e.target.value) || 0;
                              setIngredients(ingredients.map((it) => (it.id === item.id ? { ...it, purchaseCost: v } : it)));
                            }}
                            className="w-16 bg-[#101113] border border-white/10 rounded px-1.5 py-1 text-right font-mono text-[#F4F0E8]"
                          />
                        </td>
                        <td className="py-2 px-2 text-right">
                          <input
                            type="number"
                            step="0.1"
                            value={item.purchaseQuantity}
                            onChange={(e) => {
                              const v = Math.max(0.001, parseFloat(e.target.value) || 1);
                              setIngredients(ingredients.map((it) => (it.id === item.id ? { ...it, purchaseQuantity: v } : it)));
                            }}
                            className="w-16 bg-[#101113] border border-white/10 rounded px-1.5 py-1 text-right font-mono text-[#F4F0E8]"
                          />
                        </td>
                        <td className="py-2 px-2 text-center text-[#A7A39B] font-mono">
                          {item.unit}
                        </td>
                        <td className="py-2 px-2 text-right font-mono text-[#A7A39B]">
                          £{unitCost.toFixed(2)}
                        </td>
                        <td className="py-2 px-2 text-right">
                          <input
                            type="number"
                            step="0.01"
                            value={item.quantityUsed}
                            onChange={(e) => {
                              const v = parseFloat(e.target.value) || 0;
                              setIngredients(ingredients.map((it) => (it.id === item.id ? { ...it, quantityUsed: v } : it)));
                            }}
                            className="w-16 bg-[#101113] border border-white/10 rounded px-1.5 py-1 text-right font-mono text-[#F4F0E8]"
                          />
                        </td>
                        <td className="py-2 px-2 text-right font-mono font-bold text-[#FF6A2A]">
                          £{lineTotal.toFixed(2)}
                        </td>
                        <td className="py-2 px-1 text-center">
                          <button
                            onClick={() => handleRemoveIngredient(item.id)}
                            className="text-neutral-500 hover:text-red-400 transition-colors p-1"
                            title="Remove Ingredient"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-white/10">
              <div className="flex items-center gap-2">
                <button
                  onClick={handleAddIngredient}
                  className="px-3 py-1.5 text-xs font-semibold text-white bg-white/10 hover:bg-white/15 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5 text-[#FF6A2A]" />
                  <span>Add Ingredient</span>
                </button>
                <button
                  onClick={handleResetRecipe}
                  className="px-3 py-1.5 text-xs font-medium text-[#A7A39B] hover:text-white rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset</span>
                </button>
              </div>

              <div className="text-right">
                <span className="text-xs text-[#A7A39B] mr-2">Total Batch Recipe Cost:</span>
                <span className="text-base font-bold font-mono text-[#F4F0E8]">£{totalRecipeCost.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Right Summary Card */}
          <div className="lg:col-span-4 bg-gradient-to-b from-[#191A1D] to-[#101113] p-6 rounded-2xl border border-[#FF6A2A]/40 shadow-2xl space-y-4">
            <span className="text-xs uppercase tracking-widest text-[#FF6A2A] font-bold block">
              Cost Per Portion Output
            </span>
            <div className="p-4 bg-white/5 rounded-xl border border-white/5">
              <span className="text-xs text-[#A7A39B] block mb-1">Prime Food Cost / Portion</span>
              <span className="text-3xl font-extrabold font-mono text-[#F4F0E8]">
                £{costPerPortion.toFixed(2)}
              </span>
              <span className="text-[11px] text-neutral-400 block mt-1">Based on {portions} portion yield</span>
            </div>

            <div className="text-xs text-[#A7A39B] leading-relaxed space-y-2 pt-2 border-t border-white/10">
              <p>
                <strong>Formula:</strong> <code>Cost Per Unit = Purchase Cost ÷ Purchase Qty</code>
              </p>
              <p>
                <strong>Portion Cost:</strong> <code>Total Batch Cost ÷ Portions</code>
              </p>
            </div>

            <button
              onClick={() => {
                soundEngine.playSelectClick();
                setPricingScenario({ ...pricingScenario, costPerPortion });
                setActiveTab('menu-pricing');
              }}
              className="w-full py-2.5 px-4 text-xs font-semibold text-black bg-[#FF6A2A] hover:bg-[#ff7e47] rounded-xl transition-all cursor-pointer shadow-md"
            >
              Transfer to Menu-Pricing Calculator →
            </button>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TOOL B: MENU-PRICING CALCULATOR                          */}
      {/* ======================================================== */}
      {activeTab === 'menu-pricing' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-7 bg-[#191A1D]/90 rounded-2xl border border-white/10 p-6 shadow-xl space-y-5">
            <h3 className="text-sm uppercase tracking-wider text-[#FF6A2A] font-bold">
              Menu-Pricing Scenario Inputs
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#A7A39B] mb-1">Cost Per Portion (£)</label>
                <input
                  type="number"
                  step="0.01"
                  value={pricingScenario.costPerPortion}
                  onChange={(e) => setPricingScenario({ ...pricingScenario, costPerPortion: parseFloat(e.target.value) || 0 })}
                  className="w-full px-3 py-2 text-sm bg-[#101113] border border-neutral-700 rounded-xl text-[#F4F0E8] font-mono focus:outline-none focus:border-[#FF6A2A]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#A7A39B] mb-1">Target Food-Cost %</label>
                <input
                  type="number"
                  min="10"
                  max="50"
                  value={pricingScenario.targetCostPercent}
                  onChange={(e) => setPricingScenario({ ...pricingScenario, targetCostPercent: parseInt(e.target.value) || 28 })}
                  className="w-full px-3 py-2 text-sm bg-[#101113] border border-neutral-700 rounded-xl text-[#F4F0E8] font-mono focus:outline-none focus:border-[#FF6A2A]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#A7A39B] mb-1">Additional Cost Allowance (£)</label>
                <input
                  type="number"
                  step="0.05"
                  value={pricingScenario.additionalCostAllowance}
                  onChange={(e) => setPricingScenario({ ...pricingScenario, additionalCostAllowance: parseFloat(e.target.value) || 0 })}
                  className="w-full px-3 py-2 text-sm bg-[#101113] border border-neutral-700 rounded-xl text-[#F4F0E8] font-mono focus:outline-none focus:border-[#FF6A2A]"
                />
                <span className="text-[10px] text-neutral-500">Packaging, deli wraps, or table condiments</span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#A7A39B] mb-1">Proposed Selling Price (Optional comparison)</label>
                <input
                  type="number"
                  step="0.5"
                  value={pricingScenario.proposedSellingPrice || ''}
                  onChange={(e) => setPricingScenario({ ...pricingScenario, proposedSellingPrice: parseFloat(e.target.value) || undefined })}
                  className="w-full px-3 py-2 text-sm bg-[#101113] border border-neutral-700 rounded-xl text-[#F4F0E8] font-mono focus:outline-none focus:border-[#FF6A2A]"
                />
                <span className="text-[10px] text-neutral-500">Compare with your current menu price</span>
              </div>
            </div>

            <div className="p-4 bg-white/5 rounded-xl border border-white/5 text-xs text-[#A7A39B] space-y-2">
              <span className="font-semibold text-[#F4F0E8] block">Formula Applied:</span>
              <p className="font-mono text-[11px] text-[#FF6A2A]">
                Suggested Price (Net) = (Cost per portion + Allowance) ÷ (Target % ÷ 100)
              </p>
              <p className="font-mono text-[11px] text-[#C8A879]">
                Recommended Retail Price (Gross) = Suggested Net × (1 + 20% VAT)
              </p>
            </div>
          </div>

          {/* Right Metrics Panel */}
          <div className="lg:col-span-5 bg-gradient-to-b from-[#191A1D] to-[#101113] p-6 rounded-2xl border border-[#C8A879]/40 shadow-2xl space-y-4">
            <span className="text-xs uppercase tracking-widest text-[#C8A879] font-bold block">
              Pricing Analysis Results
            </span>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-white/5 rounded-xl border border-white/5">
                <span className="text-[11px] text-[#A7A39B] block">Suggested Net (ex. VAT)</span>
                <span className="text-xl font-bold font-mono text-white">£{suggestedSellingPriceNet.toFixed(2)}</span>
              </div>
              <div className="p-3 bg-[#FF6A2A]/15 rounded-xl border border-[#FF6A2A]/30">
                <span className="text-[11px] text-[#FF6A2A] block font-semibold">Retail Price (incl. 20% VAT)</span>
                <span className="text-2xl font-extrabold font-mono text-[#FF6A2A]">£{suggestedSellingPriceGross.toFixed(2)}</span>
              </div>
            </div>

            {pricingScenario.proposedSellingPrice && (
              <div className="p-4 bg-white/5 rounded-xl border border-white/5 space-y-2 text-xs">
                <span className="font-semibold text-white block">Proposed Price Diagnostics:</span>
                <div className="flex justify-between">
                  <span className="text-[#A7A39B]">Actual Food Cost %:</span>
                  <span className={`font-mono font-bold ${actualCostPercent > pricingScenario.targetCostPercent ? 'text-red-400' : 'text-emerald-400'}`}>
                    {actualCostPercent.toFixed(1)}% (Target: {pricingScenario.targetCostPercent}%)
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#A7A39B]">Gross Profit Contribution:</span>
                  <span className="font-mono font-bold text-emerald-400">
                    £{grossContribution.toFixed(2)} per cover
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TOOL C: PROMOTION PLANNER                                */}
      {/* ======================================================== */}
      {activeTab === 'promotion' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-7 bg-[#191A1D]/90 rounded-2xl border border-white/10 p-6 shadow-xl space-y-5">
            <h3 className="text-sm uppercase tracking-wider text-[#FF6A2A] font-bold">
              Promotion Campaign Scenario Inputs
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#A7A39B] mb-1">Original Menu Price (£)</label>
                <input
                  type="number"
                  step="0.5"
                  value={promoScenario.originalPrice}
                  onChange={(e) => setPromoScenario({ ...promoScenario, originalPrice: parseFloat(e.target.value) || 0 })}
                  className="w-full px-3 py-2 text-sm bg-[#101113] border border-neutral-700 rounded-xl text-[#F4F0E8] font-mono focus:outline-none focus:border-[#FF6A2A]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#A7A39B] mb-1">Discount %</label>
                <input
                  type="number"
                  min="5"
                  max="80"
                  value={promoScenario.discountPercent}
                  onChange={(e) => setPromoScenario({ ...promoScenario, discountPercent: parseInt(e.target.value) || 0 })}
                  className="w-full px-3 py-2 text-sm bg-[#101113] border border-neutral-700 rounded-xl text-[#F4F0E8] font-mono focus:outline-none focus:border-[#FF6A2A]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#A7A39B] mb-1">Direct Portion Cost (£)</label>
                <input
                  type="number"
                  step="0.1"
                  value={promoScenario.unitCost}
                  onChange={(e) => setPromoScenario({ ...promoScenario, unitCost: parseFloat(e.target.value) || 0 })}
                  className="w-full px-3 py-2 text-sm bg-[#101113] border border-neutral-700 rounded-xl text-[#F4F0E8] font-mono focus:outline-none focus:border-[#FF6A2A]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#A7A39B] mb-1">Target Sales Volume (Covers)</label>
                <input
                  type="number"
                  min="10"
                  max="10000"
                  step="10"
                  value={promoScenario.targetQuantity}
                  onChange={(e) => setPromoScenario({ ...promoScenario, targetQuantity: parseInt(e.target.value) || 0 })}
                  className="w-full px-3 py-2 text-sm bg-[#101113] border border-neutral-700 rounded-xl text-[#F4F0E8] font-mono focus:outline-none focus:border-[#FF6A2A]"
                />
              </div>
            </div>
          </div>

          {/* Right Metrics Panel */}
          <div className="lg:col-span-5 bg-gradient-to-b from-[#191A1D] to-[#101113] p-6 rounded-2xl border border-[#FF6A2A]/40 shadow-2xl space-y-4">
            <span className="text-xs uppercase tracking-widest text-[#FF6A2A] font-bold block">
              Promotional Scenario Outputs
            </span>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-white/5 rounded-xl border border-white/5">
                <span className="text-[11px] text-[#A7A39B] block">Discounted Price</span>
                <span className="text-xl font-bold font-mono text-white">£{discountedPrice.toFixed(2)}</span>
              </div>
              <div className="p-3 bg-white/5 rounded-xl border border-white/5">
                <span className="text-[11px] text-[#A7A39B] block">Customer Saving</span>
                <span className="text-xl font-bold font-mono text-[#FF6A2A]">£{customerSaving.toFixed(2)}</span>
              </div>
            </div>

            <div className="p-4 bg-white/5 rounded-xl border border-white/5 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-[#A7A39B]">Gross Contribution per Item:</span>
                <span className="font-mono font-bold text-emerald-400">£{promoGrossContributionPerItem.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#A7A39B]">Total Campaign Revenue:</span>
                <span className="font-mono font-bold text-white">£{scenarioTotalRevenue.toLocaleString('en-GB', { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-white/10">
                <span className="text-white font-semibold">Total Campaign Contribution:</span>
                <span className="font-mono font-bold text-emerald-400 text-sm">
                  £{scenarioTotalContribution.toLocaleString('en-GB', { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* VISUAL CULINARY FINANCIAL ARCHITECTURE (10 DIAGRAMS)     */}
      {/* ======================================================== */}
      <div className="mt-14 pt-8 border-t border-white/10">
        <div className="mb-6 flex flex-col md:flex-row md:items-end justify-between gap-2">
          <div>
            <span className="text-xs uppercase tracking-widest text-[#FF6A2A] font-semibold block mb-1">
              Destination 04 · Visual Architecture Deck
            </span>
            <h3 className="text-xl md:text-2xl font-bold text-[#F4F0E8]">
              Culinary Unit Economics — 10 Mathematical Models
            </h3>
            <p className="text-xs text-[#A7A39B] mt-1 max-w-2xl">
              Visual engineering diagrams illustrating the exact margin formulas, yield loss multipliers, aggregator commission penalties, and prime cost dynamics enforced by Forkframe Studio.
            </p>
          </div>
          <span className="text-[11px] font-mono text-[#C8A879]">10 Visual Reference Cards</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
          {[
            { id: '01', title: 'Food-Cost % Formula', desc: 'Prime portion net margin derivation', img: '/images/calculators/01_food_cost_formula.jpg' },
            { id: '02', title: 'Menu Pricing Ladder', desc: 'Target cost % to gross retail calculation', img: '/images/calculators/02_menu_pricing_ladder.jpg' },
            { id: '03', title: 'Promotional Simulator', desc: 'Volume multiplier required to offset discounts', img: '/images/calculators/03_promotional_simulator.jpg' },
            { id: '04', title: 'Yield & Waste Loss', desc: 'Trimming and cooking loss impact on cost', img: '/images/calculators/04_yield_and_waste.jpg' },
            { id: '05', title: 'Batch to Portion', desc: 'Stockpot batch division and portion yield', img: '/images/calculators/05_batch_to_portion.jpg' },
            { id: '06', title: 'UK VAT & Net Tax', desc: '20% gross tax decoupling from menu profit', img: '/images/calculators/06_vat_and_tax.jpg' },
            { id: '07', title: 'Prep Labour Cost', desc: 'Hourly prep time amortized across dishes', img: '/images/calculators/07_prep_labour_cost.jpg' },
            { id: '08', title: 'Aggregator Drag', desc: '30% commission erosion vs direct ordering', img: '/images/calculators/08_aggregator_drag.jpg' },
            { id: '09', title: 'Seasonal Hedging', desc: 'Wholesale volatility buffering strategies', img: '/images/calculators/09_seasonal_hedging.jpg' },
            { id: '10', title: 'Prime Cost Matrix', desc: 'COGS + labour combined operating ceiling', img: '/images/calculators/10_prime_cost_matrix.jpg' }
          ].map((diag) => (
            <div
              key={diag.id}
              className="p-3 rounded-xl bg-[#191A1D]/80 border border-white/10 hover:border-[#FF6A2A]/50 transition-all group flex flex-col justify-between cursor-pointer"
            >
              <div>
                <div className="w-full h-28 rounded-lg overflow-hidden bg-black/60 border border-white/10 mb-2 relative">
                  <img
                    src={diag.img}
                    alt={diag.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute top-1 left-1">
                    <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-black/80 text-[#FF6A2A] border border-[#FF6A2A]/30">
                      MODEL {diag.id}
                    </span>
                  </div>
                </div>
                <h4 className="text-xs font-bold text-[#F4F0E8] group-hover:text-white truncate">
                  {diag.title}
                </h4>
                <p className="text-[10px] text-[#A7A39B] line-clamp-2 mt-0.5 leading-snug">
                  {diag.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
