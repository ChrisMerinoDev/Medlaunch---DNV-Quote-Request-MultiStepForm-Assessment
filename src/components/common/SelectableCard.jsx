import "../../styles/components/common/SelectableCard.css";

/**
 * Large clickable card used for binary/single-choice selections such
 * as Single vs Multiple Locations, or Upload vs Manual Entry methods.
 */
const SelectableCard = ({
	title,
	description,
	selected = false,
	onClick,
	className = "",
}) => {
	return (
		<button
			type="button"
			className={`selectable-card ${selected ? "selectable-card--selected" : ""} ${className}`}
			onClick={onClick}
			aria-pressed={selected}
		>
			<span className="selectable-card__title">{title}</span>
			{description && (
				<span className="selectable-card__description">{description}</span>
			)}
		</button>
	);
};

export default SelectableCard;
