import type { ToolEntry } from "./tools";
import { SITE_NAME } from "./tools";

const catNoun: Record<string, string> = {
  text: "text",
  image: "image",
  pdf: "PDF",
  social: "social media",
  security: "security",
  coding: "coding",
  css: "CSS",
  color: "color",
  misc: "utility",
};

const catBlurb: Record<string, string> = {
  text: "Text is what the web is made of. These tools transform, count and clean text instantly.",
  image: "Your images never leave your device: every crop, resize and filter runs locally in your browser.",
  pdf: "Full-powered PDF editing without uploads, accounts or page limits — your files stay yours.",
  social: "Build pixel-credible mockups for posts, chats and stories, then download them as images.",
  security: "Hash a string, verify a checksum or forge a strong password — computed locally, instantly.",
  coding: "Format, minify and inspect code and data without pasting it into a stranger's server.",
  css: "Skip the docs-diving: tune a live preview, copy production-ready CSS in one click.",
  color: "Convert, mix and explore colors and palettes for any design.",
  misc: "The little helpers that deserve a home too.",
};

export function toolIntro(t: ToolEntry): string {
  return `${t.name} is a free online tool in the ${SITE_NAME} toolbox. It runs entirely in your browser, works on any device, has no usage limits and never uploads your data. ${catBlurb[t.category] ?? ""}`;
}

export function toolHowTo(t: ToolEntry): string[] {
  return [
    `Open ${t.name} — no sign-up or installation is needed.`,
    `Enter your ${catNoun[t.category] ?? "input"} into the tool's input area.`,
    `Watch the result update instantly as you type or change settings.`,
    `Copy or download the result in the format you need.`,
  ];
}

export interface QA {
  q: string;
  a: string;
}

const commonFaqs: QA[] = [
  {
    q: "Is this tool really free?",
    a: `Yes. Every tool in ${SITE_NAME} is completely free, with no usage caps, accounts or watermarks.`,
  },
  {
    q: "Do you upload or store my data?",
    a: "No. This tool processes your input entirely inside your browser. Nothing is sent to, or stored on, a server.",
  },
  {
    q: "Does it work on mobile?",
    a: "Yes, the tools are fully responsive and work on phones, tablets and desktops.",
  },
];

const catFaqs: Record<string, QA[]> = {
  pdf: [
    {
      q: "Are my PDF files uploaded anywhere?",
      a: "Never. Merging, splitting and editing all happen locally with the browser's own engine. You can even disconnect from the internet mid-edit.",
    },
    {
      q: "Is there a page or file size limit?",
      a: "No artificial limits — the practical limit is your device's memory, so very large PDFs may be slower on phones.",
    },
  ],
  security: [
    {
      q: "Are the hashes produced here safe for passwords?",
      a: "MD5 and SHA are fast checksum hashes and are NOT safe for storing passwords — use a dedicated password hash like bcrypt or Argon2 for that. They are perfect for verifying file checksums and signatures.",
    },
  ],
  social: [
    {
      q: "Can I use these mockups commercially?",
      a: "Mockups you create are yours. The designs imitate well-known layouts for parody, illustration, education and design purposes — do not use them to deceive or impersonate real people.",
    },
  ],
  image: [
    {
      q: "What happens to my original image?",
      a: "Nothing — the tool always works on a copy in memory. Your original file stays untouched on your device.",
    },
  ],
};

export function toolFaqs(t: ToolEntry): QA[] {
  return [...commonFaqs, ...(catFaqs[t.category] ?? [])];
}
