import type { InputHTMLAttributes, ReactNode, TextareaHTMLAttributes } from "react";

type FormFieldProps = {
  label: string;
  children?: ReactNode;
  full?: boolean;
} & InputHTMLAttributes<HTMLInputElement>;

export function FormField({ label, children, full = false, ...inputProps }: FormFieldProps) {
  const id = inputProps.id ?? inputProps.name;
  return (
    <label className={full ? "mp-field mp-field--full" : "mp-field"} htmlFor={id}>
      <span>{label}</span>
      {children ?? <input id={id} {...inputProps} />}
    </label>
  );
}

export function TextAreaField({ label, full = true, ...props }: { label: string; full?: boolean } & TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const id = props.id ?? props.name;
  return (
    <label className={full ? "mp-field mp-field--full" : "mp-field"} htmlFor={id}>
      <span>{label}</span>
      <textarea id={id} rows={5} {...props} />
    </label>
  );
}
