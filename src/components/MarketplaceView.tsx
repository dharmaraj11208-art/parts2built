import React, { useState, useMemo } from 'react';
import { ElectronicComponent, ComponentCategory, MarketplaceTransaction, ListingType } from '../types';
import {
  ShoppingBag,
  Clock,
  Briefcase,
  Search,
  Filter,
  CheckCircle2,
  DollarSign,
  ShieldCheck,
  MapPin,
  Star,
  Plus,
  ArrowRight,
  Sparkles,
  Calendar,
  AlertCircle,
  RotateCcw,
  Truck,
  Layers,
  ChevronRight,
  TrendingUp,
  Receipt
} from 'lucide-react';

interface MarketplaceViewProps {
  components: ElectronicComponent[];
  transactions: MarketplaceTransaction[];
  onBuyComponent: (componentId: string, quantity: number, buyerName: string) => void;
  onRentComponent: (componentId: string, quantity: number, rentalDays: number, buyerName: string, projectName?: string) => void;
  onReturnRental: (transactionId: string) => void;
  onUpdateComponentListing: (componentId: string, listingType: ListingType, pricePerUnit?: number, rentalRatePerDay?: number, rentalDeposit?: number) => void;
  onOpenAddModal: () => void;
  onSelectComponentForInspect?: (comp: ElectronicComponent) => void;
}

export type MarketplaceMode = 'buy' | 'rent' | 'seller';

export const MarketplaceView: React.FC<MarketplaceViewProps> = ({
  components,
  transactions,
  onBuyComponent,
  onRentComponent,
  onReturnRental,
  onUpdateComponentListing,
  onOpenAddModal
}) => {
  const [activeMode, setActiveMode] = useState<MarketplaceMode>('buy');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  // Modals state
  const [buyingComponent, setBuyingComponent] = useState<ElectronicComponent | null>(null);
  const [buyQuantity, setBuyQuantity] = useState<number>(1);
  const [buyerName, setBuyerName] = useState<string>('Engineering Lab Team');
  const [pickupMethod, setPickupMethod] = useState<'facility' | 'courier'>('facility');

  const [rentingComponent, setRentingComponent] = useState<ElectronicComponent | null>(null);
  const [rentQuantity, setRentQuantity] = useState<number>(1);
  const [rentalDays, setRentalDays] = useState<number>(7);
  const [renterName, setRenterName] = useState<string>('Mechatronics Capstone Student');
  const [rentalProjectName, setRentalProjectName] = useState<string>('Autonomous Obstacle Rover');

  // Quick edit listing in Seller Portal
  const [editingListingComp, setEditingListingComp] = useState<ElectronicComponent | null>(null);
  const [editListingType, setEditListingType] = useState<ListingType>('sale_or_rent');
  const [editPrice, setEditPrice] = useState<number>(5.0);
  const [editRentRate, setEditRentRate] = useState<number>(1.0);
  const [editDeposit, setEditDeposit] = useState<number>(10.0);

  // Filter components for Buy Mode (must have listingType 'sale' or 'sale_or_rent', or default priced)
  const buyableComponents = useMemo(() => {
    return components.filter((c) => {
      const isForSale = c.listingType === 'sale' || c.listingType === 'sale_or_rent' || (c.pricePerUnit !== undefined && c.pricePerUnit > 0);
      const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (c.sellerName && c.sellerName.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesCategory = selectedCategory === 'All' || c.category === selectedCategory;
      return isForSale && matchesSearch && matchesCategory;
    });
  }, [components, searchQuery, selectedCategory]);

  // Filter components for Rent Mode (must have listingType 'rent' or 'sale_or_rent' or rentalRatePerDay)
  const rentableComponents = useMemo(() => {
    return components.filter((c) => {
      const isForRent = c.listingType === 'rent' || c.listingType === 'sale_or_rent' || (c.rentalRatePerDay !== undefined && c.rentalRatePerDay > 0);
      const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (c.sellerName && c.sellerName.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesCategory = selectedCategory === 'All' || c.category === selectedCategory;
      return isForRent && matchesSearch && matchesCategory;
    });
  }, [components, searchQuery, selectedCategory]);

  // Active rentals
  const activeRentals = useMemo(() => {
    return transactions.filter((t) => t.type === 'rent' && t.status === 'active_rental');
  }, [transactions]);

  // Completed transactions
  const completedTransactions = useMemo(() => {
    return transactions.filter((t) => t.status === 'completed' || t.status === 'returned');
  }, [transactions]);

  // Seller metrics
  const totalMarketplaceValue = useMemo(() => {
    return components.reduce((sum, c) => {
      const unitVal = c.pricePerUnit || (c.rentalRatePerDay ? c.rentalRatePerDay * 5 : 0);
      return sum + unitVal * c.quantity;
    }, 0);
  }, [components]);

  const totalRevenueEarned = useMemo(() => {
    return transactions.reduce((sum, t) => sum + t.totalAmount, 0);
  }, [transactions]);

  const categories = ['All', 'Microcontrollers & ICs', 'Passive Components', 'Actuators & Motors', 'Sensors', 'Power & Cables', 'Switches & Controls', 'Discarded Devices & Sub-assemblies'];

  const handleOpenBuyModal = (comp: ElectronicComponent) => {
    setBuyingComponent(comp);
    setBuyQuantity(1);
  };

  const handleExecuteBuy = () => {
    if (!buyingComponent) return;
    onBuyComponent(buyingComponent.id, buyQuantity, buyerName);
    setBuyingComponent(null);
  };

  const handleOpenRentModal = (comp: ElectronicComponent) => {
    setRentingComponent(comp);
    setRentQuantity(1);
    setRentalDays(7);
  };

  const handleExecuteRent = () => {
    if (!rentingComponent) return;
    onRentComponent(rentingComponent.id, rentQuantity, rentalDays, renterName, rentalProjectName);
    setRentingComponent(null);
  };

  const handleOpenEditListingModal = (comp: ElectronicComponent) => {
    setEditingListingComp(comp);
    setEditListingType(comp.listingType || 'sale_or_rent');
    setEditPrice(comp.pricePerUnit || 5.0);
    setEditRentRate(comp.rentalRatePerDay || 1.0);
    setEditDeposit(comp.rentalDeposit || 10.0);
  };

  const handleSaveListing = () => {
    if (!editingListingComp) return;
    onUpdateComponentListing(editingListingComp.id, editListingType, editPrice, editRentRate, editDeposit);
    setEditingListingComp(null);
  };

  return (
    <div className="space-y-8">
      {/* Top Banner & Mode Switcher */}
      <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-gradient-to-r from-slate-900 via-slate-900/90 to-slate-950 p-6 sm:p-8">
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="flex items-center gap-2 text-xs font-mono font-semibold tracking-wider text-emerald-400 uppercase">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Industrial Hardware Circular Exchange</span>
          </div>

          <h1 className="font-['Syne',sans-serif] text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            Component Marketplace: Buy, Sell &amp; Rent Salvage Hardware
          </h1>

          <p className="text-sm text-slate-300 leading-relaxed max-w-2xl">
            Save up to 85% compared to commercial retail components. <strong>Buy</strong> desoldered certified parts, <strong>rent</strong> high-demand test boards &amp; sensors for college capstones, or <strong>sell</strong> your facility&apos;s decommissioned e-waste stock.
          </p>

          {/* Mode Tabs */}
          <div className="flex flex-wrap items-center gap-2 pt-4">
            <button
              onClick={() => setActiveMode('buy')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all focus:outline-none ${
                activeMode === 'buy'
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/25 ring-2 ring-emerald-400/30'
                  : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-700'
              }`}
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Browse to Buy ({buyableComponents.length})</span>
            </button>

            <button
              onClick={() => setActiveMode('rent')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all focus:outline-none ${
                activeMode === 'rent'
                  ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-600/25 ring-2 ring-cyan-400/30'
                  : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-700'
              }`}
            >
              <Clock className="w-4 h-4" />
              <span>Rent for Projects ({rentableComponents.length})</span>
            </button>

            <button
              onClick={() => setActiveMode('seller')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all focus:outline-none ${
                activeMode === 'seller'
                  ? 'bg-amber-600 text-white shadow-lg shadow-amber-600/25 ring-2 ring-amber-400/30'
                  : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-700'
              }`}
            >
              <Briefcase className="w-4 h-4" />
              <span>Seller Portal &amp; Listings ({components.length})</span>
            </button>
          </div>
        </div>

        {/* Ambient background glow */}
        <div className="pointer-events-none absolute -right-10 -bottom-10 h-72 w-72 rounded-full bg-emerald-500/10 blur-3xl" />
      </div>

      {/* Summary KPI Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/60 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider block">
              Available to Buy
            </span>
            <span className="text-2xl font-bold font-mono text-emerald-400 mt-1 block">
              {buyableComponents.length} SKUs
            </span>
          </div>
          <div className="p-2.5 rounded-lg bg-emerald-500/10 text-emerald-400">
            <ShoppingBag className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/60 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider block">
              Rentable Hardware
            </span>
            <span className="text-2xl font-bold font-mono text-cyan-400 mt-1 block">
              {rentableComponents.length} Models
            </span>
          </div>
          <div className="p-2.5 rounded-lg bg-cyan-500/10 text-cyan-400">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/60 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider block">
              Active Rentals
            </span>
            <span className="text-2xl font-bold font-mono text-amber-400 mt-1 block">
              {activeRentals.length} Deployed
            </span>
          </div>
          <div className="p-2.5 rounded-lg bg-amber-500/10 text-amber-400">
            <RotateCcw className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/60 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider block">
              Circular Value
            </span>
            <span className="text-2xl font-bold font-mono text-white mt-1 block">
              ${totalMarketplaceValue.toFixed(2)}
            </span>
          </div>
          <div className="p-2.5 rounded-lg bg-slate-800 text-slate-300">
            <TrendingUp className="w-5 h-5 text-emerald-400" />
          </div>
        </div>
      </div>

      {/* Mode 1: BUY VIEW */}
      {activeMode === 'buy' && (
        <div className="space-y-6">
          {/* Controls: Search & Category */}
          <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search components to buy..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
              {categories.slice(0, 5).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors ${
                    selectedCategory === cat
                      ? 'bg-emerald-600 text-white font-semibold'
                      : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Component Buy Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {buyableComponents.map((comp) => {
              const price = comp.pricePerUnit || 1.0;
              return (
                <div
                  key={comp.id}
                  className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 flex flex-col justify-between hover:border-emerald-500/50 hover:bg-slate-900 transition-all shadow-md"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                        {comp.category}
                      </span>
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
                        {comp.condition}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-base font-bold text-white tracking-tight">
                        {comp.name}
                      </h3>
                      <p className="text-xs text-slate-400 line-clamp-2 mt-1">
                        {comp.notes || comp.pinoutOrSpecs || 'Verified tested salvage component.'}
                      </p>
                    </div>

                    {/* Seller details */}
                    <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80 text-xs space-y-1">
                      <div className="flex items-center justify-between text-slate-300">
                        <span className="font-medium flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-emerald-400" />
                          {comp.sellerName || comp.industrialSource}
                        </span>
                        <span className="flex items-center gap-1 text-amber-400 font-mono text-[11px]">
                          <Star className="w-3 h-3 fill-amber-400" />
                          {comp.sellerRating || 4.9}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-500 flex items-center justify-between">
                        <span>{comp.sellerLocation || 'Verified Industrial Partner'}</span>
                        <span className="font-mono text-emerald-400 font-semibold">{comp.quantity} in stock</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-800/80 mt-4 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] uppercase font-mono text-slate-500 block">Purchase Price</span>
                      <span className="text-xl font-extrabold font-mono text-emerald-400">
                        ${price.toFixed(2)}
                        <span className="text-xs text-slate-400 font-normal"> / {comp.unit}</span>
                      </span>
                    </div>

                    <button
                      onClick={() => handleOpenBuyModal(comp)}
                      disabled={comp.quantity <= 0}
                      className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                        comp.quantity > 0
                          ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-600/20'
                          : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                      }`}
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>{comp.quantity > 0 ? 'Buy Now' : 'Out of Stock'}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {buyableComponents.length === 0 && (
            <div className="p-8 text-center rounded-2xl border border-slate-800 bg-slate-900/40 space-y-3">
              <ShoppingBag className="w-10 h-10 text-slate-500 mx-auto" />
              <h4 className="text-sm font-bold text-white">No Components Found</h4>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                No components match your search criteria. Try a different query or switch to the Seller Portal to list your own parts.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Mode 2: RENT VIEW (Lab / College Hardware Lending) */}
      {activeMode === 'rent' && (
        <div className="space-y-6">
          {/* Banner: Why Rent? */}
          <div className="p-4 rounded-xl border border-cyan-500/30 bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 shrink-0">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">
                  College &amp; Prototyping Hardware Lending Pool
                </h4>
                <p className="text-xs text-slate-400 mt-0.5">
                  Need an Arduino, ultrasonic sensor, or test phone for a 2-week semester project? Rent it for pennies a day without permanently taking parts from the circular e-waste stream!
                </p>
              </div>
            </div>

            <div className="text-xs font-mono text-cyan-300 bg-cyan-500/10 px-3 py-1.5 rounded-lg border border-cyan-500/20 whitespace-nowrap">
              100% Refundable Security Deposit
            </div>
          </div>

          {/* Rentable Components Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {rentableComponents.map((comp) => {
              const dailyRate = comp.rentalRatePerDay || 1.0;
              const deposit = comp.rentalDeposit || (dailyRate * 10);
              return (
                <div
                  key={comp.id}
                  className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 flex flex-col justify-between hover:border-cyan-500/50 hover:bg-slate-900 transition-all shadow-md"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                        {comp.category}
                      </span>
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
                        {comp.condition}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-base font-bold text-white tracking-tight">
                        {comp.name}
                      </h3>
                      <p className="text-xs text-slate-400 line-clamp-2 mt-1">
                        {comp.notes || 'Ideal for breadboard prototyping and temporary lab experiments.'}
                      </p>
                    </div>

                    {/* Rental specs badge */}
                    <div className="grid grid-cols-2 gap-2 p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 text-xs font-mono">
                      <div>
                        <span className="text-[10px] text-slate-500 block">Weekly Discount</span>
                        <span className="text-slate-200 font-semibold">${(dailyRate * 5.5).toFixed(2)} / wk</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-500 block">Deposit Required</span>
                        <span className="text-cyan-300 font-semibold">${deposit.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-800/80 mt-4 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] uppercase font-mono text-slate-500 block">Daily Rental</span>
                      <span className="text-xl font-extrabold font-mono text-cyan-400">
                        ${dailyRate.toFixed(2)}
                        <span className="text-xs text-slate-400 font-normal"> / day</span>
                      </span>
                    </div>

                    <button
                      onClick={() => handleOpenRentModal(comp)}
                      disabled={comp.quantity <= 0}
                      className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                        comp.quantity > 0
                          ? 'bg-cyan-600 hover:bg-cyan-500 text-white shadow-md shadow-cyan-600/20'
                          : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                      }`}
                    >
                      <Clock className="w-3.5 h-3.5" />
                      <span>{comp.quantity > 0 ? 'Rent for Project' : 'Unavailable'}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {rentableComponents.length === 0 && (
            <div className="p-8 text-center rounded-2xl border border-slate-800 bg-slate-900/40 space-y-3">
              <Clock className="w-10 h-10 text-slate-500 mx-auto" />
              <h4 className="text-sm font-bold text-white">No Rentable Hardware Listed</h4>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                No components are currently offered for rental. Open the Seller Portal to toggle components to &ldquo;Rent&rdquo;.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Mode 3: SELLER PORTAL & LISTINGS */}
      {activeMode === 'seller' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div>
              <h2 className="text-lg font-bold text-white">Seller Management &amp; Listings Control</h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Set prices, activate rentals for idle hardware, and track active borrowers and completed sales revenue.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={onOpenAddModal}
                className="px-3.5 py-2 text-xs font-bold rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white flex items-center gap-1.5 shadow-md shadow-emerald-600/20"
              >
                <Plus className="w-4 h-4" />
                <span>Add &amp; List Component</span>
              </button>
            </div>
          </div>

          {/* Active Rentals Tracker */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
                <h3 className="text-sm font-bold text-white">
                  Active Rentals Tracker ({activeRentals.length})
                </h3>
              </div>
              <span className="text-xs text-slate-400 font-mono">
                Hardware currently borrowed by labs or students
              </span>
            </div>

            {activeRentals.length > 0 ? (
              <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-950/60">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-950 text-[11px] font-semibold text-slate-400 uppercase border-b border-slate-800">
                    <tr>
                      <th className="py-3 px-4">Component</th>
                      <th className="py-3 px-4">Borrower</th>
                      <th className="py-3 px-4">Duration</th>
                      <th className="py-3 px-4 text-right">Rate &amp; Deposit</th>
                      <th className="py-3 px-4">Est. Return</th>
                      <th className="py-3 px-4 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/80 font-mono">
                    {activeRentals.map((r) => (
                      <tr key={r.id} className="hover:bg-slate-900/60">
                        <td className="py-3 px-4 font-sans text-slate-200 font-semibold">
                          {r.componentName}
                        </td>
                        <td className="py-3 px-4 font-sans text-slate-300">
                          {r.buyerName}
                        </td>
                        <td className="py-3 px-4 text-slate-400">
                          {r.rentalDays} Days
                        </td>
                        <td className="py-3 px-4 text-right text-cyan-400 font-bold">
                          ${r.unitPrice}/day (${r.depositAmount} dep)
                        </td>
                        <td className="py-3 px-4 text-amber-300">
                          {r.returnDateEstimated || 'Pending Return'}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <button
                            onClick={() => onReturnRental(r.id)}
                            className="px-2.5 py-1 text-[11px] font-bold rounded-lg bg-cyan-600/20 text-cyan-300 border border-cyan-500/40 hover:bg-cyan-600/30 transition-colors"
                          >
                            Mark Returned
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-xs text-slate-500 italic py-2">
                No active rentals at the moment. All rentable hardware is in stock.
              </p>
            )}
          </div>

          {/* All Listings Table */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 space-y-4">
            <h3 className="text-sm font-bold text-white">Your Inventory Monetization &amp; Pricing Controls</h3>
            <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-950/60">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950 text-[11px] font-semibold text-slate-400 uppercase border-b border-slate-800">
                  <tr>
                    <th className="py-3 px-4">Component</th>
                    <th className="py-3 px-4">Stock</th>
                    <th className="py-3 px-4">Listing Mode</th>
                    <th className="py-3 px-4 text-right">Buy Price</th>
                    <th className="py-3 px-4 text-right">Rent Rate / Day</th>
                    <th className="py-3 px-4 text-center">Edit Listing</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80 font-mono">
                  {components.map((c) => (
                    <tr key={c.id} className="hover:bg-slate-900/60">
                      <td className="py-3 px-4 font-sans text-slate-200 font-medium">
                        {c.name}
                      </td>
                      <td className="py-3 px-4 text-slate-300">
                        {c.quantity} {c.unit}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded-full font-sans font-semibold ${
                            c.listingType === 'sale'
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                              : c.listingType === 'rent'
                              ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30'
                              : c.listingType === 'sale_or_rent'
                              ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                              : 'bg-slate-800 text-slate-400'
                          }`}
                        >
                          {c.listingType === 'sale' ? 'For Sale' : c.listingType === 'rent' ? 'For Rent' : c.listingType === 'sale_or_rent' ? 'Sale & Rent' : 'Internal Only'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right text-emerald-400 font-bold">
                        {c.pricePerUnit ? `$${c.pricePerUnit.toFixed(2)}` : '—'}
                      </td>
                      <td className="py-3 px-4 text-right text-cyan-400 font-bold">
                        {c.rentalRatePerDay ? `$${c.rentalRatePerDay.toFixed(2)}` : '—'}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <button
                          onClick={() => handleOpenEditListingModal(c)}
                          className="px-2.5 py-1 text-[11px] font-bold rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
                        >
                          Configure
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Transaction Ledger */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Receipt className="w-4 h-4 text-emerald-400" />
                <span>Marketplace Transaction Ledger</span>
              </h3>
              <span className="text-xs font-mono text-emerald-400 font-semibold">
                Total Volume: ${totalRevenueEarned.toFixed(2)}
              </span>
            </div>

            <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-950/60">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950 text-[11px] font-semibold text-slate-400 uppercase border-b border-slate-800">
                  <tr>
                    <th className="py-3 px-4">Date</th>
                    <th className="py-3 px-4">Type</th>
                    <th className="py-3 px-4">Component</th>
                    <th className="py-3 px-4">Buyer/Renter</th>
                    <th className="py-3 px-4 text-right">Amount</th>
                    <th className="py-3 px-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80 font-mono">
                  {transactions.map((tx) => (
                    <tr key={tx.id} className="hover:bg-slate-900/60">
                      <td className="py-3 px-4 text-slate-400">{tx.date}</td>
                      <td className="py-3 px-4 uppercase text-[10px] font-bold">
                        <span className={tx.type === 'buy' ? 'text-emerald-400' : 'text-cyan-400'}>
                          {tx.type}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-sans text-slate-200 font-medium">
                        {tx.componentName} (x{tx.quantity})
                      </td>
                      <td className="py-3 px-4 font-sans text-slate-300">{tx.buyerName}</td>
                      <td className="py-3 px-4 text-right font-bold text-white">
                        ${tx.totalAmount.toFixed(2)}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                            tx.status === 'completed'
                              ? 'bg-emerald-500/10 text-emerald-400'
                              : tx.status === 'active_rental'
                              ? 'bg-amber-500/10 text-amber-400'
                              : 'bg-slate-800 text-slate-400'
                          }`}
                        >
                          {tx.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 1: BUY CHECKOUT MODAL */}
      {buyingComponent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-start justify-between border-b border-slate-800 pb-4">
              <div>
                <span className="text-[10px] font-mono text-emerald-400 uppercase font-bold tracking-wider">
                  Checkout &amp; Component Transfer
                </span>
                <h3 className="text-lg font-bold text-white mt-0.5">
                  Buy {buyingComponent.name}
                </h3>
              </div>
              <button
                onClick={() => setBuyingComponent(null)}
                className="text-slate-400 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs font-sans">
              <div>
                <label className="text-slate-300 font-medium block mb-1">
                  Quantity to Buy (Max {buyingComponent.quantity} {buyingComponent.unit})
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min="1"
                    max={buyingComponent.quantity}
                    value={buyQuantity}
                    onChange={(e) => setBuyQuantity(Number(e.target.value))}
                    className="flex-1 accent-emerald-500"
                  />
                  <span className="font-mono text-sm font-bold text-emerald-400 w-12 text-right">
                    {buyQuantity} {buyingComponent.unit}
                  </span>
                </div>
              </div>

              <div>
                <label className="text-slate-300 font-medium block mb-1">
                  Buyer Name / Project Organization
                </label>
                <input
                  type="text"
                  value={buyerName}
                  onChange={(e) => setBuyerName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-slate-300 font-medium block mb-1">
                  Transfer / Delivery Method
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setPickupMethod('facility')}
                    className={`p-2.5 rounded-xl border text-left flex items-center gap-2 transition-all ${
                      pickupMethod === 'facility'
                        ? 'border-emerald-500 bg-emerald-500/10 text-emerald-300'
                        : 'border-slate-800 bg-slate-950 text-slate-400'
                    }`}
                  >
                    <Truck className="w-4 h-4" />
                    <div>
                      <span className="font-bold block text-xs">Plant Pickup</span>
                      <span className="text-[10px] text-slate-400">Free · Bay Dock</span>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPickupMethod('courier')}
                    className={`p-2.5 rounded-xl border text-left flex items-center gap-2 transition-all ${
                      pickupMethod === 'courier'
                        ? 'border-emerald-500 bg-emerald-500/10 text-emerald-300'
                        : 'border-slate-800 bg-slate-950 text-slate-400'
                    }`}
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <div>
                      <span className="font-bold block text-xs">Eco Dispatch</span>
                      <span className="text-[10px] text-slate-400">+$2.00 Shipping</span>
                    </div>
                  </button>
                </div>
              </div>

              {/* Price Calculation breakdown */}
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/80 space-y-1.5 font-mono text-xs">
                <div className="flex justify-between text-slate-400">
                  <span>Unit Price:</span>
                  <span>${(buyingComponent.pricePerUnit || 1.0).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Subtotal ({buyQuantity} pcs):</span>
                  <span>${((buyingComponent.pricePerUnit || 1.0) * buyQuantity).toFixed(2)}</span>
                </div>
                {pickupMethod === 'courier' && (
                  <div className="flex justify-between text-slate-400">
                    <span>Shipping:</span>
                    <span>$2.00</span>
                  </div>
                )}
                <div className="flex justify-between text-emerald-400 font-bold pt-2 border-t border-slate-800">
                  <span>Total Due:</span>
                  <span>
                    ${(((buyingComponent.pricePerUnit || 1.0) * buyQuantity) + (pickupMethod === 'courier' ? 2 : 0)).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setBuyingComponent(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleExecuteBuy}
                className="px-5 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-600/20"
              >
                Confirm Purchase &amp; Claim Parts
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: RENT BOOKING MODAL */}
      {rentingComponent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-start justify-between border-b border-slate-800 pb-4">
              <div>
                <span className="text-[10px] font-mono text-cyan-400 uppercase font-bold tracking-wider">
                  Hardware Lending Agreement
                </span>
                <h3 className="text-lg font-bold text-white mt-0.5">
                  Rent {rentingComponent.name}
                </h3>
              </div>
              <button
                onClick={() => setRentingComponent(null)}
                className="text-slate-400 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs font-sans">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-slate-300 font-medium">
                    Rental Duration (Days)
                  </label>
                  <span className="font-mono text-cyan-400 font-bold">{rentalDays} Days</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="30"
                  value={rentalDays}
                  onChange={(e) => setRentalDays(Number(e.target.value))}
                  className="w-full accent-cyan-500"
                />
                <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-1">
                  <span>1 day</span>
                  <span>1 week</span>
                  <span>2 weeks</span>
                  <span>1 month (30d)</span>
                </div>
              </div>

              <div>
                <label className="text-slate-300 font-medium block mb-1">
                  Borrower / Student Team Name
                </label>
                <input
                  type="text"
                  value={renterName}
                  onChange={(e) => setRenterName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="text-slate-300 font-medium block mb-1">
                  Assigned Reuse Project
                </label>
                <input
                  type="text"
                  value={rentalProjectName}
                  onChange={(e) => setRentalProjectName(e.target.value)}
                  placeholder="e.g. Smart Plant IoT Monitor"
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-cyan-500"
                />
              </div>

              {/* Rental Cost & Deposit Breakdown */}
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/80 space-y-1.5 font-mono text-xs">
                <div className="flex justify-between text-slate-400">
                  <span>Daily Rate:</span>
                  <span>${(rentingComponent.rentalRatePerDay || 1.0).toFixed(2)} / day</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Usage Fee ({rentalDays} days):</span>
                  <span>${((rentingComponent.rentalRatePerDay || 1.0) * rentalDays).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-cyan-300">
                  <span>Refundable Security Deposit:</span>
                  <span>${(rentingComponent.rentalDeposit || 10.0).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-white font-bold pt-2 border-t border-slate-800">
                  <span>Total Deposit + Fee:</span>
                  <span>
                    ${(((rentingComponent.rentalRatePerDay || 1.0) * rentalDays) + (rentingComponent.rentalDeposit || 10.0)).toFixed(2)}
                  </span>
                </div>
              </div>

              <p className="text-[11px] text-slate-400 bg-slate-950/70 p-2.5 rounded-xl border border-slate-800">
                💡 <strong>Deposit Guarantee:</strong> The security deposit (${(rentingComponent.rentalDeposit || 10.0).toFixed(2)}) is 100% credited back when the item is returned to the lab after project demonstration.
              </p>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setRentingComponent(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleExecuteRent}
                className="px-5 py-2 rounded-xl text-xs font-bold bg-cyan-600 hover:bg-cyan-500 text-white shadow-md shadow-cyan-600/20"
              >
                Confirm Rental Booking
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: CONFIGURE LISTING MODAL */}
      {editingListingComp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-start justify-between border-b border-slate-800 pb-4">
              <div>
                <span className="text-[10px] font-mono text-amber-400 uppercase font-bold tracking-wider">
                  Listing Configuration
                </span>
                <h3 className="text-lg font-bold text-white mt-0.5">
                  Configure {editingListingComp.name}
                </h3>
              </div>
              <button
                onClick={() => setEditingListingComp(null)}
                className="text-slate-400 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs font-sans">
              <div>
                <label className="text-slate-300 font-medium block mb-1">
                  Marketplace Status
                </label>
                <select
                  value={editListingType}
                  onChange={(e) => setEditListingType(e.target.value as ListingType)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-amber-500"
                >
                  <option value="internal">Internal Plant Salvage Only (Not Public)</option>
                  <option value="sale">For Sale (Direct Purchase)</option>
                  <option value="rent">For Rent (Temporary Lending)</option>
                  <option value="sale_or_rent">Both (For Sale &amp; For Rent)</option>
                </select>
              </div>

              {(editListingType === 'sale' || editListingType === 'sale_or_rent') && (
                <div>
                  <label className="text-slate-300 font-medium block mb-1">
                    Direct Sale Price ($ USD per unit)
                  </label>
                  <input
                    type="number"
                    step="0.05"
                    min="0.01"
                    value={editPrice}
                    onChange={(e) => setEditPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono text-xs focus:outline-none focus:border-emerald-500"
                  />
                </div>
              )}

              {(editListingType === 'rent' || editListingType === 'sale_or_rent') && (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-slate-300 font-medium block mb-1">
                      Daily Rent ($/day)
                    </label>
                    <input
                      type="number"
                      step="0.10"
                      min="0.10"
                      value={editRentRate}
                      onChange={(e) => setEditRentRate(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono text-xs focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                  <div>
                    <label className="text-slate-300 font-medium block mb-1">
                      Security Deposit ($)
                    </label>
                    <input
                      type="number"
                      step="1"
                      min="1"
                      value={editDeposit}
                      onChange={(e) => setEditDeposit(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono text-xs focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setEditingListingComp(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveListing}
                className="px-5 py-2 rounded-xl text-xs font-bold bg-amber-600 hover:bg-amber-500 text-white shadow-md shadow-amber-600/20"
              >
                Save Listing Settings
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
