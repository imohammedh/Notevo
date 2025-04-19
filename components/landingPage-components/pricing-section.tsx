"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import Section from "../ui/Section";
import MaxWContainer from "../ui/MaxWContainer";
import SectionHeading from "./SectionHeading";

// Currency configuration
const CURRENCIES = {
  USD: { symbol: "$", rate: 1 },
  EGP: { symbol: "LE", rate: 30.9 }, // Egyptian Pound
  SAR: { symbol: "SAR", rate: 3.75 }, // Saudi Riyal
  EUR: { symbol: "€", rate: 0.91 }, // Euro
  GBP: { symbol: "£", rate: 0.78 }, // British Pound
  // Add more currencies as needed
};

// Default currency
const DEFAULT_CURRENCY = "USD";

export default function PricingSection() {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">(
    "monthly",
  );
  const [currency, setCurrency] = useState(DEFAULT_CURRENCY);
  const [currencySymbol, setCurrencySymbol] = useState(
    CURRENCIES[DEFAULT_CURRENCY].symbol,
  );
  const [isLoading, setIsLoading] = useState(true);

  // Base prices in USD
  const baseMonthlyPrice = 6;
  const yearlyDiscount = 20; // 20% discount for yearly billing
  const baseYearlyPrice = baseMonthlyPrice * 12 * (1 - yearlyDiscount / 100);

  // Get user location and set currency automatically
  useEffect(() => {
    async function detectUserLocation() {
      try {
        // Using a geolocation API
        const response = await fetch("https://ipapi.co/json/");
        const data = await response.json();

        // Set currency based on country code
        switch (data.country_code) {
          case "EG":
            setCurrency("EGP");
            setCurrencySymbol(CURRENCIES.EGP.symbol);
            break;
          case "SA":
            setCurrency("SAR");
            setCurrencySymbol(CURRENCIES.SAR.symbol);
            break;
          case "US":
            setCurrency("USD");
            setCurrencySymbol(CURRENCIES.USD.symbol);
            break;
          case "GB":
            setCurrency("GBP");
            setCurrencySymbol(CURRENCIES.GBP.symbol);
            break;
          // Euro countries
          case "DE":
          case "FR":
          case "IT":
          case "ES":
          case "NL":
          case "BE":
          case "AT":
          case "IE":
          case "FI":
          case "PT":
          case "GR":
            setCurrency("EUR");
            setCurrencySymbol(CURRENCIES.EUR.symbol);
            break;
          // Add more countries as needed
          default:
            // Default to USD for all other countries
            setCurrency(DEFAULT_CURRENCY);
            setCurrencySymbol(CURRENCIES[DEFAULT_CURRENCY].symbol);
        }
      } catch (error) {
        console.error("Failed to detect location:", error);
        // Fall back to default currency
        setCurrency(DEFAULT_CURRENCY);
        setCurrencySymbol(CURRENCIES[DEFAULT_CURRENCY].symbol);
      } finally {
        setIsLoading(false);
      }
    }

    detectUserLocation();
  }, []);

  const toggleBillingCycle = () => {
    setBillingCycle(billingCycle === "monthly" ? "yearly" : "monthly");
  };

  // Calculate current prices based on detected currency
  const getPrice = (basePrice: number) => {
    const conversionRate =
      CURRENCIES[currency as keyof typeof CURRENCIES]?.rate || 1;
    return (basePrice * conversionRate).toFixed(2);
  };

  const monthlyPrice = getPrice(baseMonthlyPrice);
  const yearlyPrice = getPrice(baseYearlyPrice);
  const yearlySavings = getPrice(baseMonthlyPrice * 12 - baseYearlyPrice);

  // Format price with the correct decimal places
  const formatPrice = (price: any) => {
    // For currencies like JPY that don't typically use decimal places
    if (["JPY"].includes(currency)) {
      return Math.round(price);
    }
    return price;
  };

  return (
    <Section
      className="relative px-0 sm:px-0 md:px-0 pt-2 sm:pt-2 md:pt-2 lg:pt-2 bg-gradient-to-b from-transparent from-15% via-purple-900/10 to-brand_fourthary/50"
      sectionId="pricing"
    >
      <svg
        viewBox="0 0 1440 58"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        version="1.1"
        width="100%"
        className="absolute bottom-0 bg-transparent"
      >
        <path
          transform="rotate(180) translate(-1440, -60)"
          d="M-100 58C-100 58 218.416 36.3297 693.5 36.3297C1168.58 36.3297 1487 58 1487 58V-3.8147e-06H-100V58Z"
          fill="#0a0a0a"
        ></path>
      </svg>
      <MaxWContainer>
        <SectionHeading
          SectionTitle="Pricing"
          SectionSubTitle="Choose the Perfect Plan for You"
        />

        {/* Billing cycle toggle */}
        {/* <div className="flex justify-center mb-6 max-w-4xl mx-auto">
          <div className="flex items-center space-x-2">
            <Button
              variant={billingCycle === "monthly" ? "default" : "outline"}
              size="sm"
              onClick={() => setBillingCycle("monthly")}
            >
              Monthly
            </Button>
            <Button
              variant={billingCycle === "yearly" ? "default" : "outline"}
              size="sm"
              onClick={() => setBillingCycle("yearly")}
            >
              Yearly (20% off)
            </Button>
          </div>
        </div> */}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-10 max-w-4xl mx-auto">
          {/* Free Plan */}
          <Card className="border-brand_tertiary/20 bg-brand_fourthary/30 transition-all duration-200 hover:shadow-md">
            <CardHeader className="pb-8">
              <CardTitle className="text-2xl">Free</CardTitle>
              <CardDescription className="text-brand_tertiary/70">
                Perfect for getting started with basic features
              </CardDescription>
              <div className="mt-4 flex items-baseline text-brand_tertiary">
                <span className="text-4xl font-extrabold tracking-tight">
                  {currencySymbol}0
                </span>
                <span className="ml-1 text-xl font-semibold">/month</span>
              </div>
            </CardHeader>
            <CardContent className="pb-6">
              <ul className="space-y-3">
                <PricingFeature included>Up to 1 workspaces</PricingFeature>
                <PricingFeature included>Up to 2 Table</PricingFeature>
                <PricingFeature included>Basic note editor</PricingFeature>
                <PricingFeature included>20 notes</PricingFeature>
                <PricingFeature>Unlimited workspaces</PricingFeature>
                <PricingFeature>Unlimited notes</PricingFeature>
                <PricingFeature>Priority support</PricingFeature>
              </ul>
            </CardContent>
            <CardFooter>
              <Button
                variant="outline"
                size="lg"
                className="w-full border-brand_tertiary/30"
                asChild
              >
                <Link href="/signin">Get Started</Link>
              </Button>
            </CardFooter>
          </Card>

          {/* Pro Plan */}
          <Card className="border-brand_primary/30 bg-gradient-to-b from-brand_fourthary/40 to-brand_fourthary/60 transition-all duration-200 hover:shadow-lg relative">
            <CardHeader className="pb-8">
              <CardTitle className="text-2xl">Pro</CardTitle>
              <CardDescription className="text-brand_tertiary/70">
                Everything you need for unlimited productivity
              </CardDescription>
              <div className="mt-4 flex items-baseline text-brand_tertiary">
                <span className="text-4xl font-extrabold tracking-tight">
                  {currencySymbol}
                  {formatPrice(
                    billingCycle === "monthly" ? monthlyPrice : yearlyPrice,
                  )}
                </span>
                <span className="ml-1 text-xl font-semibold">/month</span>
              </div>
              {billingCycle === "yearly" && (
                <div className="mt-1 text-sm text-emerald-500">
                  {currencySymbol}
                  {formatPrice(yearlyPrice)} billed yearly (save{" "}
                  {currencySymbol}
                  {yearlySavings})
                </div>
              )}
            </CardHeader>
            <CardContent className="pb-6">
              <ul className="space-y-3">
                <PricingFeature included>Unlimited workspaces</PricingFeature>
                <PricingFeature included>Unlimited Table</PricingFeature>
                <PricingFeature included>Advanced note editor</PricingFeature>
                <PricingFeature included>Unlimited notes</PricingFeature>
                <PricingFeature included>Custom templates</PricingFeature>
                <PricingFeature included>Collaboration features</PricingFeature>
                <PricingFeature included>Priority support</PricingFeature>
              </ul>
            </CardContent>
            <CardFooter>
              <Button className="w-full" asChild>
                <Link href="/signin">Upgrade to Pro</Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </MaxWContainer>
    </Section>
  );
}

interface PricingFeatureProps {
  children: React.ReactNode;
  included?: boolean;
}

function PricingFeature({ children, included = false }: PricingFeatureProps) {
  return (
    <li className="flex items-center">
      {included ? (
        <Check className="h-5 w-5 text-emerald-500 mr-2 flex-shrink-0" />
      ) : (
        <X className="h-5 w-5 text-brand_tertiary/30 mr-2 flex-shrink-0" />
      )}
      <span
        className={
          included ? "text-brand_tertiary/90" : "text-brand_tertiary/50"
        }
      >
        {children}
      </span>
    </li>
  );
}
