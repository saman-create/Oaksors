type ConsentFieldProps = {
  error?: string;
};

const CONSENT_ERROR = "Please confirm that you agree to the privacy notice.";

export function ConsentField({ error }: ConsentFieldProps) {
  const errorId = "privacyConsent-error";

  return (
    <div className="form-consent-field mp-field--full">
      <label className="form-consent">
        <input
          type="checkbox"
          name="privacyConsent"
          required
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : undefined}
          data-validation-label="Privacy consent"
          data-validation-message={CONSENT_ERROR}
        />
        <span>I agree to the <a href="/privacy-notice/">privacy notice</a> and consent to being contacted about this request.</span>
      </label>
      {error && <small id={errorId} className="mp-field-error">{error}</small>}
    </div>
  );
}
