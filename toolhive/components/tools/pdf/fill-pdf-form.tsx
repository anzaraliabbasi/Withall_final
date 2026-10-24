"use client";

import { useState } from "react";
import {
  PDFDocument,
  PDFTextField,
  PDFCheckBox,
  PDFDropdown,
  PDFOptionList,
  PDFRadioGroup,
} from "pdf-lib";
import { ToolShell, FileDrop, Field, TextInput, Select, Toggle, Btn, StatPill } from "@/components/ui/kit";
import { downloadBlob, baseName } from "@/lib/download";

interface FormFieldItem {
  name: string;
  type: "text" | "checkbox" | "dropdown" | "radio" | "other";
  value: string | boolean;
  options?: string[];
}

export default function FillPDFForm() {
  const [file, setFile] = useState<File | null>(null);
  const [buffer, setBuffer] = useState<ArrayBuffer | null>(null);

  const [formFields, setFormFields] = useState<FormFieldItem[]>([]);
  const [flatten, setFlatten] = useState<boolean>(false);

  const [isProcessing, setIsProcessing] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFile = async (files: File[]) => {
    setError(null);
    setStatus(null);
    const selected = files[0];
    if (!selected || (!selected.type.includes("pdf") && !selected.name.endsWith(".pdf"))) {
      setError("Please select a valid PDF file.");
      return;
    }

    try {
      const buf = await selected.arrayBuffer();
      const doc = await PDFDocument.load(buf, { ignoreEncryption: true });
      const form = doc.getForm();
      const fields = form.getFields();

      const extracted: FormFieldItem[] = fields.map((field) => {
        const name = field.getName();

        if (field instanceof PDFTextField) {
          return { name, type: "text", value: field.getText() || "" };
        } else if (field instanceof PDFCheckBox) {
          return { name, type: "checkbox", value: field.isChecked() };
        } else if (field instanceof PDFDropdown) {
          const selectedOpts = field.getSelected();
          return {
            name,
            type: "dropdown",
            value: selectedOpts.length > 0 ? selectedOpts[0] : "",
            options: field.getOptions(),
          };
        } else if (field instanceof PDFOptionList) {
          const selectedOpts = field.getSelected();
          return {
            name,
            type: "dropdown",
            value: selectedOpts.length > 0 ? selectedOpts[0] : "",
            options: field.getOptions(),
          };
        } else if (field instanceof PDFRadioGroup) {
          const sel = field.getSelected();
          return {
            name,
            type: "radio",
            value: sel || "",
            options: field.getOptions(),
          };
        }
        return { name, type: "other", value: "" };
      });

      setFile(selected);
      setBuffer(buf);
      setFormFields(extracted);

      if (extracted.length === 0) {
        setStatus("PDF loaded successfully, but no fillable form fields were detected.");
      } else {
        setStatus(`Found ${extracted.length} fillable form field${extracted.length > 1 ? "s" : ""}.`);
      }
    } catch (err) {
      console.error(err);
      setError("Failed to read PDF form structure.");
    }
  };

  const updateFieldValue = (name: string, value: string | boolean) => {
    setFormFields((prev) =>
      prev.map((f) => (f.name === name ? { ...f, value } : f))
    );
  };

  const saveFilledPDF = async () => {
    if (!buffer || !file || formFields.length === 0) {
      setError("No fillable PDF form is currently loaded.");
      return;
    }

    setIsProcessing(true);
    setError(null);
    setStatus("Filling PDF form fields...");

    try {
      const doc = await PDFDocument.load(buffer, { ignoreEncryption: true });
      const form = doc.getForm();

      for (const fieldState of formFields) {
        try {
          if (fieldState.type === "text") {
            const tf = form.getTextField(fieldState.name);
            tf.setText(String(fieldState.value));
          } else if (fieldState.type === "checkbox") {
            const cb = form.getCheckBox(fieldState.name);
            if (fieldState.value) cb.check();
            else cb.uncheck();
          } else if (fieldState.type === "dropdown") {
            const dd = form.getDropdown(fieldState.name);
            if (typeof fieldState.value === "string" && fieldState.value) {
              dd.select(fieldState.value);
            }
          } else if (fieldState.type === "radio") {
            const rg = form.getRadioGroup(fieldState.name);
            if (typeof fieldState.value === "string" && fieldState.value) {
              rg.select(fieldState.value);
            }
          }
        } catch (fieldErr) {
          console.warn(`Could not update field "${fieldState.name}":`, fieldErr);
        }
      }

      if (flatten) {
        form.flatten();
      }

      const filledBytes = await doc.save();
      const outName = `${baseName(file.name)}-filled.pdf`;
      downloadBlob(new Blob([filledBytes as unknown as BlobPart], { type: "application/pdf" }), outName);
      setStatus("Successfully filled PDF form and saved document.");
    } catch (err) {
      console.error(err);
      setError("Failed to generate filled PDF document.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <ToolShell
      side={
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <StatPill label="File Loaded" value={file ? "Yes" : "No"} />
            <StatPill label="Form Fields" value={formFields.length} />
          </div>

          <div className="space-y-3 rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950">
            <h3 className="text-xs font-semibold uppercase text-slate-500">Save Options</h3>
            <Toggle
              checked={flatten}
              onChange={setFlatten}
              label="Flatten Form Fields (Make read-only)"
            />
            <p className="text-[11px] text-slate-400">
              Flattening bakes input text directly into the PDF pages so fields can no longer be edited.
            </p>
          </div>

          <Btn onClick={saveFilledPDF} disabled={!file || formFields.length === 0 || isProcessing} className="w-full">
            {isProcessing ? "Processing..." : "Save Filled PDF"}
          </Btn>

          {status ? <p className="text-xs text-emerald-600 font-medium">{status}</p> : null}
          {error ? <p className="text-xs text-rose-500 font-medium">{error}</p> : null}
        </div>
      }
    >
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">Fill PDF Form</h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Parse interactive AcroForm fields (text boxes, checkboxes, radio buttons, dropdowns), fill in values, and save the PDF.
        </p>

        <FileDrop
          accept=".pdf,application/pdf"
          multiple={false}
          onFiles={handleFile}
          label="Drop PDF form file here or click to browse"
        />

        {file && formFields.length === 0 && (
          <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-xs text-amber-800 dark:border-amber-900/40 dark:bg-amber-950/30 dark:text-amber-300">
            <p className="font-semibold">No interactive form fields found.</p>
            <p className="mt-1 opacity-90">
              This PDF does not contain AcroForm interactive input elements. To overlay text on standard PDF pages, try our <strong>Add Text to PDF</strong> tool.
            </p>
          </div>
        )}

        {formFields.length > 0 && (
          <div className="space-y-4 rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950">
            <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Form Fields ({formFields.length})
            </h3>

            <div className="max-h-96 space-y-3 overflow-y-auto pr-1">
              {formFields.map((field) => (
                <div
                  key={field.name}
                  className="rounded-lg border border-slate-200 bg-white p-3 shadow-sm dark:border-slate-800 dark:bg-slate-900"
                >
                  <Field label={field.name}>
                    {field.type === "text" && (
                      <TextInput
                        value={String(field.value)}
                        onChange={(val) => updateFieldValue(field.name, val)}
                        placeholder={`Enter ${field.name}...`}
                      />
                    )}

                    {field.type === "checkbox" && (
                      <Toggle
                        checked={Boolean(field.value)}
                        onChange={(val) => updateFieldValue(field.name, val)}
                        label={field.name}
                      />
                    )}

                    {(field.type === "dropdown" || field.type === "radio") && (
                      <Select
                        value={String(field.value)}
                        onChange={(val) => updateFieldValue(field.name, val)}
                        options={(field.options || []).map((opt) => ({
                          value: opt,
                          label: opt || "-- Select --",
                        }))}
                      />
                    )}

                    {field.type === "other" && (
                      <TextInput
                        value={String(field.value)}
                        onChange={(val) => updateFieldValue(field.name, val)}
                      />
                    )}
                  </Field>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </ToolShell>
  );
}
