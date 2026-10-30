"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface ParchiFormProps {
  values: Record<string, string>;
  errors: Record<string, string>;
  onChange: (field: string, value: string) => void;
}

const DAYS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const NAME_FIELDS = [
  {
    key: "mukam",
    labelEn: "Mukam",
    labelUr: "مقام",
    placeholder: "Name of host",
  },
  {
    key: "talim",
    labelEn: "Talim",
    labelUr: "تعلیم",
    placeholder: "Name",
  },
  {
    key: "sifat",
    labelEn: "6 Sifat",
    labelUr: "چھ صفات",
    placeholder: "Name",
  },
  {
    key: "istekbal",
    labelEn: "Istekbal",
    labelUr: "استقبال",
    placeholder: "Name",
  },
];

function parseDateString(dateStr: string): Date | undefined {
  if (!dateStr) return undefined;
  const parts = dateStr.split("/");
  if (parts.length === 3) {
    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1;
    const year = parseInt(parts[2], 10);
    const d = new Date(year, month, day);
    if (!isNaN(d.getTime())) return d;
  }
  return undefined;
}

function formatDateString(d: Date): string {
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = d.getFullYear();
  return `${dd}/${mm}/${yyyy}`;
}

export default function ParchiForm({ values, errors, onChange }: ParchiFormProps) {
  const [calendarOpen, setCalendarOpen] = useState(false);
  const selectedDate = parseDateString(values.date);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Today&apos;s Details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Day Dropdown */}
        <div className="space-y-1.5">
          <Label
            htmlFor="day-select"
            className="flex items-center justify-between text-sm font-semibold"
          >
            <span>Day</span>
            <span
              className="font-normal text-emerald-700"
              style={{ fontFamily: '"Noto Nastaliq Urdu", serif' }}
            >
              دن
            </span>
          </Label>
          <Select
            value={values.day || ""}
            onValueChange={(val) => onChange("day", val)}
          >
            <SelectTrigger
              id="day-select"
              className="w-full h-9 bg-transparent"
              style={{ fontFamily: '"Manrope", var(--font-sans), sans-serif' }}
            >
              <SelectValue placeholder="Select day" />
            </SelectTrigger>
            <SelectContent
              style={{ fontFamily: '"Manrope", var(--font-sans), sans-serif' }}
            >
              {DAYS.map((day) => (
                <SelectItem key={day} value={day}>
                  {day}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Date Picker */}
        <div className="space-y-1.5">
          <Label
            htmlFor="date-picker"
            className="flex items-center justify-between text-sm font-semibold"
          >
            <span>Date</span>
            <span
              className="font-normal text-emerald-700"
              style={{ fontFamily: '"Noto Nastaliq Urdu", serif' }}
            >
              تاریخ
            </span>
          </Label>
          <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
            <PopoverTrigger asChild>
              <Button
                id="date-picker"
                variant="outline"
                className={cn(
                  "w-full h-9 justify-start text-left font-normal border-input bg-transparent",
                  !values.date && "text-muted-foreground"
                )}
                style={{ fontFamily: '"Manrope", var(--font-sans), sans-serif' }}
              >
                <CalendarIcon className="mr-2 size-4 text-emerald-700" />
                {values.date ? values.date : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(d) => {
                  if (d) {
                    onChange("date", formatDateString(d));
                    onChange("day", DAYS[d.getDay()]);
                    setCalendarOpen(false);
                  }
                }}
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Name Fields */}
        {NAME_FIELDS.map((field) => (
          <div key={field.key} className="space-y-1.5">
            <Label
              htmlFor={field.key}
              className="flex items-center justify-between text-sm font-semibold"
            >
              <span>{field.labelEn}</span>
              <span
                className="font-normal text-emerald-700"
                style={{ fontFamily: '"Noto Nastaliq Urdu", serif' }}
              >
                {field.labelUr}
              </span>
            </Label>
            <Input
              id={field.key}
              value={values[field.key] ?? ""}
              onChange={(e) => onChange(field.key, e.target.value)}
              placeholder={field.placeholder}
              autoComplete="off"
              autoCapitalize="words"
              aria-invalid={!!errors[field.key]}
              className={cn("capitalize", errors[field.key] ? "border-destructive" : "")}
              style={{ fontFamily: '"Manrope", var(--font-sans), sans-serif' }}
            />
            {errors[field.key] && (
              <p className="text-xs text-destructive">{errors[field.key]}</p>
            )}
          </div>
        ))}

        <p className="text-xs text-muted-foreground">
          Names can be typed in Urdu, Hindi or English. Nothing is saved —
          refreshing the page clears everything.
        </p>
      </CardContent>
    </Card>
  );
}
