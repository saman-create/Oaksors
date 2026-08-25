import type { SubmissionPhase } from "@/hooks/useCrmSubmission";

const messages: Partial<Record<SubmissionPhase, string>> = {
  success: "Thank you. Your information has been received, and our team will be in touch.",
  duplicate: "We already received this submission. You do not need to send it again.",
  "rate-limited": "There have been several recent attempts. Please wait a few minutes, then try again.",
  error: "We couldn't submit the form. Check the highlighted fields or try again.",
};

export function FormStatus({ phase }: { phase: SubmissionPhase }) {
  const message = messages[phase];
  if (!message) return null;
  return <div className={`form-status form-status--${phase}`} role={phase === "error" ? "alert" : "status"}>{message}</div>;
}
