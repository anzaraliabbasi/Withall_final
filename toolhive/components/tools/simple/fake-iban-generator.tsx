"use client";

import { useState, useMemo } from "react";
import { ToolShell, Field, Select, Range, Btn, Output, StatPill, Toggle } from "@/components/ui/kit";

interface CountrySpec {
  code: string;
  name: string;
  bbanFormat: () => string;
  bic: string;
}

function randomDigits(length: number): string {
  let res = "";
  for (let i = 0; i < length; i++) {
    res += Math.floor(Math.random() * 10).toString();
  }
  return res;
}

function randomLetters(length: number): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let res = "";
  for (let i = 0; i < length; i++) {
    res += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return res;
}

const COUNTRIES: CountrySpec[] = [
  {
    code: "DE",
    name: "Germany (DE)",
    bbanFormat: () => randomDigits(8) + randomDigits(10), // 8 BLZ + 10 Account
    bic: "DEUTDEDDBXX",
  },
  {
    code: "GB",
    name: "United Kingdom (GB)",
    bbanFormat: () => randomLetters(4) + randomDigits(6) + randomDigits(8), // 4 Bank + 6 Sort + 8 Account
    bic: "BARCGB22XXX",
  },
  {
    code: "FR",
    name: "France (FR)",
    bbanFormat: () => randomDigits(5) + randomDigits(5) + randomDigits(11) + randomDigits(2),
    bic: "BNPAFRPPXXX",
  },
  {
    code: "NL",
    name: "Netherlands (NL)",
    bbanFormat: () => randomLetters(4) + randomDigits(10),
    bic: "INGBNL2AXXX",
  },
  {
    code: "ES",
    name: "Spain (ES)",
    bbanFormat: () => randomDigits(4) + randomDigits(4) + randomDigits(2) + randomDigits(10),
    bic: "BBVAESMMXXX",
  },
  {
    code: "IT",
    name: "Italy (IT)",
    bbanFormat: () => randomLetters(1) + randomDigits(5) + randomDigits(5) + randomDigits(12),
    bic: "UNCRITM1XXX",
  },
  {
    code: "PK",
    name: "Pakistan (PK)",
    bbanFormat: () => randomLetters(4) + randomDigits(16),
    bic: "HABBPKKAXXX",
  },
  {
    code: "CH",
    name: "Switzerland (CH)",
    bbanFormat: () => randomDigits(5) + randomDigits(12),
    bic: "UBSWCHZH80A",
  },
  {
    code: "AT",
    name: "Austria (AT)",
    bbanFormat: () => randomDigits(5) + randomDigits(11),
    bic: "GIBAATWWXXX",
  },
  {
    code: "BE",
    name: "Belgium (BE)",
    bbanFormat: () => randomDigits(3) + randomDigits(7) + randomDigits(2),
    bic: "GEBABEBBXXX",
  },
];

function mod97(numericString: string): number {
  let checksum = 0;
  for (let i = 0; i < numericString.length; i++) {
    checksum = (checksum * 10 + parseInt(numericString[i], 10)) % 97;
  }
  return checksum;
}

function generateValidIban(countryCode: string, bban: string): string {
  const rearranged = bban + countryCode + "00";
  let numeric = "";
  for (let i = 0; i < rearranged.length; i++) {
    const char = rearranged[i];
    if (/[A-Z]/.test(char)) {
      numeric += (char.charCodeAt(0) - 55).toString();
    } else {
      numeric += char;
    }
  }

  const remainder = mod97(numeric);
  const checkDigits = (98 - remainder).toString().padStart(2, "0");

  return `${countryCode}${checkDigits}${bban}`;
}

export default function FakeIbanGenerator() {
  const [selectedCountryCode, setSelectedCountryCode] = useState("DE");
  const [count, setCount] = useState(5);
  const [formatSpaces, setFormatSpaces] = useState(true);
  const [generateSeed, setGenerateSeed] = useState(0);

  const country = useMemo(
    () => COUNTRIES.find((c) => c.code === selectedCountryCode) || COUNTRIES[0],
    [selectedCountryCode]
  );

  const generatedIbans = useMemo(() => {
    // depend on generateSeed for refreshing
    void generateSeed;

    const list: { raw: string; formatted: string; bic: string }[] = [];
    for (let i = 0; i < count; i++) {
      const bban = country.bbanFormat();
      const raw = generateValidIban(country.code, bban);
      const formatted = raw.replace(/(.{4})/g, "$1 ").trim();
      list.push({ raw, formatted, bic: country.bic });
    }
    return list;
  }, [country, count, generateSeed]);

  const outputText = useMemo(() => {
    return generatedIbans.map((item) => (formatSpaces ? item.formatted : item.raw)).join("\n");
  }, [generatedIbans, formatSpaces]);

  return (
    <ToolShell
      side={
        <div className="space-y-4">
          <StatPill label="Selected Country" value={country.name.split(" ")[0]} />

          <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-3 text-xs text-amber-800 dark:text-amber-300 font-medium">
            ⚠️ Disclaimer: These IBANs are algorithmically generated with valid ISO 13616 mod-97 check digits for software testing and development only. They do not represent real bank accounts.
          </div>

          <Output
            text={outputText}
            label={`Generated IBANs (${generatedIbans.length})`}
            filename={`ibans-${selectedCountryCode.toLowerCase()}.txt`}
          />
        </div>
      }
    >
      <div className="space-y-4">
        <Field label="Country & Format Structure">
          <Select
            value={selectedCountryCode}
            onChange={setSelectedCountryCode}
            options={COUNTRIES.map((c) => ({ value: c.code, label: c.name }))}
          />
        </Field>

        <Field label={`Quantity to Generate (${count})`}>
          <Range value={count} onChange={setCount} min={1} max={20} step={1} />
        </Field>

        <Toggle
          checked={formatSpaces}
          onChange={setFormatSpaces}
          label="Format with Spaces (e.g. DE89 3704 0044 ...)"
        />

        <Btn
          onClick={() => setGenerateSeed((s) => s + 1)}
          variant="primary"
          className="w-full"
        >
          🔄 Generate New IBANs
        </Btn>

        <Field label="Sample BIC / SWIFT Code for Country">
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 font-mono text-xs font-semibold text-slate-700 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300">
            {country.bic}
          </div>
        </Field>
      </div>
    </ToolShell>
  );
}
