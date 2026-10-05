import React, { useState, useMemo } from 'react';
import { ElectronicComponent, ComponentCategory, ComponentCondition } from '../types';
import { calculateTotalInventoryMassKg } from '../utils/calculator';
import {
  Search,
  Plus,
  Trash2,
  Edit2,
  Cpu,
  Layers,
  Sparkles,
  SlidersHorizontal,
  RotateCcw,
  CheckCircle,
  HelpCircle,
  Wrench
} from 'lucide-react';

interface AvailableComponentsViewProps {
  components: ElectronicComponent[];
  onOpenAddModal: () => void;
  onEditComponent: (component: ElectronicComponent) => void;
  onDeleteComponent: (id: string) => void;
  onUpdateQuantity: (id: string, newQty: number) => void;
  onResetToSampleData: () => void;
  onNavigateToProjects: () => void;
}

export const AvailableComponentsView: React.FC<AvailableComponentsViewProps> = ({
  components,
  onOpenAddModal,
  onEditComponent,
  onDeleteComponent,
  onUpdateQuantity,
  onResetToSampleData,
  onNavigateToProjects
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedCondition, setSelectedCondition] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');

  const categories = useMemo(() => {
    const cats = new Set<string>();
    components.forEach((c) => cats.add(c.category));
    return Array.from(cats);
  }, [components]);

  const filteredComponents = useMemo(() => {
    return components.filter((item) => {
      const matchesSearch =
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.industrialSource.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.notes && item.notes.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesCat = selectedCategory === 'all' || item.category === selectedCategory;
      const matchesCond = selectedCondition === 'all' || item.condition === selectedCondition;

      return matchesSearch && matchesCat && matchesCond;
    });
  }, [components, searchTerm, selectedCategory, selectedCondition]);

  const totalMassKg = useMemo(() => calculateTotalInventoryMassKg(components), [components]);
  const totalUnits = useMemo(() => components.reduce((sum, c) => sum + c.quantity, 0), [components]);

  const getConditionBadge = (condition: ComponentCondition) => {
    switch (condition) {
      case 'Tested & Working':
        return (
          <span className="inline-flex items-center gap-1 text-xs text-emerald-400 font-medium">
            <CheckCircle className="w-3.5 h-3.5" />
            Tested & Functional
          </span>
        );
      case 'Functional / Untested':
        return (
          <span className="inline-flex items-center gap-1 text-xs text-amber-400 font-medium">
            <HelpCircle className="w-3.5 h-3.5" />
            Untested / Intact
          </span>
        );
      case 'Needs Desoldering / Minor Repair':
        return (
          <span className="inline-flex items-center gap-1 text-xs text-slate-400 font-medium">
            <Wrench className="w-3.5 h-3.5" />
            Needs Desolder
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Metrics Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
            <Cpu className="w-6 h-6 text-emerald-400" />
            <span>Available Electronic Components</span>
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Reclaimed components saved from industrial e-waste streams ready for reuse in educational & engineering projects.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={onOpenAddModal}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Component</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl">
          <span className="text-xs uppercase tracking-wider text-slate-400 font-medium block">
            Unique Components (SKUs)
          </span>
          <span className="font-mono text-2xl font-bold text-white tabular-nums mt-1 block">
            {components.length}
          </span>
          <span className="text-[11px] text-slate-500 mt-0.5 block">Categorized & inspected</span>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl">
          <span className="text-xs uppercase tracking-wider text-slate-400 font-medium block">
            Total Reclaimable Units
          </span>
          <span className="font-mono text-2xl font-bold text-emerald-400 tabular-nums mt-1 block">
            {totalUnits}
          </span>
          <span className="text-[11px] text-slate-500 mt-0.5 block">Ready for projects</span>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl">
          <span className="text-xs uppercase tracking-wider text-slate-400 font-medium block">
            Total Salvaged Mass
          </span>
          <span className="font-mono text-2xl font-bold text-white tabular-nums mt-1 block">
            {totalMassKg} kg
          </span>
          <span className="text-[11px] text-emerald-500 mt-0.5 block">Diverted from toxic scrap</span>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl flex flex-col justify-between">
          <div>
            <span className="text-xs uppercase tracking-wider text-slate-400 font-medium block">
              Quick Action
            </span>
            <button
              onClick={onNavigateToProjects}
              className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 transition-colors mt-2 flex items-center gap-1"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Match to Reuse Projects &rarr;</span>
            </button>
          </div>
          <button
            onClick={onResetToSampleData}
            className="text-[11px] text-slate-500 hover:text-slate-300 transition-colors flex items-center gap-1 mt-2"
            title="Reload default industrial samples"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset Demo Samples</span>
          </button>
        </div>
      </div>

      {/* Search & Filter Controls */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-slate-900/60 border border-slate-800 p-3 rounded-xl">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by component name, specs, or facility origin..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-950 border border-slate-800 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-lg text-slate-300 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          >
            <option value="all">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          <select
            value={selectedCondition}
            onChange={(e) => setSelectedCondition(e.target.value)}
            className="px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-lg text-slate-300 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          >
            <option value="all">All Conditions</option>
            <option value="Tested & Working">Tested & Working</option>
            <option value="Functional / Untested">Untested</option>
            <option value="Needs Desoldering / Minor Repair">Needs Desoldering</option>
          </select>

          <div className="flex items-center border border-slate-800 rounded-lg p-0.5 bg-slate-950 shrink-0">
            <button
              onClick={() => setViewMode('cards')}
              className={`p-1.5 rounded text-xs transition-colors ${viewMode === 'cards' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'}`}
              title="Card View"
            >
              <Layers className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded text-xs transition-colors ${viewMode === 'table' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'}`}
              title="Table View"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Empty State */}
      {filteredComponents.length === 0 ? (
        <div className="p-12 text-center rounded-2xl border border-dashed border-slate-800 bg-slate-900/30">
          <Cpu className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-white">No components found</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto mt-1 mb-5">
            {searchTerm || selectedCategory !== 'all' || selectedCondition !== 'all'
              ? 'No salvage items matched your search filter criteria. Try clearing filters.'
              : 'Your electronic component inventory is currently empty. Register discarded parts from your workshop or load industrial samples.'}
          </p>
          <div className="flex items-center justify-center gap-3">
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('all');
                setSelectedCondition('all');
              }}
              className="px-3.5 py-2 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 rounded-lg transition-colors"
            >
              Clear Filters
            </button>
            <button
              onClick={onResetToSampleData}
              className="px-3.5 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg transition-colors"
            >
              Load Demo Components
            </button>
          </div>
        </div>
      ) : viewMode === 'cards' ? (
        /* Cards View with 3D tilt hover and real photo preview */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredComponents.map((item) => {
            const batchWeightGrams = item.quantity * item.unitWeightGrams;
            return (
              <div
                key={item.id}
                className="group relative flex flex-col justify-between rounded-xl border border-slate-800 bg-slate-900/70 hover:border-slate-700 hover:bg-slate-900 transition-all p-5 shadow-sm hover:shadow-md"
              >
                <div>
                  {/* Visual slot: image or technical fallback */}
                  <div className="relative w-full h-36 rounded-lg overflow-hidden bg-slate-950 mb-3 border border-slate-800/80">
                    {item.imageUrl ? (
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-slate-600 bg-slate-950/90 p-4">
                        <Cpu className="w-8 h-8 text-emerald-500/40 mb-1" />
                        <span className="text-[11px] font-mono text-slate-500 text-center">
                          {item.category}
                        </span>
                      </div>
                    )}
                    <div className="absolute top-2 right-2 bg-slate-950/85 backdrop-blur-md px-2 py-0.5 rounded text-[11px] font-mono text-emerald-400 border border-slate-800">
                      {item.quantity} {item.unit} in stock
                    </div>
                  </div>

                  {/* Metadata and Title */}
                  <div className="text-xs text-slate-400 mb-1 flex items-center gap-1.5 flex-wrap">
                    <span className="text-slate-300">{item.category}</span>
                    <span>·</span>
                    <span>{item.dateAdded}</span>
                  </div>

                  <h3 className="text-base font-bold text-white tracking-tight group-hover:text-emerald-300 transition-colors">
                    {item.name}
                  </h3>

                  <div className="mt-2 text-xs">
                    {getConditionBadge(item.condition)}
                  </div>

                  <p className="mt-2 text-xs text-slate-400 line-clamp-2">
                    {item.notes || item.pinoutOrSpecs || 'No additional technical specifications.'}
                  </p>

                  <div className="mt-3 pt-3 border-t border-slate-800/80 text-[11px] font-mono text-slate-400 space-y-1">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Unit Mass:</span>
                      <span className="text-slate-300 tabular-nums">{item.unitWeightGrams}g</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Total Salvage:</span>
                      <span className="text-emerald-400 font-semibold tabular-nums">
                        {batchWeightGrams.toFixed(1)}g ({(batchWeightGrams / 1000).toFixed(3)} kg)
                      </span>
                    </div>
                    <div className="flex justify-between truncate" title={item.industrialSource}>
                      <span className="text-slate-500">Origin:</span>
                      <span className="text-slate-300 truncate max-w-[150px]">{item.industrialSource}</span>
                    </div>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between">
                  {/* Quick stock +/- */}
                  <div className="flex items-center gap-1 bg-slate-950 border border-slate-800 rounded-lg p-0.5">
                    <button
                      onClick={() => onUpdateQuantity(item.id, Math.max(0, item.quantity - 1))}
                      className="w-6 h-6 flex items-center justify-center text-xs font-mono text-slate-400 hover:text-white rounded hover:bg-slate-800"
                      title="Decrease quantity by 1"
                    >
                      -
                    </button>
                    <span className="px-1.5 font-mono text-xs font-semibold tabular-nums text-white">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                      className="w-6 h-6 flex items-center justify-center text-xs font-mono text-slate-400 hover:text-white rounded hover:bg-slate-800"
                      title="Increase quantity by 1"
                    >
                      +
                    </button>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => onEditComponent(item)}
                      className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                      title="Edit component details"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onDeleteComponent(item.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-colors"
                      title="Delete component from inventory"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* High-density Table View */
        <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-900/60">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/80 border-b border-slate-800 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Component</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Condition</th>
                <th className="py-3 px-4 text-right">Available Qty</th>
                <th className="py-3 px-4 text-right">Unit Wt.</th>
                <th className="py-3 px-4 text-right">Total Wt.</th>
                <th className="py-3 px-4">Facility Origin</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 font-mono">
              {filteredComponents.map((item) => {
                const totalGrams = (item.quantity * item.unitWeightGrams).toFixed(1);
                return (
                  <tr key={item.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-4 font-sans font-medium text-white">
                      {item.name}
                    </td>
                    <td className="py-3 px-4 font-sans text-slate-400">{item.category}</td>
                    <td className="py-3 px-4 font-sans">{getConditionBadge(item.condition)}</td>
                    <td className="py-3 px-4 text-right text-emerald-400 font-bold tabular-nums">
                      {item.quantity} {item.unit}
                    </td>
                    <td className="py-3 px-4 text-right text-slate-300 tabular-nums">
                      {item.unitWeightGrams}g
                    </td>
                    <td className="py-3 px-4 text-right text-white font-semibold tabular-nums">
                      {totalGrams}g
                    </td>
                    <td className="py-3 px-4 font-sans text-slate-400 truncate max-w-[140px]" title={item.industrialSource}>
                      {item.industrialSource}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => onEditComponent(item)}
                          className="p-1 text-slate-400 hover:text-white rounded hover:bg-slate-800"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onDeleteComponent(item.id)}
                          className="p-1 text-slate-400 hover:text-rose-400 rounded hover:bg-slate-800"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
