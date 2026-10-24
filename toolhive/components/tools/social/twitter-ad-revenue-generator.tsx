"use client";

import React, { useState } from "react";
import {
  ToolShell,
  Field,
  Btn,
  TextInput,
  Select,
  Range,
  StatPill,
  FileDrop,
  useMockupExport,
} from "@/components/ui/kit";
import { Avatar, VerifiedBadge, readImageAsDataUrl, formatStat } from "./_post";

export default function TwitterAdRevenueGenerator() {
  const { exportRef, exportPng } = useMockupExport();

  const [name, setName] = useState("Alex Rivers");
  const [handle, setHandle] = useState("alexrivers");
  const [avatarUrl, setAvatarUrl] = useState("");

  const [impressions, setImpressions] = useState(8500000);
  const [premiumRatio, setPremiumRatio] = useState(65); // 65% premium verified views
  const [cpm, setCpm] = useState(3.2); // $3.20 per 1k premium views
  const [revenueShare, setRevenueShare] = useState(70); // 70% share

  const [payoutPeriod, setPayoutPeriod] = useState("Oct 01 - Oct 15, 2026");
  const [currencySymbol, setCurrencySymbol] = useState("$");

  // Calculations
  const monetizableImpressions = Math.round(impressions * (premiumRatio / 100));
  const grossAdRevenue = (monetizableImpressions / 1000) * cpm;
  const netPayout = grossAdRevenue * (revenueShare / 100);
  const effectiveRpm = impressions > 0 ? (netPayout / (impressions / 1000)) : 0;

  const handleAvatarUpload = async (files: File[]) => {
    if (files[0]) {
      const url = await readImageAsDataUrl(files[0]);
      setAvatarUrl(url);
    }
  };

  return (
    <ToolShell
      side={
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500">
              Creator Earnings Statement
            </h3>
            <Btn
              onClick={() => exportPng("x-creator-payout-statement.png")}
              className="!bg-hive-500 !text-slate-950 font-bold"
            >
              Download PNG
            </Btn>
          </div>

          {/* Exportable Statement Card */}
          <div
            ref={exportRef}
            className="mx-auto w-full max-w-lg rounded-2xl p-6 shadow-2xl transition-all"
            style={{
              backgroundColor: "#000000",
              color: "#e7e9ea",
              fontFamily:
                '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
              border: "1px solid #2f3336",
            }}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b pb-4" style={{ borderColor: "#2f3336" }}>
              <div className="flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white font-extrabold text-black text-xl">
                  𝕏
                </div>
                <div>
                  <h4 className="text-base font-bold text-white">Creator Revenue Sharing</h4>
                  <p className="text-xs text-slate-400">Official Earnings Statement</p>
                </div>
              </div>
              <span className="rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-bold text-emerald-400 border border-emerald-500/30">
                PAID & TRANSFERRED
              </span>
            </div>

            {/* Creator Profile */}
            <div className="mt-4 flex items-center justify-between bg-[#16181c] p-3.5 rounded-xl border border-[#2f3336]">
              <div className="flex items-center gap-3">
                <Avatar src={avatarUrl} name={name} size={42} />
                <div>
                  <div className="flex items-center gap-1 font-bold text-sm text-white">
                    <span>{name}</span>
                    <VerifiedBadge type="gold" size={16} />
                  </div>
                  <div className="text-xs text-slate-400">@{handle}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-[11px] uppercase tracking-wider text-slate-400">Period</div>
                <div className="text-xs font-semibold text-slate-200">{payoutPeriod}</div>
              </div>
            </div>

            {/* Breakdown Table */}
            <div className="mt-4 space-y-2 text-xs">
              <div className="grid grid-cols-12 text-slate-400 font-semibold uppercase tracking-wider px-2 py-1">
                <span className="col-span-6">Metric</span>
                <span className="col-span-3 text-right">Qty / Rate</span>
                <span className="col-span-3 text-right">Subtotal</span>
              </div>

              <div className="grid grid-cols-12 p-2 rounded-lg bg-[#0e1012] border border-[#2f3336]/60 items-center">
                <span className="col-span-6 font-medium text-slate-300">Total Organic Views</span>
                <span className="col-span-3 text-right text-slate-400">{formatStat(impressions)}</span>
                <span className="col-span-3 text-right font-mono text-slate-200">—</span>
              </div>

              <div className="grid grid-cols-12 p-2 rounded-lg bg-[#0e1012] border border-[#2f3336]/60 items-center">
                <span className="col-span-6 font-medium text-slate-300">Monetizable Views ({premiumRatio}%)</span>
                <span className="col-span-3 text-right text-slate-400">{formatStat(monetizableImpressions)}</span>
                <span className="col-span-3 text-right font-mono text-slate-200">
                  {currencySymbol}{grossAdRevenue.toFixed(2)}
                </span>
              </div>

              <div className="grid grid-cols-12 p-2 rounded-lg bg-[#0e1012] border border-[#2f3336]/60 items-center">
                <span className="col-span-6 font-medium text-slate-300">Creator Revenue Share</span>
                <span className="col-span-3 text-right text-slate-400">{revenueShare}%</span>
                <span className="col-span-3 text-right font-mono text-emerald-400 font-bold">
                  {currencySymbol}{netPayout.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Payout Hero Box */}
            <div className="mt-5 rounded-xl bg-gradient-to-br from-slate-900 to-black p-4 border border-[#2f3336] text-center">
              <span className="text-xs uppercase font-bold tracking-wider text-slate-400">
                Net Payment Deposited
              </span>
              <div className="mt-1 text-3xl font-extrabold text-amber-400 font-mono">
                {currencySymbol}{netPayout.toFixed(2)}
              </div>
              <div className="mt-1 text-[11px] text-slate-400">
                Effective RPM: {currencySymbol}{effectiveRpm.toFixed(2)} per 1,000 views
              </div>
            </div>

            {/* Footer */}
            <div className="mt-4 flex items-center justify-between text-[10px] text-slate-500 pt-3 border-t border-[#2f3336]">
              <span>Statement ID: X-PAY-{Math.floor(100000 + Math.random() * 900000)}</span>
              <span>Generated on Oct 22, 2026</span>
            </div>
          </div>
        </div>
      }
    >
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">
          X Ad Revenue & Payout Calculator
        </h2>

        {/* Real-time calculated stats */}
        <div className="grid grid-cols-3 gap-3">
          <StatPill label="Gross Ad Revenue" value={`${currencySymbol}${grossAdRevenue.toFixed(2)}`} />
          <StatPill label="Net Creator Payout" value={`${currencySymbol}${netPayout.toFixed(2)}`} />
          <StatPill label="Effective RPM" value={`${currencySymbol}${effectiveRpm.toFixed(2)}`} />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Field label="Creator Display Name">
            <TextInput value={name} onChange={setName} />
          </Field>
          <Field label="Handle (@)">
            <TextInput value={handle} onChange={setHandle} />
          </Field>
        </div>

        <Field label="Avatar Image">
          <FileDrop accept="image/*" onFiles={handleAvatarUpload} label="Upload Creator Avatar" />
        </Field>

        <Field label="Total Organic Impressions">
          <Range
            value={impressions}
            onChange={setImpressions}
            min={100000}
            max={50000000}
            step={100000}
            suffix=" views"
          />
        </Field>

        <Field label={`Monetizable Premium Views Ratio (${premiumRatio}%)`}>
          <Range
            value={premiumRatio}
            onChange={setPremiumRatio}
            min={10}
            max={100}
            step={1}
            suffix="%"
          />
        </Field>

        <div className="grid grid-cols-2 gap-3">
          <Field label="Ad CPM ($ per 1k views)">
            <Range value={cpm} onChange={setCpm} min={0.5} max={15.0} step={0.1} suffix=" USD" />
          </Field>
          <Field label="Creator Share %">
            <Range
              value={revenueShare}
              onChange={setRevenueShare}
              min={50}
              max={95}
              step={1}
              suffix="%"
            />
          </Field>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Field label="Payout Period">
            <TextInput value={payoutPeriod} onChange={setPayoutPeriod} />
          </Field>
          <Field label="Currency">
            <Select
              value={currencySymbol}
              onChange={setCurrencySymbol}
              options={[
                { value: "$", label: "USD ($)" },
                { value: "€", label: "EUR (€)" },
                { value: "£", label: "GBP (£)" },
              ]}
            />
          </Field>
        </div>
      </div>
    </ToolShell>
  );
}
