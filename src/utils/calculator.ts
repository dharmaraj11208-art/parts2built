import { ElectronicComponent, ReuseProject, ProjectFeasibility, MonthlyQuotaConfig, ThresholdStatus } from '../types';

/**
 * Matches an inventory component against a project requirement.
 * Uses smart category and normalized substring matching.
 */
export function findMatchingInventoryComponent(
  reqName: string,
  reqCategory: string,
  inventory: ElectronicComponent[]
): { matchedComponent?: ElectronicComponent; availableQuantity: number } {
  const normReq = reqName.toLowerCase().replace(/[^a-z0-9]/g, '');

  // 1. Direct or partial name match
  const matches = inventory.filter((item) => {
    const normItem = item.name.toLowerCase().replace(/[^a-z0-9]/g, '');
    if (normItem.includes(normReq) || normReq.includes(normItem)) return true;

    // Keyword heuristics
    if (normReq.includes('led') && normItem.includes('led')) return true;
    if (normReq.includes('resistor') && normItem.includes('resistor')) return true;
    if (normReq.includes('arduino') && normItem.includes('arduino')) return true;
    if (normReq.includes('dcmotor') && (normItem.includes('dcmotor') || normItem.includes('motor'))) return true;
    if (normReq.includes('jumper') && normItem.includes('jumper')) return true;
    if (normReq.includes('switch') && normItem.includes('switch')) return true;
    if (normReq.includes('ultrasonic') && (normItem.includes('ultrasonic') || normItem.includes('hcsr04'))) return true;
    if (normReq.includes('soil') && normItem.includes('soil')) return true;
    if (normReq.includes('phone') && (normItem.includes('phone') || normItem.includes('mobile'))) return true;
    if (normReq.includes('usb') && normItem.includes('usb')) return true;
    if (normReq.includes('battery') && normItem.includes('battery')) return true;

    return false;
  });

  if (matches.length > 0) {
    const totalAvail = matches.reduce((sum, item) => sum + item.quantity, 0);
    return { matchedComponent: matches[0], availableQuantity: totalAvail };
  }

  // 2. Fallback to category match if no name match
  const catMatches = inventory.filter((item) => item.category === reqCategory);
  if (catMatches.length > 0) {
    const totalAvail = catMatches.reduce((sum, item) => sum + item.quantity, 0);
    return { matchedComponent: catMatches[0], availableQuantity: totalAvail };
  }

  return { availableQuantity: 0 };
}

/**
 * Calculates feasibility score and waste diversion for a project against current inventory.
 */
export function calculateProjectFeasibility(
  project: ReuseProject,
  inventory: ElectronicComponent[]
): ProjectFeasibility {
  let totalRequiredQuantity = 0;
  let matchedQuantity = 0;
  let estimatedWasteGrams = 0;
  const missingComponents: ProjectFeasibility['missingComponents'] = [];

  for (const req of project.requiredComponents) {
    totalRequiredQuantity += req.requiredQuantity;
    const { availableQuantity } = findMatchingInventoryComponent(req.componentName, req.category, inventory);

    const satisfied = Math.min(availableQuantity, req.requiredQuantity);
    matchedQuantity += satisfied;

    if (availableQuantity < req.requiredQuantity) {
      missingComponents.push({
        name: req.componentName,
        category: req.category,
        needed: req.requiredQuantity,
        available: availableQuantity,
        shortfall: req.requiredQuantity - availableQuantity
      });
    }

    // Waste reduction formula: Reused quantity * approx unit weight
    estimatedWasteGrams += satisfied * (req.approxWeightGrams || 10);
  }

  const scorePercentage = totalRequiredQuantity > 0
    ? Math.round((matchedQuantity / totalRequiredQuantity) * 100)
    : 0;

  const isFullyFeasible = missingComponents.length === 0 && scorePercentage === 100;
  const estimatedCO2AvoidedKg = Number(((estimatedWasteGrams / 1000) * 2.45).toFixed(2));

  return {
    project,
    scorePercentage,
    isFullyFeasible,
    totalRequiredQuantity,
    matchedQuantity,
    missingComponents,
    estimatedWasteReductionGrams: estimatedWasteGrams,
    estimatedCO2AvoidedKg
  };
}

/**
 * Calculates current month's waste disposal vs monthly quota and status.
 */
export function getMonthlyDisposalMetrics(config: MonthlyQuotaConfig) {
  const totalDisposedKg = config.disposalLogs.reduce((sum, log) => sum + log.weightKg, 0);
  const percentageOfQuota = config.monthlyQuotaKg > 0
    ? (totalDisposedKg / config.monthlyQuotaKg) * 100
    : 0;

  let status: ThresholdStatus = 'safe';
  if (percentageOfQuota >= config.dangerThresholdPercent) {
    status = 'danger';
  } else if (percentageOfQuota >= config.warningThresholdPercent) {
    status = 'warning';
  }

  const remainingSafeQuotaKg = Math.max(0, config.monthlyQuotaKg - totalDisposedKg);

  return {
    totalDisposedKg: Number(totalDisposedKg.toFixed(1)),
    quotaKg: config.monthlyQuotaKg,
    percentageOfQuota: Math.min(100, Math.round(percentageOfQuota)),
    exactPercentage: Number(percentageOfQuota.toFixed(1)),
    status,
    remainingSafeQuotaKg: Number(remainingSafeQuotaKg.toFixed(1)),
    warningThresholdKg: Number(((config.warningThresholdPercent / 100) * config.monthlyQuotaKg).toFixed(1)),
    dangerThresholdKg: Number(((config.dangerThresholdPercent / 100) * config.monthlyQuotaKg).toFixed(1))
  };
}

/**
 * Returns total inventory mass diverted into potential reuse (in kg).
 */
export function calculateTotalInventoryMassKg(inventory: ElectronicComponent[]): number {
  const totalGrams = inventory.reduce((sum, item) => sum + (item.quantity * item.unitWeightGrams), 0);
  return Number((totalGrams / 1000).toFixed(2));
}
