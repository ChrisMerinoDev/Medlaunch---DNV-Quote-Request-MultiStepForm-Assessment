import { forwardRef } from "react";
import "../../styles/components/common/Select.css";

const Select = forwardRef(function Select(
	{
		id,
		name,
		label,
		value,
		onChange,
		onBlur,
		options = [],
		placeholder = "Select...",
		required = false,
		error = "",
		disabled = false,
		className = "",
	},
	ref,
) {
	const inputId = id || name;
	const errorId = error ? `${inputId}-error` : undefined;

	return (
		<div className={`select-field ${className}`}>
			{label && (
				<label htmlFor={inputId} className="select-field__label">
					{label}
					{required && (
						<span className="select-field__required" aria-hidden="true">
							{" "}
							*
						</span>
					)}
				</label>
			)}
			<div className="select-field__wrapper">
				<select
					ref={ref}
					id={inputId}
					name={name}
					value={value ?? ""}
					onChange={onChange}
					onBlur={onBlur}
					disabled={disabled}
					aria-invalid={!!error}
					aria-describedby={errorId}
					className={`select-field__control ${error ? "select-field__control--error" : ""}`}
				>
					<option value="" disabled>
						{placeholder}
					</option>
					{options.map((opt) => (
						<option key={opt.value} value={opt.value}>
							{opt.label}
						</option>
					))}
				</select>
				<span className="select-field__chevron" aria-hidden="true">
					<svg viewBox="0 0 12 12" width="12" height="12">
						<path
							d="M2 4 L6 8 L10 4"
							stroke="currentColor"
							strokeWidth="1.5"
							fill="none"
							strokeLinecap="round"
							strokeLinejoin="round"
						/>
					</svg>
				</span>
			</div>
			{error && (
				<span id={errorId} role="alert" className="select-field__error">
					{error}
				</span>
			)}
		</div>
	);
});

export default Select;
