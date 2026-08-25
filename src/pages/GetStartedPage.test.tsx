import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { afterEach, describe, expect, it, vi } from "vitest";
import { GetStartedPage } from "@/pages/GetStartedPage";

afterEach(() => vi.unstubAllGlobals());

describe("GetStartedPage", () => {
  it("submits only the safe retirement intake fields", async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response(JSON.stringify({ submission: { id: "r1", status: "received" } }), { status: 201 }));
    vi.stubGlobal("fetch", fetchMock);
    render(<MemoryRouter><GetStartedPage /></MemoryRouter>);
    expect(screen.queryByLabelText(/tax id|ssn/i)).not.toBeInTheDocument();
    expect(document.querySelector('input[type="password"], input[type="file"]')).toBeNull();
    fireEvent.change(screen.getByLabelText("First name"), { target: { value: "Jane" } });
    fireEvent.change(screen.getByLabelText("Last name"), { target: { value: "Doe" } });
    fireEvent.change(screen.getByLabelText("Date of birth"), { target: { value: "1970-01-01" } });
    fireEvent.change(screen.getByLabelText("Cell phone"), { target: { value: "+15551234567" } });
    fireEvent.change(screen.getByLabelText("Email address"), { target: { value: "jane@example.com" } });
    fireEvent.change(screen.getByLabelText("Full address"), { target: { value: "111 Main Street, Long Beach, CA" } });
    fireEvent.change(screen.getByLabelText("Marital status"), { target: { value: "married" } });
    fireEvent.change(screen.getByLabelText("Approximate portfolio value"), { target: { value: "250000-500000" } });
    fireEvent.click(screen.getByLabelText("Traditional IRA"));
    fireEvent.click(screen.getByLabelText(/agree to the privacy notice/i));
    fireEvent.click(screen.getByRole("button", { name: /submit retirement intake/i }));
    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1));
    const body = JSON.parse(String((fetchMock.mock.calls[0][1] as RequestInit).body));
    expect(body).toMatchObject({ married: "married", portfolioValue: "250000-500000", accountTypes: ["Traditional IRA"], privacyConsent: true });
    expect(body).not.toHaveProperty("taxId");
    expect(body).not.toHaveProperty("statement");
  });
});
