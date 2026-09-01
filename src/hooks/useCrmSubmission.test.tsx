import { act, renderHook } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { useCrmSubmission } from "@/hooks/useCrmSubmission";

afterEach(() => vi.unstubAllGlobals());

const payload = { firstName: "Jane", email: "jane@example.com", privacyConsent: true };

describe("useCrmSubmission", () => {
  it("reuses the key for an unchanged failed retry and changes it for changed data", async () => {
    const requests: RequestInit[] = [];
    vi.stubGlobal("fetch", vi.fn(async (_url: string, init: RequestInit) => {
      requests.push(init);
      return new Response(JSON.stringify({ error: { code: "server_error", message: "Try again" } }), { status: 500 });
    }));
    const { result } = renderHook(() => useCrmSubmission("email-submissions"));
    await act(() => result.current.submit(payload));
    await act(() => result.current.submit(payload));
    await act(() => result.current.submit({ ...payload, firstName: "Janet" }));

    const keys = requests.map((request) => (request.headers as Record<string, string>)["Idempotency-Key"]);
    expect(keys[0]).toBe(keys[1]);
    expect(keys[2]).not.toBe(keys[1]);
  });

  it("maps success, duplicate, and validation responses to useful UI state", async () => {
    const responses = [
      new Response(JSON.stringify({ submission: { id: "one", status: "received" } }), { status: 201 }),
      new Response(JSON.stringify({ error: { code: "duplicate", message: "Already received" } }), { status: 409 }),
      new Response(JSON.stringify({ error: { code: "validation_error", message: "Check fields", fields: { email: "Enter a valid email." } } }), { status: 422 }),
    ];
    vi.stubGlobal("fetch", vi.fn(async () => responses.shift()));
    const { result } = renderHook(() => useCrmSubmission("email-submissions"));

    await act(() => result.current.submit(payload));
    expect(result.current.phase).toBe("success");
    await act(() => result.current.submit({ ...payload, firstName: "Janet" }));
    expect(result.current.phase).toBe("duplicate");
    await act(() => result.current.submit({ ...payload, firstName: "June" }));
    expect(result.current.phase).toBe("idle");
    expect(result.current.fieldErrors).toEqual({ email: "Enter a valid email." });
  });

  it("changes the idempotency key when multipart attachment metadata changes", async () => {
    const requests: RequestInit[] = [];
    vi.stubGlobal("fetch", vi.fn(async (_url: string, init: RequestInit) => {
      requests.push(init);
      return new Response(JSON.stringify({ error: { code: "server_error", message: "Try again" } }), { status: 500 });
    }));
    const { result } = renderHook(() => useCrmSubmission("retirement-intake-submissions"));
    const first = new FormData();
    first.append("payload", JSON.stringify(payload));
    first.append("attachments", new File(["one"], "first.pdf", { type: "application/pdf", lastModified: 1 }));
    const second = new FormData();
    second.append("payload", JSON.stringify(payload));
    second.append("attachments", new File(["two"], "second.pdf", { type: "application/pdf", lastModified: 2 }));

    await act(() => result.current.submit(first));
    await act(() => result.current.submit(first));
    await act(() => result.current.submit(second));

    const keys = requests.map((request) => (request.headers as Record<string, string>)["Idempotency-Key"]);
    expect(keys[0]).toBe(keys[1]);
    expect(keys[2]).not.toBe(keys[1]);
  });

  it("distinguishes rate limiting so the UI can ask the visitor to wait", async () => {
    vi.stubGlobal("fetch", vi.fn(async () => new Response(JSON.stringify({ error: { code: "rate_limited", message: "Too many submissions" } }), { status: 429 })));
    const { result } = renderHook(() => useCrmSubmission("email-submissions"));
    await act(() => result.current.submit(payload));
    expect(result.current.phase).toBe("rate-limited");
  });

  it("keeps client validation inline instead of reporting a submission failure", () => {
    vi.stubGlobal("fetch", vi.fn());
    const { result } = renderHook(() => useCrmSubmission("email-submissions"));

    act(() => result.current.setClientErrors({ firstName: "First name is required." }));

    expect(result.current.phase).toBe("idle");
    expect(result.current.fieldErrors).toEqual({ firstName: "First name is required." });
  });
});
