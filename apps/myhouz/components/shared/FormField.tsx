"use client";

import { Input } from "@home/ui";
import { cn } from "@home/ui";

interface FormFieldProps {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  defaultValue?: string;
  error?: string;
  required?: boolean;
  className?: string;
}

export function FormField({
  label,
  name,
  type = "text",
  placeholder,
  defaultValue,
  error,
  required,
  className,
}: FormFieldProps) {
  return (
    <div className={cn("space-y-1.5", className)}>
      <label htmlFor={name} className="text-sm font-medium">
        {label}
        {required && <span className="text-destructive"> *</span>}
      </label>
      <Input
        id={name}
        name={name}
        type={type}
        placeholder={placeholder}
        defaultValue={defaultValue}
        required={required}
      />
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
