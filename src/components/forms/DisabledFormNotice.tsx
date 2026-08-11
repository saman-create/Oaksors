export function DisabledFormNotice({ compact = false }: { compact?: boolean }) {
  return (
    <div className={compact ? "form-disabled-notice is-compact" : "form-disabled-notice"} role="status">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20ZM12 8v4m0 4h.01" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
      <div><strong>Online submission is temporarily unavailable.</strong>{!compact && <span>This form is provided as a preview only. No information entered here is collected, stored, uploaded, or transmitted.</span>}</div>
    </div>
  );
}
