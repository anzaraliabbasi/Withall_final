"use client";

import { registry } from "./registry";
import ComingSoon from "./ComingSoon";

export default function ToolRenderer({ slug }: { slug: string }) {
  const C = registry[slug] ?? ComingSoon;
  return <C />;
}
