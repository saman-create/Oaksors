import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { afterEach, describe, expect, it, vi } from "vitest";
import { GetStartedPage } from "@/pages/GetStartedPage";

afterEach(() => vi.unstubAllGlobals());

describe("GetStartedPage", () => {
  it("submits the retirement intake fields including the required SSN", async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response(JSON.stringify({ submission: { id: "r1", status: "received" } }), { status: 201 }));
    vi.stubGlobal("fetch", fetchMock);
    render(<MemoryRouter><GetStartedPage /></MemoryRouter>);
    const ssn = screen.getByLabelText("SSN / Tax ID");
    expect(ssn).toHaveAttribute("type", "text");
    expect(ssn).toHaveAttribute("autocomplete", "off");
    expect(document.querySelector('input[type="file"]')).toBeNull();
    fireEvent.change(screen.getByLabelText("First name"), { target: { value: "Jane" } });
    fireEvent.change(screen.getByLabelText("Last name"), { target: { value: "Doe" } });
    fireEvent.change(screen.getByLabelText("Birth month"), { target: { value: "01" } });
    fireEvent.change(screen.getByLabelText("Birth day"), { target: { value: "01" } });
    fireEvent.change(screen.getByLabelText("Birth year"), { target: { value: "1970" } });
    fireEvent.change(ssn, { target: { value: "123-45-6789" } });
    fireEvent.change(screen.getByLabelText("Cell phone"), { target: { value: "+15551234567" } });
    fireEvent.change(screen.getByLabelText("Email address"), { target: { value: "jane@example.com" } });
    fireEvent.change(screen.getByLabelText("Full address"), { target: { value: "111 Main Street, Long Beach, CA" } });
    fireEvent.change(screen.getByLabelText("Marital status"), { target: { value: "divorced" } });
    fireEvent.change(screen.getByLabelText("Approximate portfolio value"), { target: { value: "250000-500000" } });
    fireEvent.click(screen.getByLabelText("Traditional IRA"));
    fireEvent.click(screen.getByLabelText(/agree to the privacy notice/i));
    fireEvent.click(screen.getByRole("button", { name: "Submit" }));
    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1));
    const body = JSON.parse(String((fetchMock.mock.calls[0][1] as RequestInit).body));
    expect(body).toMatchObject({ dob: "1970-01-01", ssn: "123-45-6789", married: "divorced", portfolioValue: "250000-500000", accountTypes: ["Traditional IRA"], privacyConsent: true });
    expect(body).not.toHaveProperty("statement");
    expect(await screen.findByRole("heading", { name: /your intake has been sent/i })).toBeInTheDocument();
    expect(screen.queryByRole("form", { name: /retirement account intake form/i })).not.toBeInTheDocument();
  });

  it("uses the shared primary form action styling", () => {
    vi.stubGlobal("fetch", vi.fn());
    render(<MemoryRouter><GetStartedPage /></MemoryRouter>);
    expect(screen.getByRole("button", { name: "Submit" })).toHaveClass("form-submit-button");
  });

  it("makes every intake field visibly required except optional notes", () => {
    vi.stubGlobal("fetch", vi.fn());
    render(<MemoryRouter><GetStartedPage /></MemoryRouter>);

    const requiredFields = [
      "First name",
      "Last name",
      "SSN / Tax ID",
      "Email address",
      "Cell phone",
      "Full address",
      "Marital status",
      "Approximate portfolio value",
    ];

    expect(screen.getByText(/required fields/i)).toBeInTheDocument();
    for (const label of requiredFields) {
      const control = screen.getByLabelText(label);
      expect(control).toBeRequired();
      expect(control.closest("label")?.querySelector(".mp-required-mark")).toBeInTheDocument();
    }

    expect(screen.getByRole("group", { name: "Date of birth" })).toHaveAttribute("aria-required", "true");
    expect(screen.getByRole("group", { name: "Date of birth" }).querySelector(".mp-required-mark")).toBeInTheDocument();
    expect(screen.getByRole("group", { name: /account types/i })).toHaveAttribute("aria-required", "true");
    expect(screen.getByRole("group", { name: /account types/i }).querySelector(".mp-required-mark")).toBeInTheDocument();
    expect(screen.getByLabelText(/any other information/i)).not.toBeRequired();
    expect(screen.getByLabelText(/any other information/i)).toHaveAccessibleName(/optional/i);
    expect(screen.getByLabelText(/agree to the privacy notice/i)).toBeRequired();
  });

  it("places email address and cell phone together in the two-column row", () => {
    vi.stubGlobal("fetch", vi.fn());
    render(<MemoryRouter><GetStartedPage /></MemoryRouter>);

    const emailField = screen.getByLabelText("Email address").closest("label");
    const phoneField = screen.getByLabelText("Cell phone").closest("label");
    expect(emailField).not.toHaveClass("mp-field--full");
    expect(phoneField).not.toHaveClass("mp-field--full");
    expect(emailField?.nextElementSibling).toBe(phoneField);
  });

  it("places SSN beside date of birth and rejects an invalid SSN", () => {
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
    render(<MemoryRouter><GetStartedPage /></MemoryRouter>);

    const dobField = screen.getByRole("group", { name: "Date of birth" });
    const ssnField = screen.getByLabelText("SSN / Tax ID").closest("label");
    expect(dobField).not.toHaveClass("mp-field--full");
    expect(dobField?.nextElementSibling).toBe(ssnField);

    fireEvent.change(screen.getByLabelText("Birth month"), { target: { value: "01" } });
    fireEvent.change(screen.getByLabelText("Birth day"), { target: { value: "01" } });
    fireEvent.change(screen.getByLabelText("Birth year"), { target: { value: "1970" } });
    fireEvent.change(screen.getByLabelText("SSN / Tax ID"), { target: { value: "000-12-3456" } });
    fireEvent.submit(screen.getByRole("form", { name: /retirement account intake form/i }));

    expect(screen.getByText(/enter a valid social security number/i)).toBeInTheDocument();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("offers divorced and widowed marital statuses", () => {
    vi.stubGlobal("fetch", vi.fn());
    render(<MemoryRouter><GetStartedPage /></MemoryRouter>);

    expect(screen.getByRole("option", { name: "Divorced" })).toHaveValue("divorced");
    expect(screen.getByRole("option", { name: "Widowed" })).toHaveValue("widowed");
  });

  it("advances through the segmented date of birth inputs", () => {
    vi.stubGlobal("fetch", vi.fn());
    render(<MemoryRouter><GetStartedPage /></MemoryRouter>);

    const month = screen.getByLabelText("Birth month") as HTMLInputElement;
    const day = screen.getByLabelText("Birth day");
    const year = screen.getByLabelText("Birth year");
    month.focus();
    fireEvent.change(month, { target: { value: "12" } });
    expect(day).toHaveFocus();
    fireEvent.change(day, { target: { value: "31" } });
    expect(year).toHaveFocus();
    month.focus();
    month.setSelectionRange(1, 1);
    fireEvent.click(month);
    expect(month).toHaveProperty("selectionStart", 0);
    expect(month).toHaveProperty("selectionEnd", 2);
  });

  it("shows an inline validation message when the browser rejects a short SSN", () => {
    vi.stubGlobal("fetch", vi.fn());
    render(<MemoryRouter><GetStartedPage /></MemoryRouter>);

    const ssn = screen.getByLabelText("SSN / Tax ID");
    fireEvent.input(ssn, { target: { value: "123" } });
    fireEvent.invalid(ssn);

    expect(screen.getByText(/must contain exactly 9 digits/i)).toBeInTheDocument();
    expect(ssn).toHaveAttribute("aria-invalid", "true");
    expect(ssn).toHaveAccessibleDescription(/must contain exactly 9 digits/i);
  });

  it("formats SSN input and reports an attempted tenth digit", () => {
    vi.stubGlobal("fetch", vi.fn());
    render(<MemoryRouter><GetStartedPage /></MemoryRouter>);

    const ssn = screen.getByLabelText("SSN / Tax ID");
    fireEvent.input(ssn, { target: { value: "1234567890" } });

    expect(ssn).toHaveValue("123-45-6789");
    expect(screen.getByText(/must contain exactly 9 digits/i)).toBeInTheDocument();
  });
});
