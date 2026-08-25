import { useEffect, useRef } from "react";
import type { SubmissionPhase } from "@/hooks/useCrmSubmission";

const messages: Partial<Record<SubmissionPhase, string>> = {
  success: "Thank you. Your information has been received, and our team will be in touch.",
  duplicate: "We already received this submission. You do not need to send it again.",
  "rate-limited": "There have been several recent attempts. Please wait a few minutes, then try again.",
  error: "We couldn't submit the form. Check the highlighted fields or try again.",
};

type FormStatusProps = {
  phase: SubmissionPhase;
  successTitle?: string;
  onReset?: () => void;
};

export function FormStatus({ phase, successTitle = "Your request has been sent.", onReset }: FormStatusProps) {
  const successRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (phase === "success") successRef.current?.focus();
  }, [phase]);

  if (phase === "success") {
    return (
      <div ref={successRef} className="form-success" role="status" tabIndex={-1}>
        <span className="form-success-icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" focusable="false"><path d="m5 12.5 4.2 4.2L19 7" /></svg>
        </span>
        <p className="page-eyebrow">Submission received</p>
        <h2>{successTitle}</h2>
        <p>Thank you. Your information has been received, and a member of the Oaksors team will be in touch.</p>
        {onReset && <button type="button" className="btn btn-primary form-submit-button" onClick={onReset}>Send another response</button>}
      </div>
    );
  }

  const message = messages[phase];
  if (!message) return null;
  return <div className={`form-status form-status--${phase}`} role={phase === "error" ? "alert" : "status"}>{message}</div>;
}
