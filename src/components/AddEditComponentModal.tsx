import React, { useState, useEffect } from 'react';
import { ElectronicComponent, ComponentCategory, ComponentCondition } from '../types';
import { X, Check, Sparkles, Scale, AlertCircle } from 'lucide-react';

interface AddEditComponentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (component: Omit<ElectronicComponent, 'id' | 'dateAdded'>, editId?: string) => void;
  initialData?: ElectronicComponent | null;
}

const CATEGORIES: ComponentCategory[] = [
  'Microcontrollers & ICs',
  'Passive Components',
  'Actuators & Motors',
  'Sensors',
  'Power & Cables',
  'Switches & Controls',
  'Discarded Devices & Sub-assemblies'
];

const CONDITIONS: ComponentCondition[] = [
  'Tested & Working',
  'Functional / Untested',
  'Needs Desoldering / Minor Repair'
];

const PRESETS = [
  { name: '5mm High-Intensity Red/Green LEDs', category: 'Passive Components', weight: 0.5, unit: 'pcs' },
  { name: '220Ω / 1kΩ Carbon Film Resistors', category: 'Passive Components', weight: 0.25, unit: 'pcs' },
  { name: 'Arduino Uno Rev3 Compatible Board', category: 'Microcontrollers & ICs', weight: 28, unit: 'pcs' },
  { name: 'DC Toy / Geared Motor 3V-6V', category: 'Actuators & Motors', weight: 32, unit: 'pcs' },
  { name: '40-pin Jumper Wires Assorted M-M', category: 'Power & Cables', weight: 1.2, unit: 'pcs' },
  { name: 'SPST Rocker & Tactile Switches', category: 'Switches & Controls', weight: 3.5, unit: 'pcs' },
  { name: 'HC-SR04 Ultrasonic Distance Sensor', category: 'Sensors', weight: 9.0, unit: 'pcs' },
  { name: 'Analog Soil Moisture Sensor Module', category: 'Sensors', weight: 8.0, unit: 'pcs' },
  { name: 'Salvaged Android Smartphone', category: 'Discarded Devices & Sub-assemblies', weight: 155, unit: 'pcs' },
  { name: 'Type-A to Micro USB Cables 1m', category: 'Power & Cables', weight: 24, unit: 'pcs' },
  { name: '4xAA / 9V Battery Holder Pack', category: 'Power & Cables', weight: 16, unit: 'pcs' }
];

export const AddEditComponentModal: React.FC<AddEditComponentModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData
}) => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState<ComponentCategory>('Passive Components');
  const [quantity, setQuantity] = useState<number>(10);
  const [unit, setUnit] = useState('pcs');
  const [unitWeightGrams, setUnitWeightGrams] = useState<number>(1.0);
  const [condition, setCondition] = useState<ComponentCondition>('Tested & Working');
  const [industrialSource, setIndustrialSource] = useState('Factory Production Line Scrap');
  const [pinoutOrSpecs, setPinoutOrSpecs] = useState('');
  const [notes, setNotes] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setCategory(initialData.category);
      setQuantity(initialData.quantity);
      setUnit(initialData.unit);
      setUnitWeightGrams(initialData.unitWeightGrams);
      setCondition(initialData.condition);
      setIndustrialSource(initialData.industrialSource);
      setPinoutOrSpecs(initialData.pinoutOrSpecs || '');
      setNotes(initialData.notes || '');
      setImageUrl(initialData.imageUrl || '');
    } else {
      setName('');
      setCategory('Passive Components');
      setQuantity(10);
      setUnit('pcs');
      setUnitWeightGrams(1.0);
      setCondition('Tested & Working');
      setIndustrialSource('Industrial Workshop Salvage');
      setPinoutOrSpecs('');
      setNotes('');
      setImageUrl('');
    }
    setErrors({});
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleApplyPreset = (preset: typeof PRESETS[0]) => {
    setName(preset.name);
    setCategory(preset.category as ComponentCategory);
    setUnitWeightGrams(preset.weight);
    setUnit(preset.unit);
  };

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!name.trim()) newErrors.name = 'Component name is required';
    if (quantity <= 0) newErrors.quantity = 'Quantity must be at least 1';
    if (unitWeightGrams <= 0) newErrors.unitWeightGrams = 'Unit weight must be greater than 0g';
    if (!industrialSource.trim()) newErrors.industrialSource = 'Industrial source is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    onSave(
      {
        name: name.trim(),
        category,
        quantity: Number(quantity),
        unit: unit.trim() || 'pcs',
        unitWeightGrams: Number(unitWeightGrams),
        condition,
        industrialSource: industrialSource.trim(),
        pinoutOrSpecs: pinoutOrSpecs.trim() || undefined,
        notes: notes.trim() || undefined,
        imageUrl: imageUrl.trim() || undefined
      },
      initialData?.id
    );
    onClose();
  };

  const totalCalculatedGrams = (quantity * unitWeightGrams).toFixed(1);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden my-8">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/60">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Scale className="w-5 h-5 text-emerald-400" />
              <span>{initialData ? 'Edit Component Inventory' : 'Register Salvaged E-Waste Component'}</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Specify component weight and specs to calculate industrial waste diversion and project matches.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Presets Bar */}
        {!initialData && (
          <div className="px-6 py-3 bg-slate-950/30 border-b border-slate-800/80">
            <span className="text-[11px] font-semibold tracking-wider uppercase text-slate-400 flex items-center gap-1.5 mb-2">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>Quick Industrial Presets (Click to autofill)</span>
            </span>
            <div className="flex flex-wrap gap-1.5">
              {PRESETS.slice(0, 6).map((preset) => (
                <button
                  key={preset.name}
                  type="button"
                  onClick={() => handleApplyPreset(preset)}
                  className="text-xs px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700/60 transition-colors"
                >
                  {preset.name.split(' ')[0]} {preset.name.split(' ')[1]}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          {/* Name & Category */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Component Name <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. 5mm High-Intensity Red LEDs"
                className={`w-full px-3 py-2 text-sm bg-slate-950 border rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-1 ${
                  errors.name ? 'border-rose-500 focus:ring-rose-500' : 'border-slate-800 focus:ring-emerald-500'
                }`}
              />
              {errors.name && <p className="text-xs text-rose-400 mt-1">{errors.name}</p>}
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as ComponentCategory)}
                className="w-full px-3 py-2 text-sm bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Quantity, Unit & Unit Weight */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-xl bg-slate-950/60 border border-slate-800/80">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Quantity <span className="text-rose-400">*</span>
              </label>
              <input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-full px-3 py-2 text-sm font-mono bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
              {errors.quantity && <p className="text-xs text-rose-400 mt-1">{errors.quantity}</p>}
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Unit of Measure</label>
              <input
                type="text"
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                placeholder="pcs / pack / meters"
                className="w-full px-3 py-2 text-sm bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Unit Weight (Grams) <span className="text-rose-400">*</span>
              </label>
              <input
                type="number"
                step="0.05"
                min="0.05"
                value={unitWeightGrams}
                onChange={(e) => setUnitWeightGrams(Math.max(0.05, parseFloat(e.target.value) || 0.05))}
                className="w-full px-3 py-2 text-sm font-mono bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
              {errors.unitWeightGrams && <p className="text-xs text-rose-400 mt-1">{errors.unitWeightGrams}</p>}
            </div>

            <div className="sm:col-span-3 pt-2 border-t border-slate-800 text-xs font-mono text-slate-400 flex items-center justify-between">
              <span>Total Batch Salvage Mass:</span>
              <span className="text-emerald-400 font-bold tabular-nums">
                {totalCalculatedGrams} grams ({(Number(totalCalculatedGrams) / 1000).toFixed(3)} kg diverted)
              </span>
            </div>
          </div>

          {/* Condition & Industrial Source */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Tested Condition</label>
              <select
                value={condition}
                onChange={(e) => setCondition(e.target.value as ComponentCondition)}
                className="w-full px-3 py-2 text-sm bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
              >
                {CONDITIONS.map((cond) => (
                  <option key={cond} value={cond}>
                    {cond}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Industrial Source / Facility Department <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                value={industrialSource}
                onChange={(e) => setIndustrialSource(e.target.value)}
                placeholder="e.g. Line 3 PCB Discard, IT Lab Server Upgrades"
                className={`w-full px-3 py-2 text-sm bg-slate-950 border rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-1 ${
                  errors.industrialSource ? 'border-rose-500 focus:ring-rose-500' : 'border-slate-800 focus:ring-emerald-500'
                }`}
              />
              {errors.industrialSource && <p className="text-xs text-rose-400 mt-1">{errors.industrialSource}</p>}
            </div>
          </div>

          {/* Pinout / Specs */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Pinout, Electrical Specs & Tolerances (Optional)
            </label>
            <input
              type="text"
              value={pinoutOrSpecs}
              onChange={(e) => setPinoutOrSpecs(e.target.value)}
              placeholder="e.g. 5V VCC, GND, Echo D10, Trig D9 or 220Ω 1/4W 5% tolerance"
              className="w-full px-3 py-2 text-sm bg-slate-950 border border-slate-800 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Storage Notes & Salvage Details (Optional)
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Tested on multimeter; leads intact; desoldered from power supply chassis."
              className="w-full px-3 py-2 text-sm bg-slate-950 border border-slate-800 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          {/* Image Selection */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Component Photo Preset (Optional)
            </label>
            <select
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
            >
              <option value="">Default Component Icon / Fallback</option>
              <option value="/src/assets/images/electronic_components_tray_1791201399697.jpg">Electronic Components Tray (Resistors, LEDs, Motors)</option>
              <option value="/src/assets/images/arduino_circuit_project_1791201414517.jpg">Arduino & Circuit Breadboard Studio Photo</option>
              <option value="/src/assets/images/solar_smart_monitor_1791201430265.jpg">Smart Sensors & Probes</option>
              <option value="/src/assets/images/ewaste_sorting_hero_1791201380637.jpg">Industrial Discard Bench / Devices</option>
            </select>
          </div>

          {/* Footer Submit */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-5 py-2 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
            >
              <Check className="w-4 h-4" />
              <span>{initialData ? 'Update Inventory Item' : 'Add to Salvage Inventory'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
