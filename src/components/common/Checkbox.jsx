import "../../styles/components/common/Checkbox.css";

const Checkbox = ({
	id,
	name,
	label,
	checked = false,
	onChange,
	disabled = false,
	className = "",
}) => {
	const inputId = id || name;
	return (
		<label
			htmlFor={inputId}
			className={`checkbox ${className} ${disabled ? "checkbox--disabled" : ""}`}
		>
			<input
				id={inputId}
				name={name}
				type="checkbox"
				checked={checked}
				onChange={onChange}
				disabled={disabled}
				className="checkbox__input"
			/>
			<span className="checkbox__box" aria-hidden="true">
				{checked && (
					<svg viewBox="0 0 16 16" className="checkbox__tick">
						<polyline
							points="3.5,8.5 6.5,11.5 12.5,5"
							fill="none"
							stroke="currentColor"
							strokeWidth="2"
							strokeLinecap="round"
							strokeLinejoin="round"
						/>
					</svg>
				)}
			</span>
			{label && <span className="checkbox__label">{label}</span>}
		</label>
	);
};

export default Checkbox;
