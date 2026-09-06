import { useId, useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";
import "./Field.css";

export default function Field({
  label,
  name,
  type = "text",
  value,
  onChange,
  error,
  hint,
  autoComplete,
  required = true,
}) {
  const id = useId();
  const [revealed, setRevealed] = useState(false);
  const isPassword = type === "password";
  const inputType = isPassword && revealed ? "text" : type;
  const describedBy = error ? `${id}-error` : hint ? `${id}-hint` : undefined;

  return (
    <div className={`field${error ? " field--bad" : ""}`}>
      <label className="field__label" htmlFor={id}>{label}</label>

      <div className="field__control">
        <input
          id={id}
          name={name}
          type={inputType}
          value={value}
          onChange={onChange}
          required={required}
          autoComplete={autoComplete}
          aria-invalid={Boolean(error)}
          aria-describedby={describedBy}
          className="field__input"
        />
        {isPassword && (
          <button
            type="button"
            className="field__reveal"
            onClick={() => setRevealed((shown) => !shown)}
            aria-label={revealed ? "Hide password" : "Show password"}
          >
            {revealed ? <FiEyeOff /> : <FiEye />}
          </button>
        )}
      </div>

      {error ? (
        <p className="field__error" id={`${id}-error`}>{error}</p>
      ) : hint ? (
        <p className="field__hint" id={`${id}-hint`}>{hint}</p>
      ) : null}
    </div>
  );
}
