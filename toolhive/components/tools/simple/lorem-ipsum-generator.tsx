"use client";

import { useMemo, useState } from "react";
import { ToolShell, Field, Btn, Select, Range, Toggle, Output } from "@/components/ui/kit";

const LOREM_WORDS = [
  "lorem", "ipsum", "dolor", "sit", "amet", "consectetur", "adipiscing", "elit",
  "sed", "do", "eiusmod", "tempor", "incididunt", "ut", "labore", "et", "dolore",
  "magna", "aliqua", "ut", "enim", "ad", "minim", "veniam", "quis", "nostrud",
  "exercitation", "ullamco", "laboris", "nisi", "ut", "aliquip", "ex", "ea",
  "commodo", "consequat", "duis", "aute", "irure", "dolor", "in", "reprehenderit",
  "in", "voluptate", "velit", "esse", "cillum", "dolore", "eu", "fugiat", "nulla",
  "pariatur", "excepteur", "sint", "occaecat", "cupidatat", "non", "proident",
  "sunt", "in", "culpa", "qui", "officia", "deserunt", "mollit", "anim", "id", "est", "laborum"
];

const STANDARD_START = "Lorem ipsum dolor sit amet, consectetur adipiscing elit.";

type GenerateType = "paragraphs" | "sentences" | "words";

export default function LoremIpsumGenerator() {
  const [type, setType] = useState<GenerateType>("paragraphs");
  const [count, setCount] = useState(3);
  const [startWithLorem, setStartWithLorem] = useState(true);
  const [asHtml, setAsHtml] = useState(false);

  const getRandomWord = () => LOREM_WORDS[Math.floor(Math.random() * LOREM_WORDS.length)];

  const generateSentence = (wordCount = 8 + Math.floor(Math.random() * 8)) => {
    const words: string[] = [];
    for (let i = 0; i < wordCount; i++) {
      words.push(getRandomWord());
    }
    const raw = words.join(" ");
    return raw.charAt(0).toUpperCase() + raw.slice(1) + ".";
  };

  const generateParagraph = (sentenceCount = 4 + Math.floor(Math.random() * 4)) => {
    const sentences: string[] = [];
    for (let i = 0; i < sentenceCount; i++) {
      sentences.push(generateSentence());
    }
    return sentences.join(" ");
  };

  const generatedText = useMemo(() => {
    let result = "";

    if (type === "words") {
      const words: string[] = [];
      for (let i = 0; i < count; i++) {
        words.push(getRandomWord());
      }
      if (startWithLorem && words.length >= 2) {
        words[0] = "lorem";
        words[1] = "ipsum";
      }
      result = words.join(" ");
    } else if (type === "sentences") {
      const sentences: string[] = [];
      for (let i = 0; i < count; i++) {
        sentences.push(generateSentence());
      }
      if (startWithLorem && sentences.length > 0) {
        sentences[0] = STANDARD_START;
      }
      result = sentences.join(" ");
    } else {
      // Paragraphs
      const paras: string[] = [];
      for (let i = 0; i < count; i++) {
        paras.push(generateParagraph());
      }
      if (startWithLorem && paras.length > 0) {
        paras[0] = STANDARD_START + " " + paras[0].slice(paras[0].indexOf(".") + 2);
      }
      if (asHtml) {
        result = paras.map((p) => `<p>${p}</p>`).join("\n\n");
      } else {
        result = paras.join("\n\n");
      }
    }

    return result;
  }, [type, count, startWithLorem, asHtml]);

  return (
    <ToolShell
      side={
        <div className="space-y-4">
          <Output text={generatedText} label="Generated Lorem Ipsum" filename="lorem-ipsum.txt" />
        </div>
      }
    >
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Field label="Generate Type">
            <Select
              value={type}
              onChange={(v) => setType(v as GenerateType)}
              options={[
                { value: "paragraphs", label: "Paragraphs" },
                { value: "sentences", label: "Sentences" },
                { value: "words", label: "Words" },
              ]}
            />
          </Field>

          <Field label={`Count: ${count}`}>
            <Range value={count} onChange={setCount} min={1} max={type === "words" ? 100 : 20} />
          </Field>
        </div>

        <div className="space-y-2 pt-2">
          <Toggle
            checked={startWithLorem}
            onChange={setStartWithLorem}
            label="Start with 'Lorem ipsum dolor sit amet...'"
          />
          {type === "paragraphs" && (
            <Toggle checked={asHtml} onChange={setAsHtml} label="Wrap paragraphs in <p> tags" />
          )}
        </div>
      </div>
    </ToolShell>
  );
}
