export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 5000);
}

export function downloadText(text: string, filename: string, mime = "text/plain") {
  downloadBlob(new Blob([text], { type: mime }), filename);
}

export function baseName(name: string) {
  return name.replace(/\.[^.]+$/, "");
}

export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}
