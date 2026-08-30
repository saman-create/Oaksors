import { useCallback, useRef, useState, type FormEvent } from "react";
import { ApiError, submitCrmForm, type CrmEndpoint } from "@/services/crmApi";

export type SubmissionPhase = "idle" | "submitting" | "success" | "duplicate" | "rate-limited" | "error";

function stableSerialize(value: unknown): string {
  if (Array.isArray(value)) return `[${value.map(stableSerialize).join(",")}]`;
  if (value && typeof value === "object") return `{${Object.entries(value as Record<string, unknown>).sort(([a], [b]) => a.localeCompare(b)).map(([key, item]) => `${JSON.stringify(key)}:${stableSerialize(item)}`).join(",")}}`;
  return JSON.stringify(value);
}

function createRequestId(): string {
  if (typeof crypto.randomUUID === "function") return crypto.randomUUID();
  const bytes = crypto.getRandomValues(new Uint8Array(16));
  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("").replace(/^(........)(....)(....)(....)(............)$/, "$1-$2-$3-$4-$5");
}

type FormControl = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;

function isFormControl(target: EventTarget): target is FormControl {
  return target instanceof HTMLInputElement || target instanceof HTMLSelectElement || target instanceof HTMLTextAreaElement;
}

function getFieldName(control: FormControl) {
  return control.dataset.validationField || control.name;
}

function getFieldLabel(control: FormControl) {
  const explicitLabel = control.dataset.validationLabel || control.getAttribute("aria-label");
  if (explicitLabel) return explicitLabel;
  const label = control.labels?.[0];
  const visibleLabel = label?.querySelector(":scope > span")?.textContent?.trim();
  return visibleLabel || control.name || "This field";
}

function getValidationMessage(control: FormControl) {
  if (control.dataset.validationMessage) return control.dataset.validationMessage;
  const label = getFieldLabel(control);
  if (control.validity.valueMissing) return `${label} is required.`;
  if (control.validity.typeMismatch && control instanceof HTMLInputElement && control.type === "email") return "Enter a valid email address.";
  if (control.validity.patternMismatch) return control.title || `Enter a valid ${label.toLowerCase()}.`;
  if (control.validity.tooShort) return `${label} is too short.`;
  if (control.validity.tooLong) return `${label} is too long.`;
  return `Enter a valid ${label.toLowerCase()}.`;
}

export function useCrmSubmission(endpoint: CrmEndpoint) {
  const [phase, setPhase] = useState<SubmissionPhase>("idle");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const logicalRequest = useRef<{ fingerprint: string; key: string } | null>(null);

  const submit = useCallback(async <T extends object>(payload: T) => {
    const fingerprint = stableSerialize(payload);
    if (logicalRequest.current?.fingerprint !== fingerprint) logicalRequest.current = { fingerprint, key: createRequestId() };
    setPhase("submitting");
    setFieldErrors({});
    try {
      await submitCrmForm(endpoint, payload, logicalRequest.current.key);
      setPhase("success");
      logicalRequest.current = null;
      return true;
    } catch (error) {
      if (error instanceof ApiError) {
        setFieldErrors(error.fieldErrors);
        const hasFieldErrors = Object.keys(error.fieldErrors).length > 0;
        setPhase(error.status === 409 ? "duplicate" : error.status === 429 ? "rate-limited" : hasFieldErrors ? "idle" : "error");
      } else setPhase("error");
      return false;
    }
  }, [endpoint]);

  const setClientErrors = useCallback((errors: Record<string, string>) => {
    setFieldErrors((current) => ({ ...current, ...errors }));
    setPhase("idle");
  }, []);
  const clearFieldError = useCallback((name: string) => {
    if (!name) return;
    setFieldErrors((current) => {
      if (!(name in current)) return current;
      const next = { ...current };
      delete next[name];
      return next;
    });
  }, []);
  const handleInvalid = useCallback((event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!isFormControl(event.target)) return;
    const name = getFieldName(event.target);
    if (name) setClientErrors({ [name]: getValidationMessage(event.target) });
  }, [setClientErrors]);
  const handleInput = useCallback((event: FormEvent<HTMLFormElement>) => {
    if (!isFormControl(event.target)) return;
    clearFieldError(getFieldName(event.target));
  }, [clearFieldError]);
  const clearFeedback = useCallback(() => { if (phase !== "submitting") { setPhase("idle"); setFieldErrors({}); } }, [phase]);

  return { phase, fieldErrors, submit, setClientErrors, clearFieldError, handleInvalid, handleInput, clearFeedback, isSubmitting: phase === "submitting" };
}
