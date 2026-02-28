"use client";

import { useState, useMemo } from "react";
import {
  DollarSign,
  ShoppingCart,
  Car,
  Info,
  ArrowRight,
} from "lucide-react";
import expenditureData from "@/data/budget/expenditures.json";
import type { BudgetData } from "@/types/budget";

const data = expenditureData as unknown as BudgetData;
const FY = "2025-26";
const SALES_TAX_RATE = 0.01; // 1% local share returned to city

interface DepartmentBreakdown {
  id: string;
  name: string;
  color: string;
  amount: number;
  percentage: number;
  perDollar: number;
}

export default function TaxDollarCalculator() {
  const [annualSpending, setAnnualSpending] = useState<string>("5000");
  const [showAutoSquare, setShowAutoSquare] = useState(false);
  const [carPrice, setCarPrice] = useState<string>("40000");

  const departments = useMemo((): DepartmentBreakdown[] => {
    const totalExpend = data.categories.reduce((sum, cat) => {
      const yearAmt = cat.amounts.find((a) => a.fiscalYear === FY);
      return sum + (yearAmt?.amount || 0);
    }, 0);

    return data.categories
      .map((cat) => {
        const yearAmt = cat.amounts.find((a) => a.fiscalYear === FY);
        const amount = yearAmt?.amount || 0;
        const percentage = amount / totalExpend;
        return {
          id: cat.id,
          name: cat.name,
          color: cat.color,
          amount,
          percentage,
          perDollar: percentage * SALES_TAX_RATE,
        };
      })
      .sort((a, b) => b.amount - a.amount);
  }, []);

  const spending = parseFloat(annualSpending) || 0;
  const cityRevenue = spending * SALES_TAX_RATE;
  const carPriceNum = parseFloat(carPrice) || 0;
  const carTax = carPriceNum * SALES_TAX_RATE;

  return (
    <div className="space-y-8">
      {/* How It Works */}
      <div className="bg-gradient-to-r from-eco-green/5 to-eco-blue/5 rounded-2xl p-6 border border-eco-green/10">
        <div className="flex items-start gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-eco-green/10 flex items-center justify-center shrink-0">
            <Info className="w-5 h-5 text-eco-green" />
          </div>
          <div>
            <h3 className="font-heading font-bold text-lg text-gray-900">
              How Your Spending Funds City Services
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              For every <strong>$100</strong> you spend in Cerritos, about{" "}
              <strong>$1</strong> comes back to the city as sales tax. This
              local 1% share funds everything from sheriff patrols to park
              maintenance. Sales tax is the city&apos;s #1 revenue source at{" "}
              <strong>$43.8 million</strong> — 43% of the entire General Fund.
            </p>
          </div>
        </div>
      </div>

      {/* Calculator */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <h3 className="font-heading font-bold text-lg mb-4 flex items-center gap-2">
          <ShoppingCart className="w-5 h-5 text-eco-green" />
          Your Annual Impact
        </h3>
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-end mb-6">
          <div className="flex-1 w-full">
            <label className="text-sm text-gray-600 mb-1 block">
              Estimated annual spending in Cerritos ($)
            </label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="number"
                value={annualSpending}
                onChange={(e) => setAnnualSpending(e.target.value)}
                className="w-full pl-8 pr-4 py-3 border border-gray-200 rounded-xl text-lg font-semibold focus:ring-2 focus:ring-eco-green/20 focus:border-eco-green outline-none"
                min={0}
                step={500}
              />
            </div>
          </div>
          <div className="bg-eco-green-light rounded-xl px-6 py-3 text-center shrink-0">
            <p className="text-xs text-gray-500">Your city contribution</p>
            <p className="text-2xl font-bold text-eco-green">
              ${cityRevenue.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
            </p>
            <p className="text-xs text-gray-500">per year in sales tax</p>
          </div>
        </div>

        {/* Breakdown bars */}
        <div className="space-y-3">
          <p className="text-sm font-medium text-gray-700">
            Here&apos;s where your ${cityRevenue.toFixed(0)} goes:
          </p>
          {departments.map((dept) => {
            const contribution = cityRevenue * dept.percentage;
            return (
              <div key={dept.id} className="group">
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="text-gray-700 font-medium">{dept.name}</span>
                  <span className="font-semibold text-gray-900">
                    ${contribution.toFixed(2)}
                    <span className="text-gray-400 font-normal ml-1">
                      ({(dept.percentage * 100).toFixed(1)}%)
                    </span>
                  </span>
                </div>
                <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${dept.percentage * 100}%`,
                      backgroundColor: dept.color,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Per $1 micro-breakdown */}
        <div className="mt-6 pt-6 border-t border-gray-100">
          <p className="text-sm font-medium text-gray-700 mb-3">
            For every <strong>$1 of sales tax</strong> the city receives:
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {departments.slice(0, 4).map((dept) => (
              <div
                key={dept.id}
                className="rounded-xl p-3 text-center"
                style={{ backgroundColor: dept.color + "10" }}
              >
                <p
                  className="text-lg font-bold"
                  style={{ color: dept.color }}
                >
                  {(dept.percentage * 100).toFixed(0)}¢
                </p>
                <p className="text-xs text-gray-600 leading-tight">
                  {dept.name}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Auto Square Special */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <button
          onClick={() => setShowAutoSquare(!showAutoSquare)}
          className="w-full p-6 flex items-center gap-3 hover:bg-gray-50 transition-colors text-left"
        >
          <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
            <Car className="w-5 h-5 text-blue-600" />
          </div>
          <div className="flex-1">
            <h3 className="font-heading font-bold text-lg text-gray-900">
              Cerritos Auto Square Special
            </h3>
            <p className="text-sm text-gray-500">
              See how buying a car locally funds city services
            </p>
          </div>
          <ArrowRight
            className={`w-5 h-5 text-gray-400 transition-transform ${
              showAutoSquare ? "rotate-90" : ""
            }`}
          />
        </button>

        {showAutoSquare && (
          <div className="px-6 pb-6 space-y-4">
            <div className="bg-blue-50/50 rounded-xl p-4">
              <p className="text-sm text-gray-700">
                The <strong>Cerritos Auto Square</strong> is one of the world&apos;s
                largest auto malls and generates about <strong>$14.6 million</strong>{" "}
                in sales tax — roughly <strong>one-third</strong> of all city sales
                tax revenue. Buying a car here directly funds Cerritos services.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-end">
              <div className="flex-1 w-full">
                <label className="text-sm text-gray-600 mb-1 block">
                  Car purchase price ($)
                </label>
                <div className="relative">
                  <Car className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="number"
                    value={carPrice}
                    onChange={(e) => setCarPrice(e.target.value)}
                    className="w-full pl-8 pr-4 py-3 border border-gray-200 rounded-xl text-lg font-semibold focus:ring-2 focus:ring-blue-200 focus:border-blue-400 outline-none"
                    min={0}
                    step={5000}
                  />
                </div>
              </div>
              <div className="bg-blue-50 rounded-xl px-6 py-3 text-center shrink-0">
                <p className="text-xs text-gray-500">City sales tax</p>
                <p className="text-2xl font-bold text-blue-600">
                  ${carTax.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                </p>
                <p className="text-xs text-gray-500">goes to Cerritos</p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center">
              {departments.slice(0, 3).map((dept) => {
                const deptShare = carTax * dept.percentage;
                return (
                  <div
                    key={dept.id}
                    className="rounded-xl p-3"
                    style={{ backgroundColor: dept.color + "10" }}
                  >
                    <p className="text-sm font-bold" style={{ color: dept.color }}>
                      ${deptShare.toFixed(0)}
                    </p>
                    <p className="text-xs text-gray-600">{dept.name}</p>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Source */}
      <div className="text-xs text-gray-400 text-center">
        Data: City of Cerritos FY 2025-26 Adopted Budget | Sales tax local share: 1% (Bradley-Burns)
      </div>
    </div>
  );
}
