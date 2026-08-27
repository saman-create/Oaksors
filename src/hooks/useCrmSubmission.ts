import { useCallback, useRef, useState } from "react";
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
        setPhase(error.status === 409 ? "duplicate" : error.status === 429 ? "rate-limited" : "error");
      } else setPhase("error");
      return false;
    }
  }, [endpoint]);

  const setClientErrors = useCallback((errors: Record<string, string>) => { setFieldErrors(errors); setPhase("error"); }, []);
  const clearFeedback = useCallback(() => { if (phase !== "submitting") { setPhase("idle"); setFieldErrors({}); } }, [phase]);

  return { phase, fieldErrors, submit, setClientErrors, clearFeedback, isSubmitting: phase === "submitting" };
}
