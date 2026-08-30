import { fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { QualificationSection } from "@/components/sections/QualificationSection";

afterEach(() => vi.unstubAllGlobals());

describe("QualificationSection", () => {
  it("submits the live qualification payload from the home page", async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response(JSON.stringify({ submission: { id: "q1", status: "received" } }), { status: 201 }));
    vi.stubGlobal("fetch", fetchMock);
    render(<QualificationSection />);
    fireEvent.change(screen.getByLabelText("First name"), { target: { value: "Jane" } });
    fireEvent.change(screen.getByLabelText("Last name"), { target: { value: "Doe" } });
    fireEvent.change(screen.getByLabelText("Cell phone"), { target: { value: "+15551234567" } });
    fireEvent.change(screen.getByLabelText("Email Address"), { target: { value: "jane@example.com" } });
    fireEvent.change(screen.getByLabelText("Retirement status"), { target: { value: "retired" } });
    fireEvent.change(screen.getByLabelText("Birth month"), { target: { value: "01" } });
    fireEvent.change(screen.getByLabelText("Birth day"), { target: { value: "01" } });
    fireEvent.change(screen.getByLabelText("Birth year"), { target: { value: "1970" } });
    fireEvent.change(screen.getByLabelText(/describe your portfolio/i), { target: { value: "Traditional IRA worth approximately $250,000." } });
    fireEvent.change(screen.getByLabelText(/biggest concerns/i), { target: { value: "Inflation and long-term diversification." } });
    fireEvent.click(screen.getByLabelText(/agree to the privacy notice/i));
    fireEvent.click(screen.getByRole("button", { name: /request information now/i }));
    expect(JSON.parse(String((fetchMock.mock.calls[0][1] as RequestInit).body))).toEqual({ firstName: "Jane", lastName: "Doe", phone: "+15551234567", email: "jane@example.com", retired: "retired", dob: "1970-01-01", portfolio: "Traditional IRA worth approximately $250,000.", concerns: "Inflation and long-term diversification.", sourcePage: "home", privacyConsent: true });
    expect(await screen.findByRole("heading", { name: /your request has been sent/i })).toBeInTheDocument();
    expect(screen.queryByRole("form", { name: /account qualification form/i })).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /send another response/i }));
    expect(screen.getByRole("form", { name: /account qualification form/i })).toBeInTheDocument();
  });

  it("uses the shared primary form action styling", () => {
    vi.stubGlobal("fetch", vi.fn());
    render(<QualificationSection />);
    expect(screen.getByRole("button", { name: /request information now/i })).toHaveClass("form-submit-button");
  });

  it("shows select validation beside the incorrect field without an API warning", () => {
    vi.stubGlobal("fetch", vi.fn());
    render(<QualificationSection />);

    fireEvent.invalid(screen.getByLabelText("Retirement status"));

    expect(screen.getByText("Retirement status is required.")).toBeInTheDocument();
    expect(screen.queryByText(/we couldn't submit the form/i)).not.toBeInTheDocument();
  });
});
