import { afterEach, describe, expect, it, vi } from "vitest";
import { ApiError, submitCrmForm } from "@/services/crmApi";

afterEach(() => vi.unstubAllGlobals());

describe("CRM API", () => {
  const payload = { firstName: "Jane", lastName: "Doe", email: "jane@example.com", subject: "Request", message: "Please send information.", sourcePage: "contact" as const, privacyConsent: true };

  it("posts JSON with an idempotency key and parses the receipt", async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response(JSON.stringify({ submission: { id: "submission-1", status: "received" }, requestId: "request-1" }), { status: 201 }));
    vi.stubGlobal("fetch", fetchMock);
    await expect(submitCrmForm("email-submissions", payload, "request-123")).resolves.toEqual({ submission: { id: "submission-1", status: "received" }, requestId: "request-1" });
    expect(fetchMock).toHaveBeenCalledWith("https://oaksorscrm.web.app/api/crm/email-submissions", expect.objectContaining({ method: "POST", headers: expect.objectContaining({ "Content-Type": "application/json", "Idempotency-Key": "request-123" }), body: JSON.stringify(payload) }));
  });

  it.each([[409, "duplicate"], [429, "rate_limited"], [500, "server_error"]])("preserves status %i and safe error code", async (status, code) => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response(JSON.stringify({ error: { code, message: "Safe message" }, requestId: "r1" }), { status })));
    await expect(submitCrmForm("email-submissions", payload, "key")).rejects.toMatchObject({ status, code });
  });

  it("exposes field errors from validation responses", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response(JSON.stringify({ error: { code: "validation_error", message: "Check the form", fields: { email: "Enter a valid email." } }, requestId: "r1" }), { status: 422 })));
    await expect(submitCrmForm("email-submissions", payload, "key")).rejects.toMatchObject({ status: 422, fieldErrors: { email: "Enter a valid email." } });
  });

  it("turns a network failure into a safe ApiError", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new TypeError("offline")));
    await expect(submitCrmForm("email-submissions", payload, "key")).rejects.toBeInstanceOf(ApiError);
  });
});
