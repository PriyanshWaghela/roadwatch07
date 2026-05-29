import { IAIAnalysis, IBoundingBox } from '../models/Complaint';

const DAMAGE_TYPES: Record<string, string[]> = {
  pothole: ['Deep Pothole', 'Shallow Pothole', 'Wide Pothole', 'Cluster Potholes'],
  crack: ['Longitudinal Crack', 'Transverse Crack', 'Alligator Cracking', 'Block Cracking', 'Edge Crack'],
  waterlogging: ['Severe Waterlogging', 'Moderate Waterlogging', 'Drainage Blockage', 'Standing Water'],
  road_damage: ['Surface Erosion', 'Rutting', 'Shoving', 'Raveling', 'Patching Failure'],
  other: ['General Road Deterioration', 'Unmarked Hazard', 'Debris on Road', 'Missing Signage'],
};

const SEVERITY_WEIGHTS = {
  low: 0.15,
  medium: 0.35,
  high: 0.30,
  critical: 0.20,
};

const RECOMMENDATIONS: Record<string, string[]> = {
  low: [
    'Schedule routine maintenance within 30 days',
    'Monitor for further deterioration',
    'Add to next maintenance cycle',
    'Apply preventive sealant coating',
  ],
  medium: [
    'Schedule repair within 14 days',
    'Apply temporary patch immediately',
    'Conduct detailed field inspection',
    'Install warning signage for motorists',
    'Assess drainage in the affected area',
  ],
  high: [
    'Immediate temporary repair required within 48 hours',
    'Deploy traffic cones and warning signs',
    'Schedule permanent repair within 7 days',
    'Restrict heavy vehicle access',
    'Conduct structural assessment of road base',
    'Coordinate with utility providers for underground infrastructure check',
  ],
  critical: [
    'URGENT: Deploy emergency repair crew within 24 hours',
    'Close affected lane immediately and set up detour',
    'Install barrier and high-visibility warning signs',
    'Notify emergency services of hazardous road condition',
    'Schedule complete road resurfacing',
    'Conduct geotechnical assessment of subgrade',
    'Assess impact on adjacent infrastructure',
  ],
};

/**
 * Select a weighted random severity level
 */
function getWeightedSeverity(): 'low' | 'medium' | 'high' | 'critical' {
  const random = Math.random();
  let cumulative = 0;

  for (const [severity, weight] of Object.entries(SEVERITY_WEIGHTS)) {
    cumulative += weight;
    if (random <= cumulative) {
      return severity as 'low' | 'medium' | 'high' | 'critical';
    }
  }

  return 'medium';
}

/**
 * Generate realistic bounding boxes for detected damage
 */
function generateBoundingBoxes(damageType: string, count: number): IBoundingBox[] {
  const boxes: IBoundingBox[] = [];

  for (let i = 0; i < count; i++) {
    boxes.push({
      x: Math.round(50 + Math.random() * 400),
      y: Math.round(50 + Math.random() * 400),
      w: Math.round(40 + Math.random() * 200),
      h: Math.round(40 + Math.random() * 200),
      label: damageType,
      confidence: Math.round((0.75 + Math.random() * 0.24) * 100) / 100,
    });
  }

  return boxes;
}

/**
 * Get repair cost estimate based on severity (in INR)
 */
function getRepairCost(severity: string): number {
  const costRanges: Record<string, [number, number]> = {
    low: [5000, 25000],
    medium: [20000, 75000],
    high: [50000, 150000],
    critical: [100000, 200000],
  };

  const range = costRanges[severity] || costRanges['medium'];
  return Math.round(range[0] + Math.random() * (range[1] - range[0]));
}

/**
 * Get repair time estimate based on severity (in days)
 */
function getRepairDays(severity: string): number {
  const dayRanges: Record<string, [number, number]> = {
    low: [1, 3],
    medium: [3, 7],
    high: [5, 10],
    critical: [7, 14],
  };

  const range = dayRanges[severity] || dayRanges['medium'];
  return Math.round(range[0] + Math.random() * (range[1] - range[0]));
}

/**
 * Get road health score based on severity (lower for worse conditions)
 */
function getRoadHealthScore(severity: string): number {
  const scoreRanges: Record<string, [number, number]> = {
    low: [65, 85],
    medium: [45, 65],
    high: [25, 45],
    critical: [20, 30],
  };

  const range = scoreRanges[severity] || scoreRanges['medium'];
  return Math.round(range[0] + Math.random() * (range[1] - range[0]));
}

/**
 * Select random items from an array
 */
function selectRandom<T>(arr: T[], count: number): T[] {
  const shuffled = [...arr].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

/**
 * Simulate AI image analysis for road damage detection
 */
export async function analyzeImage(imageUrl: string, category?: string): Promise<IAIAnalysis> {
  // Simulate processing delay (500-1500ms)
  await new Promise((resolve) => setTimeout(resolve, 500 + Math.random() * 1000));

  const effectiveCategory = category || (['pothole', 'crack', 'waterlogging', 'road_damage', 'other'] as const)[
    Math.floor(Math.random() * 5)
  ];

  const damageTypes = DAMAGE_TYPES[effectiveCategory] || DAMAGE_TYPES['other'];
  const damageType = damageTypes[Math.floor(Math.random() * damageTypes.length)];

  const severity = getWeightedSeverity();
  const confidence = Math.round((0.85 + Math.random() * 0.14) * 100) / 100;
  const roadHealthScore = getRoadHealthScore(severity);

  const numBoxes = 1 + Math.floor(Math.random() * 3);
  const boundingBoxes = generateBoundingBoxes(damageType, numBoxes);

  const severityRecommendations = RECOMMENDATIONS[severity] || RECOMMENDATIONS['medium'];
  const numRecommendations = 2 + Math.floor(Math.random() * 3);
  const recommendations = selectRandom(severityRecommendations, numRecommendations);

  const estimatedRepairCost = getRepairCost(severity);
  const estimatedRepairDays = getRepairDays(severity);

  return {
    damageType,
    severity,
    confidence,
    roadHealthScore,
    boundingBoxes,
    recommendations,
    estimatedRepairCost,
    estimatedRepairDays,
  };
}

/**
 * Generate AI analysis data synchronously (for seeding)
 */
export function generateAIAnalysisSync(category?: string): IAIAnalysis {
  const effectiveCategory = category || (['pothole', 'crack', 'waterlogging', 'road_damage', 'other'] as const)[
    Math.floor(Math.random() * 5)
  ];

  const damageTypes = DAMAGE_TYPES[effectiveCategory] || DAMAGE_TYPES['other'];
  const damageType = damageTypes[Math.floor(Math.random() * damageTypes.length)];

  const severity = getWeightedSeverity();
  const confidence = Math.round((0.85 + Math.random() * 0.14) * 100) / 100;
  const roadHealthScore = getRoadHealthScore(severity);

  const numBoxes = 1 + Math.floor(Math.random() * 3);
  const boundingBoxes = generateBoundingBoxes(damageType, numBoxes);

  const severityRecommendations = RECOMMENDATIONS[severity] || RECOMMENDATIONS['medium'];
  const numRecommendations = 2 + Math.floor(Math.random() * 3);
  const recommendations = selectRandom(severityRecommendations, numRecommendations);

  const estimatedRepairCost = getRepairCost(severity);
  const estimatedRepairDays = getRepairDays(severity);

  return {
    damageType,
    severity,
    confidence,
    roadHealthScore,
    boundingBoxes,
    recommendations,
    estimatedRepairCost,
    estimatedRepairDays,
  };
}
