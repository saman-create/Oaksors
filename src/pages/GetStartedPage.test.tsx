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
    const attachment = screen.getByLabelText("Supporting documents (optional)");
    expect(attachment).toHaveAttribute("type", "file");
    expect(attachment).toHaveAttribute("multiple");
    expect(attachment).not.toHaveAttribute("accept");
    const supportingFile = new File(["statement contents"], "account-statement.pdf", { type: "application/pdf" });
    fireEvent.change(attachment, { target: { files: [supportingFile] } });
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
    const body = (fetchMock.mock.calls[0][1] as RequestInit).body as FormData;
    const submittedPayload = JSON.parse(String(body.get("payload")));
    expect(submittedPayload).toMatchObject({ dob: "1970-01-01", ssn: "123-45-6789", married: "divorced", portfolioValue: "250000-500000", accountTypes: ["Traditional IRA"], privacyConsent: true });
    expect(submittedPayload).not.toHaveProperty("attachments");
    expect(body.getAll("attachments")).toEqual([supportingFile]);
    expect((fetchMock.mock.calls[0][1] as RequestInit).headers).not.toHaveProperty("Content-Type");
    expect(await screen.findByRole("heading", { name: /your intake has been sent/i })).toBeInTheDocument();
    expect(screen.queryByRole("form", { name: /retirement account intake form/i })).not.toBeInTheDocument();
  });

  it("uses the shared primary form action styling", () => {
    vi.stubGlobal("fetch", vi.fn());
    render(<MemoryRouter><GetStartedPage /></MemoryRouter>);
    expect(screen.getByRole("button", { name: "Submit" })).toHaveClass("form-submit-button");
  });

  it("shows selected attachments and lets the visitor remove one", () => {
    vi.stubGlobal("fetch", vi.fn());
    render(<MemoryRouter><GetStartedPage /></MemoryRouter>);
    const input = screen.getByLabelText("Supporting documents (optional)");
    fireEvent.change(input, { target: { files: [
      new File(["one"], "statement.pdf", { type: "application/pdf" }),
      new File(["two"], "photo.jpg", { type: "image/jpeg" }),
    ] } });

    expect(screen.getByText("statement.pdf")).toBeInTheDocument();
    expect(screen.getByText("photo.jpg")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Remove statement.pdf" }));
    expect(screen.queryByText("statement.pdf")).not.toBeInTheDocument();
    expect(screen.getByText("photo.jpg")).toBeInTheDocument();
  });

  it("appends files selected in separate picker sessions", () => {
    vi.stubGlobal("fetch", vi.fn());
    render(<MemoryRouter><GetStartedPage /></MemoryRouter>);
    const input = screen.getByLabelText("Supporting documents (optional)");

    fireEvent.change(input, { target: { files: [new File(["one"], "statement.pdf", { type: "application/pdf" })] } });
    fireEvent.change(input, { target: { files: [new File(["two"], "photo.jpg", { type: "image/jpeg" })] } });

    expect(screen.getByText("statement.pdf")).toBeInTheDocument();
    expect(screen.getByText("photo.jpg")).toBeInTheDocument();
    expect(screen.getByText("2 of 3 files selected")).toBeInTheDocument();
  });

  it("keeps existing files when an additional selection exceeds the limit", () => {
    vi.stubGlobal("fetch", vi.fn());
    render(<MemoryRouter><GetStartedPage /></MemoryRouter>);
    const input = screen.getByLabelText("Supporting documents (optional)");

    fireEvent.change(input, { target: { files: [
      new File(["1"], "one.txt"),
      new File(["2"], "two.txt"),
    ] } });
    fireEvent.change(input, { target: { files: [
      new File(["3"], "three.txt"),
      new File(["4"], "four.txt"),
    ] } });

    expect(screen.getByText(/attach no more than 3 files/i)).toBeInTheDocument();
    expect(screen.getByText("one.txt")).toBeInTheDocument();
    expect(screen.getByText("two.txt")).toBeInTheDocument();
    expect(screen.queryByText("three.txt")).not.toBeInTheDocument();
  });

  it("rejects more than three attachments inline", () => {
    vi.stubGlobal("fetch", vi.fn());
    render(<MemoryRouter><GetStartedPage /></MemoryRouter>);
    fireEvent.change(screen.getByLabelText("Supporting documents (optional)"), { target: { files: [
      new File(["1"], "one.txt"),
      new File(["2"], "two.txt"),
      new File(["3"], "three.txt"),
      new File(["4"], "four.txt"),
    ] } });

    expect(screen.getByText(/attach no more than 3 files/i)).toBeInTheDocument();
    expect(screen.queryByText("one.txt")).not.toBeInTheDocument();
  });

  it("rejects an attachment over 10 MB inline", () => {
    vi.stubGlobal("fetch", vi.fn());
    render(<MemoryRouter><GetStartedPage /></MemoryRouter>);
    const oversized = new File([new Uint8Array(10 * 1024 * 1024 + 1)], "oversized.bin");
    fireEvent.change(screen.getByLabelText("Supporting documents (optional)"), { target: { files: [oversized] } });

    expect(screen.getByText(/oversized\.bin exceeds the 10 MB per-file limit/i)).toBeInTheDocument();
  });

  it("rejects attachments over the 25 MB combined limit", () => {
    vi.stubGlobal("fetch", vi.fn());
    render(<MemoryRouter><GetStartedPage /></MemoryRouter>);
    const nineMb = new Uint8Array(9 * 1024 * 1024);
    fireEvent.change(screen.getByLabelText("Supporting documents (optional)"), { target: { files: [
      new File([nineMb], "one.bin"),
      new File([nineMb], "two.bin"),
      new File([nineMb], "three.bin"),
    ] } });

    expect(screen.getByText(/combined file size cannot exceed 25 MB/i)).toBeInTheDocument();
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

  it("formats SSN input and silently ignores an attempted tenth digit", () => {
    vi.stubGlobal("fetch", vi.fn());
    render(<MemoryRouter><GetStartedPage /></MemoryRouter>);

    const ssn = screen.getByLabelText("SSN / Tax ID");
    fireEvent.input(ssn, { target: { value: "1234567890" } });

    expect(ssn).toHaveValue("123-45-6789");
    expect(screen.queryByText(/must contain exactly 9 digits/i)).not.toBeInTheDocument();
  });

  it("shows consent validation beside the field without a submission failure warning", () => {
    vi.stubGlobal("fetch", vi.fn());
    render(<MemoryRouter><GetStartedPage /></MemoryRouter>);

    fireEvent.invalid(screen.getByLabelText(/agree to the privacy notice/i));

    expect(screen.getByText(/confirm that you agree to the privacy notice/i)).toBeInTheDocument();
    expect(screen.queryByText(/we couldn't submit the form/i)).not.toBeInTheDocument();
  });
});
