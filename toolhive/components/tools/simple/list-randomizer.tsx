"use client";

import { useState, useMemo } from "react";
import { ToolShell, Field, TextArea, Btn, Toggle, Range, StatPill, Output } from "@/components/ui/kit";

export default function ListRandomizer() {
  const [inputLines, setInputLines] = useState(
    "Apple\nBanana\nCherry\nDragonfruit\nElderberry\nFig\nGrape\nHoneydew"
  );
  const [trimItems, setTrimItems] = useState(true);
  const [removeEmpty, setRemoveEmpty] = useState(true);
  const [uniqueOnly, setUniqueOnly] = useState(false);
  const [addNumbers, setAddNumbers] = useState(false);
  const [pickCount, setPickCount] = useState(0); // 0 means pick all
  const [shuffleTrigger, setShuffleTrigger] = useState(0);
  const [sortOrder, setSortOrder] = useState<"none" | "asc" | "desc">("none");

  // Parse lines
  const parsedItems = useMemo(() => {
    let raw = inputLines.split("\n");
    if (trimItems) raw = raw.map((s) => s.trim());
    if (removeEmpty) raw = raw.filter((s) => s.length > 0);
    if (uniqueOnly) raw = Array.from(new Set(raw));
    return raw;
  }, [inputLines, trimItems, removeEmpty, uniqueOnly]);

  // Processed (shuffled/picked/sorted) list
  const processedList = useMemo(() => {
    // Rely on shuffleTrigger to create new randomized instances
    void shuffleTrigger;

    let items = [...parsedItems];

    // Fisher-Yates Shuffle
    for (let i = items.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [items[i], items[j]] = [items[j], items[i]];
    }

    if (pickCount > 0 && pickCount < items.length) {
      items = items.slice(0, pickCount);
    }

    if (sortOrder === "asc") {
      items.sort((a, b) => a.localeCompare(b));
    } else if (sortOrder === "desc") {
      items.sort((a, b) => b.localeCompare(a));
    }

    if (addNumbers) {
      items = items.map((item, idx) => `${idx + 1}. ${item}`);
    }

    return items;
  }, [parsedItems, shuffleTrigger, pickCount, sortOrder, addNumbers]);

  const outputText = processedList.join("\n");

  const handleShuffle = () => {
    setSortOrder("none");
    setShuffleTrigger((prev) => prev + 1);
  };

  const loadSamplePreset = (preset: string) => {
    setSortOrder("none");
    if (preset === "names") {
      setInputLines("Alice\nBob\nCharlie\nDiana\nEvan\nFiona\nGeorge\nHannah");
    } else if (preset === "numbers") {
      setInputLines(Array.from({ length: 20 }, (_, i) => `Item #${i + 1}`).join("\n"));
    } else if (preset === "days") {
      setInputLines("Monday\nTuesday\nWednesday\nThursday\nFriday\nSaturday\nSunday");
    }
  };

  return (
    <ToolShell
      side={
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <StatPill label="Input Count" value={parsedItems.length} />
            <StatPill label="Output Picked" value={processedList.length} />
          </div>

          <Output
            text={outputText}
            label="Randomized / Picked Output"
            filename="randomized-list.txt"
          />
        </div>
      }
    >
      <div className="space-y-4">
        <Field label="Input Items (One per line)">
          <TextArea
            value={inputLines}
            onChange={setInputLines}
            placeholder="Paste your items here, one per line..."
            rows={8}
            mono
          />
        </Field>

        <div className="flex flex-wrap gap-2">
          <Btn onClick={handleShuffle} variant="primary" className="!px-4">
            🎲 Shuffle & Randomize
          </Btn>
          <Btn onClick={() => setSortOrder("asc")} variant="outline" className="!px-3 !text-xs">
            Sort A-Z
          </Btn>
          <Btn onClick={() => setSortOrder("desc")} variant="outline" className="!px-3 !text-xs">
            Sort Z-A
          </Btn>
        </div>

        <Field
          label={`Pick Random Sample Count (${pickCount === 0 ? "All Items" : `Pick ${pickCount}`})`}
          hint="0 means keep all items in shuffled order"
        >
          <Range
            value={pickCount}
            onChange={setPickCount}
            min={0}
            max={Math.max(1, parsedItems.length)}
            step={1}
          />
        </Field>

        <div className="grid grid-cols-2 gap-3">
          <Toggle checked={trimItems} onChange={setTrimItems} label="Trim Spaces" />
          <Toggle checked={removeEmpty} onChange={setRemoveEmpty} label="Remove Empty Lines" />
          <Toggle checked={uniqueOnly} onChange={setUniqueOnly} label="Remove Duplicates" />
          <Toggle checked={addNumbers} onChange={setAddNumbers} label="Add Line Numbers" />
        </div>

        <Field label="Quick Presets">
          <div className="flex gap-2">
            <Btn onClick={() => loadSamplePreset("names")} variant="outline" className="!px-3 !py-1 !text-xs">
              Names
            </Btn>
            <Btn onClick={() => loadSamplePreset("numbers")} variant="outline" className="!px-3 !py-1 !text-xs">
              1-20 Items
            </Btn>
            <Btn onClick={() => loadSamplePreset("days")} variant="outline" className="!px-3 !py-1 !text-xs">
              Days of Week
            </Btn>
          </div>
        </Field>
      </div>
    </ToolShell>
  );
}
