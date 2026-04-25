import { forwardRef } from "react";
import "../../styles/components/common/Input.css";

/**
 * Controlled text input. Renders a label + asterisk (if required),
 * an input box, and a validation error below when present.
 */
const Input = forwardRef(function Input(
	{
		id,
		label,
		name,
		value,
		onChange,
		onBlur,
		type = "text",
		placeholder = "",
		required = false,
		error = "",
		disabled = false,
		rightAdornment = null,
		className = "",
		...rest
	},
	ref,
) {
	const inputId = id || name;
	const errorId = error ? `${inputId}-error` : undefined;

	return (
		<div className={`input-field ${className}`}>
			{label && (
				<label htmlFor={inputId} className="input-field__label">
					{label}
					{required && (
						<span className="input-field__required" aria-hidden="true">
							{" "}
							*
						</span>
					)}
					{rightAdornment && (
						<span className="input-field__adornment">{rightAdornment}</span>
					)}
				</label>
			)}
			<input
				ref={ref}
				id={inputId}
				name={name}
				type={type}
				value={value ?? ""}
				onChange={onChange}
				onBlur={onBlur}
				placeholder={placeholder}
				disabled={disabled}
				aria-invalid={!!error}
				aria-describedby={errorId}
				aria-required={required}
				className={`input-field__control ${error ? "input-field__control--error" : ""}`}
				{...rest}
			/>
			{error && (
				<span id={errorId} role="alert" className="input-field__error">
					{error}
				</span>
			)}
		</div>
	);
});

export default Input;
