import type { InputHTMLAttributes, ReactNode, TextareaHTMLAttributes } from "react";

type FormFieldProps = {
  label: string;
  children?: ReactNode;
  full?: boolean;
  error?: string;
} & InputHTMLAttributes<HTMLInputElement>;

export function FormField({ label, children, full = false, error, ...inputProps }: FormFieldProps) {
  const id = inputProps.id ?? inputProps.name;
  return (
    <label className={full ? "mp-field mp-field--full" : "mp-field"} htmlFor={id}>
      <span>{label}{inputProps.required && <span className="mp-required-mark" aria-hidden="true" />}</span>
      {children ?? <input id={id} aria-invalid={Boolean(error)} aria-describedby={error ? `${id}-error` : undefined} {...inputProps} />}
      {error && <small id={`${id}-error`} className="mp-field-error">{error}</small>}
    </label>
  );
}

export function TextAreaField({ label, full = true, error, ...props }: { label: string; full?: boolean; error?: string } & TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const id = props.id ?? props.name;
  return (
    <label className={full ? "mp-field mp-field--full" : "mp-field"} htmlFor={id}>
      <span>{label}{props.required && <span className="mp-required-mark" aria-hidden="true" />}</span>
      <textarea id={id} rows={5} aria-invalid={Boolean(error)} aria-describedby={error ? `${id}-error` : undefined} {...props} />
      {error && <small id={`${id}-error`} className="mp-field-error">{error}</small>}
    </label>
  );
}
