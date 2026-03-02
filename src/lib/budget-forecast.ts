import historicalData from "@/data/budget/historical.json";

export interface ForecastPoint {
  year: string;
  actual?: number;
  forecast?: number;
  lower?: number;
  upper?: number;
}

export interface DepartmentForecast {
  id: string;
  name: string;
  color: string;
  data: ForecastPoint[];
  annualGrowthRate: number;
  r2: number;
}

/**
 * Simple linear regression: y = mx + b
 * Returns slope, intercept, and R² (goodness of fit)
 */
function linearRegression(xs: number[], ys: number[]): { slope: number; intercept: number; r2: number } {
  const n = xs.length;
  const sumX = xs.reduce((a, b) => a + b, 0);
  const sumY = ys.reduce((a, b) => a + b, 0);
  const sumXY = xs.reduce((acc, x, i) => acc + x * ys[i], 0);
  const sumX2 = xs.reduce((acc, x) => acc + x * x, 0);

  const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
  const intercept = (sumY - slope * sumX) / n;

  // R² calculation
  const meanY = sumY / n;
  const ssRes = ys.reduce((acc, y, i) => acc + (y - (slope * xs[i] + intercept)) ** 2, 0);
  const ssTot = ys.reduce((acc, y) => acc + (y - meanY) ** 2, 0);
  const r2 = ssTot === 0 ? 0 : 1 - ssRes / ssTot;

  return { slope, intercept, r2 };
}

/**
 * Filter out anomaly years for cleaner regression.
 * FY 2023-24 had a $152M spike due to one-time interfund loan forgiveness.
 */
function getCleanIndices(): number[] {
  // Index 7 = FY 2023-24 (the interfund loan anomaly)
  return [0, 1, 2, 3, 4, 5, 6, 8, 9]; // skip index 7
}

const FORECAST_YEARS = 5;

export function generateTotalForecast(): ForecastPoint[] {
  const years = historicalData.fiscalYears;
  const totals = historicalData.totals;
  const cleanIdx = getCleanIndices();

  const xs = cleanIdx.map((i) => i);
  const ys = cleanIdx.map((i) => totals[i]);
  const { slope, intercept } = linearRegression(xs, ys);

  // Calculate standard error for confidence bands
  const residuals = cleanIdx.map((i) => totals[i] - (slope * i + intercept));
  const stdError = Math.sqrt(residuals.reduce((s, r) => s + r * r, 0) / (residuals.length - 2));

  const data: ForecastPoint[] = [];

  // Historical actuals
  for (let i = 0; i < years.length; i++) {
    data.push({ year: years[i], actual: totals[i] });
  }

  // Forecast future years
  for (let j = 1; j <= FORECAST_YEARS; j++) {
    const idx = years.length - 1 + j;
    const baseYear = 2025 + j;
    const yearLabel = `${baseYear}-${String(baseYear + 1).slice(-2)}`;
    const predicted = slope * idx + intercept;
    const margin = stdError * 1.96; // 95% confidence

    data.push({
      year: yearLabel,
      forecast: Math.round(predicted),
      lower: Math.round(predicted - margin),
      upper: Math.round(predicted + margin),
    });
  }

  return data;
}

export function generateDepartmentForecasts(): DepartmentForecast[] {
  const years = historicalData.fiscalYears;
  const cleanIdx = getCleanIndices();

  return historicalData.departments.map((dept) => {
    const xs = cleanIdx.map((i) => i);
    const ys = cleanIdx.map((i) => dept.amounts[i]);
    const { slope, intercept, r2 } = linearRegression(xs, ys);

    const residuals = cleanIdx.map((i) => dept.amounts[i] - (slope * i + intercept));
    const stdError = Math.sqrt(
      residuals.reduce((s, r) => s + r * r, 0) / Math.max(residuals.length - 2, 1)
    );

    const data: ForecastPoint[] = [];

    // Historical
    for (let i = 0; i < years.length; i++) {
      data.push({ year: years[i], actual: dept.amounts[i] });
    }

    // Forecast
    for (let j = 1; j <= FORECAST_YEARS; j++) {
      const idx = years.length - 1 + j;
      const baseYear = 2025 + j;
      const yearLabel = `${baseYear}-${String(baseYear + 1).slice(-2)}`;
      const predicted = slope * idx + intercept;
      const margin = stdError * 1.96;

      data.push({
        year: yearLabel,
        forecast: Math.round(Math.max(predicted, 0)),
        lower: Math.round(Math.max(predicted - margin, 0)),
        upper: Math.round(predicted + margin),
      });
    }

    // Annualized growth rate from regression
    const firstPredicted = slope * 0 + intercept;
    const lastPredicted = slope * (years.length - 1) + intercept;
    const annualGrowthRate =
      firstPredicted > 0
        ? Math.pow(lastPredicted / firstPredicted, 1 / (years.length - 1)) - 1
        : 0;

    return {
      id: dept.id,
      name: dept.name,
      color: dept.color,
      data,
      annualGrowthRate,
      r2,
    };
  });
}
