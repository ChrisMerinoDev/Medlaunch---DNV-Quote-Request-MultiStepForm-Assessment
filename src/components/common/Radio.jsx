import "../../styles/components/common/Radio.css";

const Radio = ({
	id,
	name,
	value,
	label,
	checked,
	onChange,
	disabled = false,
	className = "",
}) => {
	const inputId = id || `${name}-${value}`;
	return (
		<label
			htmlFor={inputId}
			className={`radio ${className} ${disabled ? "radio--disabled" : ""}`}
		>
			<input
				id={inputId}
				type="radio"
				name={name}
				value={value}
				checked={checked}
				onChange={onChange}
				disabled={disabled}
				className="radio__input"
			/>
			<span className="radio__dot" aria-hidden="true" />
			{label && <span className="radio__label">{label}</span>}
		</label>
	);
};

export default Radio;
