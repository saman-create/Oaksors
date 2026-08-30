import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { afterEach, describe, expect, it, vi } from "vitest";
import { ContactPage } from "@/pages/ContactPage";

afterEach(() => vi.unstubAllGlobals());

describe("ContactPage", () => {
  it("uses the public email form contract without qualification fields", async () => {
    const user = userEvent.setup();
    const fetchMock = vi.fn().mockResolvedValue(new Response(JSON.stringify({ submission: { id: "e1", status: "received" } }), { status: 201 }));
    vi.stubGlobal("fetch", fetchMock);
    render(<MemoryRouter><ContactPage /></MemoryRouter>);
    expect(screen.queryByLabelText(/retirement status/i)).not.toBeInTheDocument();
    expect(screen.queryByLabelText(/date of birth/i)).not.toBeInTheDocument();
    await user.type(screen.getByLabelText("First name"), "Jane");
    await user.type(screen.getByLabelText("Last name"), "Doe");
    await user.type(screen.getByLabelText("Email address"), "jane@example.com");
    await user.type(screen.getByLabelText("Subject"), "Request for information");
    await user.type(screen.getByLabelText("Message"), "I would like to learn more.");
    await user.click(screen.getByLabelText(/agree to the privacy notice/i));
    await user.click(screen.getByRole("button", { name: /send message/i }));
    expect(fetchMock.mock.calls[0][0]).toBe("https://oaksorscrm.web.app/api/crm/email-submissions");
    expect(JSON.parse(String((fetchMock.mock.calls[0][1] as RequestInit).body))).toMatchObject({ sourcePage: "contact", privacyConsent: true });
    expect(await screen.findByRole("heading", { name: /your message has been sent/i })).toBeInTheDocument();
    expect(screen.queryByRole("form", { name: /contact email form/i })).not.toBeInTheDocument();
  });

  it("uses the shared primary form action styling", () => {
    vi.stubGlobal("fetch", vi.fn());
    render(<MemoryRouter><ContactPage /></MemoryRouter>);
    expect(screen.getByRole("button", { name: /send message/i })).toHaveClass("form-submit-button");
  });

  it("shows native validation beside the incorrect field without an API warning", () => {
    vi.stubGlobal("fetch", vi.fn());
    render(<MemoryRouter><ContactPage /></MemoryRouter>);

    fireEvent.invalid(screen.getByLabelText("First name"));

    expect(screen.getByText("First name is required.")).toBeInTheDocument();
    expect(screen.queryByText(/we couldn't submit the form/i)).not.toBeInTheDocument();
  });
});
