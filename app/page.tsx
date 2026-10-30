"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";
import ParchiForm from "@/components/parchi/parchi-form";
import ParchiPreview, {
  type ParchiPreviewHandle,
} from "@/components/parchi/parchi-preview";
import ParchiActions from "@/components/parchi/parchi-actions";
import { getCurrentDay, getCurrentDate, capitalizeWords } from "@/lib/parchi-utils";

export default function Page() {
  const previewRef = useRef<ParchiPreviewHandle>(null);

  // Initialize with empty strings — will set day/date client-side via useEffect
  const [values, setValues] = useState<Record<string, string>>({
    day: "",
    date: "",
    mukam: "",
    talim: "",
    sifat: "",
    istekbal: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Set day and date on client side only (avoid hydration mismatch)
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setValues((prev) => ({
      ...prev,
      day: getCurrentDay(),
      date: getCurrentDate(),
    }));
  }, []);

  const handleChange = useCallback((field: string, value: string) => {
    const formattedValue = field !== "date" ? capitalizeWords(value) : value;
    setValues((prev) => ({ ...prev, [field]: formattedValue }));
    // Clear error on edit
    setErrors((prev) => {
      if (prev[field]) {
        const next = { ...prev };
        delete next[field];
        return next;
      }
      return prev;
    });
  }, []);

  const validate = useCallback((): boolean => {
    setErrors({});
    return true;
  }, []);

  const handleClear = useCallback(() => {
    setValues({
      day: getCurrentDay(),
      date: getCurrentDate(),
      mukam: "",
      talim: "",
      sifat: "",
      istekbal: "",
    });
    setErrors({});
    toast.success("Form cleared");
  }, []);

  return (
    <div className="min-h-svh bg-[#faf8f2]">
      {/* Header */}
      <header className="py-6 text-center">
        <h1 className="text-2xl font-bold text-emerald-700 md:text-3xl">
          Noorani Masjid Parchi Generator
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Daily Urdu Parchi Maker
        </p>
        <Separator className="mx-auto mt-4 w-14 bg-emerald-700/50" />
      </header>

      {/* Main grid */}
      <main className="mx-auto grid max-w-[1180px] gap-5 px-4 pb-10 md:grid-cols-[380px_1fr] md:items-start">
        {/* Left: Form + Actions */}
        <div className="space-y-5">
          <ParchiForm values={values} errors={errors} onChange={handleChange} />

          <ParchiActions
            getCanvas={() => previewRef.current?.getCanvas() ?? null}
            redraw={async () => {
              await previewRef.current?.redraw();
            }}
            validate={validate}
            onClear={handleClear}
          />
        </div>

        {/* Right: Preview (sticky on desktop) */}
        <div className="md:sticky md:top-4">
          <ParchiPreview ref={previewRef} values={values} />
        </div>
      </main>
    </div>
  );
}
