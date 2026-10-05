export type ComponentCategory =
  | 'Microcontrollers & ICs'
  | 'Passive Components'
  | 'Actuators & Motors'
  | 'Sensors'
  | 'Power & Cables'
  | 'Switches & Controls'
  | 'Discarded Devices & Sub-assemblies';

export type ComponentCondition = 'Tested & Working' | 'Functional / Untested' | 'Needs Desoldering / Minor Repair';

export type ListingType = 'internal' | 'sale' | 'rent' | 'sale_or_rent';

export interface ElectronicComponent {
  id: string;
  name: string;
  category: ComponentCategory;
  quantity: number;
  unit: string;
  unitWeightGrams: number; // For industrial waste calculation
  condition: ComponentCondition;
  industrialSource: string; // e.g., "Factory Assembly Line 2", "Lab Discard", "IT E-Waste Bin"
  dateAdded: string;
  imageUrl?: string;
  notes?: string;
  pinoutOrSpecs?: string;

  // Marketplace: Buy, Sell & Rent properties
  listingType?: ListingType;
  pricePerUnit?: number;        // Purchase price in USD (for buyers)
  rentalRatePerDay?: number;    // Rental price per day in USD
  rentalDeposit?: number;       // Refundable security deposit in USD
  sellerName?: string;          // Seller / Department / Lab name
  sellerRating?: number;        // e.g. 4.9
  sellerLocation?: string;      // e.g. "Bay 12 - Hardware Test Depot"
}

export interface MarketplaceTransaction {
  id: string;
  componentId: string;
  componentName: string;
  type: 'buy' | 'rent';
  quantity: number;
  unitPrice: number;
  rentalDays?: number;
  depositAmount?: number;
  totalAmount: number;
  buyerName: string;
  sellerName: string;
  date: string;
  status: 'completed' | 'active_rental' | 'returned';
  returnDateEstimated?: string;
}

export interface RequiredComponent {
  componentName: string;
  category: ComponentCategory;
  requiredQuantity: number;
  unit: string;
  approxWeightGrams: number;
  optional?: boolean;
}

export type ProjectDifficulty = 'Beginner' | 'Intermediate' | 'Advanced';

export type ProjectCategory =
  | 'Educational / Maker'
  | 'Industrial Utility'
  | 'Environmental IoT'
  | 'Emergency & Safety'
  | 'Industrial Safety';

export interface ReuseProject {
  id: string;
  title: string;
  tagline: string;
  difficulty: ProjectDifficulty;
  category: ProjectCategory;
  estimatedBuildTimeMinutes: number;
  requiredComponents: RequiredComponent[];
  description: string;
  wiringInstructions: string[];
  assemblySteps: {
    title: string;
    description: string;
    salvageTip?: string;
  }[];
  educationalTakeaways: string[];
  safetyPrecautions: string[];
  schematicSummary: string;
  imageUrl?: string;
}

export interface ProjectFeasibility {
  project: ReuseProject;
  scorePercentage: number;
  isFullyFeasible: boolean;
  totalRequiredQuantity: number;
  matchedQuantity: number;
  missingComponents: {
    name: string;
    category: ComponentCategory;
    needed: number;
    available: number;
    shortfall: number;
  }[];
  estimatedWasteReductionGrams: number;
  estimatedCO2AvoidedKg: number;
}

export interface DisposalLog {
  id: string;
  date: string;
  weightKg: number;
  facilityDepartment: string;
  wasteType: 'Non-reusable Scrap' | 'Hazardous Chemical Battery' | 'Heavy Metal Slag' | 'Shattered Glass/Casings';
  disposalContractor: string;
  notes: string;
}

export interface MonthlyQuotaConfig {
  monthlyQuotaKg: number;
  warningThresholdPercent: number; // e.g. 65%
  dangerThresholdPercent: number;  // e.g. 85%
  currentMonthName: string;
  disposalLogs: DisposalLog[];
}

export type ThresholdStatus = 'safe' | 'warning' | 'danger';
