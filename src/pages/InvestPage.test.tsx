import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { afterEach, describe, expect, it, vi } from "vitest";
import { InvestPage } from "@/pages/InvestPage";

vi.mock("@/components/effects/FloatingLines", () => ({
  default: () => null,
}));

afterEach(() => vi.unstubAllGlobals());

function renderPage() {
  return render(<MemoryRouter><InvestPage /></MemoryRouter>);
}

describe("InvestPage", () => {
  it("presents the complete investment lead journey", () => {
    vi.stubGlobal("fetch", vi.fn());
    renderPage();

    expect(screen.getByRole("heading", { level: 1, name: /a more tangible path for your retirement/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /guidance built around your next move/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /a clear path from questions to next steps/i })).toBeInTheDocument();
    expect(screen.getAllByRole("link", { name: /start the conversation/i }).every((link) => link.getAttribute("href") === "#invest-lead-form")).toBe(true);
  });

  it("submits the public lead API contract and shows clear success feedback", async () => {
    const user = userEvent.setup();
    const fetchMock = vi.fn().mockResolvedValue(new Response(JSON.stringify({ submission: { id: "lead-1", status: "received" } }), { status: 201 }));
    vi.stubGlobal("fetch", fetchMock);
    renderPage();

    await user.type(screen.getByLabelText("First name"), "Jane");
    await user.type(screen.getByLabelText("Last name"), "Doe");
    await user.type(screen.getByLabelText("Email address"), "jane@example.com");
    await user.type(screen.getByLabelText("Cell phone"), "+15551234567");
    await user.type(screen.getByLabelText("Anything else we should know? (optional)"), "Please contact me in the afternoon.");
    await user.click(screen.getByLabelText(/agree to the privacy notice/i));
    await user.click(screen.getByRole("button", { name: /request information/i }));

    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(url).toBe("https://oaksorscrm.web.app/api/crm/lead-submissions");
    expect(init.headers).toEqual(expect.objectContaining({ "Content-Type": "application/json", "Idempotency-Key": expect.any(String) }));
    expect(JSON.parse(String(init.body))).toEqual({
      firstName: "Jane",
      lastName: "Doe",
      email: "jane@example.com",
      phone: "+15551234567",
      message: "Please contact me in the afternoon.",
      sourcePage: "invest",
      privacyConsent: true,
    });
    expect(await screen.findByRole("heading", { name: /your request has been received/i })).toBeInTheDocument();
    expect(screen.queryByRole("form", { name: /request precious metals information/i })).not.toBeInTheDocument();
  });

  it("shows API validation beside the relevant field without a generic failure", async () => {
    const user = userEvent.setup();
    const fetchMock = vi.fn().mockResolvedValue(new Response(JSON.stringify({ error: { code: "validation_error", message: "Review the highlighted fields.", fields: { phone: "Enter a valid phone number." } } }), { status: 422 }));
    vi.stubGlobal("fetch", fetchMock);
    renderPage();

    await user.type(screen.getByLabelText("First name"), "Jane");
    await user.type(screen.getByLabelText("Last name"), "Doe");
    await user.type(screen.getByLabelText("Email address"), "jane@example.com");
    await user.type(screen.getByLabelText("Cell phone"), "123");
    await user.click(screen.getByLabelText(/agree to the privacy notice/i));
    await user.click(screen.getByRole("button", { name: /request information/i }));

    expect(await screen.findByText("Enter a valid phone number.")).toBeInTheDocument();
    expect(screen.queryByText(/we couldn't submit the form/i)).not.toBeInTheDocument();
  });
});
