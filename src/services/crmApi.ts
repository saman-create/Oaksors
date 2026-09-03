import { ApiError } from "@/services/apiError";
import { PUBLIC_API_BASE } from "@/services/publicApiBase";

export { ApiError } from "@/services/apiError";

export type CrmEndpoint = "qualification-submissions" | "email-submissions" | "retirement-intake-submissions" | "lead-submissions";

export type QualificationSubmission = { firstName: string; lastName: string; phone: string; email: string; retired: "retired" | "not_retired"; dob: string; portfolio: string; concerns: string; sourcePage: "home" | "contact"; privacyConsent: true };
export type EmailSubmission = { firstName: string; lastName: string; email: string; phone?: string; subject: string; message: string; sourcePage: "home" | "contact"; privacyConsent: true };
export type RetirementIntakeSubmission = { firstName: string; lastName: string; dob: string; ssn: string; phone: string; email: string; address: string; married: "married" | "not_married" | "divorced" | "widowed"; portfolioValue: string; accountTypes: string[]; notes?: string; privacyConsent: true };
export type LeadSubmission = { firstName: string; lastName: string; email: string; phone: string; message?: string; sourcePage: "invest"; privacyConsent: true };
export type SubmissionReceipt = { submission: { id: string; status: string }; requestId?: string };

function isObject(value: unknown): value is Record<string, unknown> { return typeof value === "object" && value !== null && !Array.isArray(value); }

export async function submitCrmForm<T extends object>(endpoint: CrmEndpoint, payload: T, idempotencyKey: string): Promise<SubmissionReceipt> {
  const isMultipart = payload instanceof FormData;
  let response: Response;
  try {
    response = await fetch(`${PUBLIC_API_BASE}/api/crm/${endpoint}`, {
      method: "POST",
      headers: { Accept: "application/json", ...(!isMultipart ? { "Content-Type": "application/json" } : {}), "Idempotency-Key": idempotencyKey },
      body: isMultipart ? payload : JSON.stringify(payload),
    });
  } catch { throw new ApiError("We couldn't reach the submission service. Check your connection and try again."); }
  let data: unknown = null;
  try { data = await response.json(); } catch { /* safe status handling below */ }
  if (!response.ok) {
    const error = isObject(data) && isObject(data.error) ? data.error : {};
    const fields = isObject(error.fields) ? Object.fromEntries(Object.entries(error.fields).filter((entry): entry is [string, string] => typeof entry[1] === "string")) : {};
    throw new ApiError(typeof error.message === "string" ? error.message : "Your submission could not be completed.", { status: response.status, code: typeof error.code === "string" ? error.code : "request_failed", fieldErrors: fields });
  }
  if (!isObject(data) || !isObject(data.submission) || typeof data.submission.id !== "string" || typeof data.submission.status !== "string") throw new ApiError("The submission service returned an invalid response.", { status: response.status, code: "invalid_response" });
  return { submission: { id: data.submission.id, status: data.submission.status }, ...(typeof data.requestId === "string" ? { requestId: data.requestId } : {}) };
}
