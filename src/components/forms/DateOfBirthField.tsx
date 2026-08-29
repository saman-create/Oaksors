import { useId, useRef, useState, type ChangeEvent, type KeyboardEvent } from "react";

type DateOfBirthFieldProps = {
  error?: string;
  required?: boolean;
};

export function DateOfBirthField({ error, required = true }: DateOfBirthFieldProps) {
  const id = useId();
  const [month, setMonth] = useState("");
  const [day, setDay] = useState("");
  const [year, setYear] = useState("");
  const monthRef = useRef<HTMLInputElement>(null);
  const dayRef = useRef<HTMLInputElement>(null);
  const yearRef = useRef<HTMLInputElement>(null);

  function updatePart(event: ChangeEvent<HTMLInputElement>, maxLength: number, update: (value: string) => void, next?: HTMLInputElement | null) {
    const value = event.currentTarget.value.replace(/\D/g, "").slice(0, maxLength);
    update(value);
    if (value.length === maxLength && next) {
      next.focus();
      next.select();
    }
  }

  function returnToPrevious(event: KeyboardEvent<HTMLInputElement>, previous?: HTMLInputElement | null) {
    if (event.key === "Backspace" && !event.currentTarget.value && previous) {
      previous.focus();
      previous.select();
    }
  }

  const errorId = `${id}-error`;
  return (
    <fieldset className="mp-field mp-dob-field" aria-required={required ? "true" : undefined} aria-describedby={error ? errorId : undefined}>
      <legend>Date of birth{required && <span className="mp-required-mark" aria-hidden="true" />}</legend>
      <div className="mp-dob-control" aria-invalid={Boolean(error)}>
        <input ref={monthRef} type="text" inputMode="numeric" autoComplete="bday-month" aria-label="Birth month" placeholder="MM" value={month} maxLength={2} pattern="0[1-9]|1[0-2]" required={required} onFocus={(event) => event.currentTarget.select()} onClick={(event) => event.currentTarget.select()} onChange={(event) => updatePart(event, 2, setMonth, dayRef.current)} />
        <span aria-hidden="true">/</span>
        <input ref={dayRef} type="text" inputMode="numeric" autoComplete="bday-day" aria-label="Birth day" placeholder="DD" value={day} maxLength={2} pattern="0[1-9]|[12][0-9]|3[01]" required={required} onFocus={(event) => event.currentTarget.select()} onClick={(event) => event.currentTarget.select()} onChange={(event) => updatePart(event, 2, setDay, yearRef.current)} onKeyDown={(event) => returnToPrevious(event, monthRef.current)} />
        <span aria-hidden="true">/</span>
        <input ref={yearRef} type="text" inputMode="numeric" autoComplete="bday-year" aria-label="Birth year" placeholder="YYYY" value={year} maxLength={4} pattern="(19|20)[0-9]{2}" required={required} onFocus={(event) => event.currentTarget.select()} onClick={(event) => event.currentTarget.select()} onChange={(event) => updatePart(event, 4, setYear)} onKeyDown={(event) => returnToPrevious(event, dayRef.current)} />
      </div>
      <input type="hidden" name="dob" value={`${month}/${day}/${year}`} />
      {error && <small id={errorId} className="mp-field-error">{error}</small>}
    </fieldset>
  );
}
