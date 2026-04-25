import { useState } from "react";
import Pill from "../common/Pill";
import Input from "../common/Input";
import Button from "../common/Button";
import "../../styles/components/form/DateChipInput.css";

/**
 * A date field paired with a chip list. The user picks a date, clicks
 * "Add", and the date appears as a removable chip. Used for tracking
 * lists of procedure dates.
 */
const DateChipInput = ({ label, values = [], onChange, name }) => {
	const [current, setCurrent] = useState("");

	const addDate = () => {
		if (!current) return;
		onChange([...values, current]);
		setCurrent("");
	};

	const removeAt = (idx) => {
		onChange(values.filter((_, i) => i !== idx));
	};

	const formatForDisplay = (isoDate) => {
		// Convert yyyy-mm-dd to mm/dd/yyyy for display
		if (!isoDate || !isoDate.includes("-")) return isoDate;
		const [y, m, d] = isoDate.split("-");
		return `${m}/${d}/${y}`;
	};

	return (
		<div className="date-chip">
			{label && <div className="date-chip__label">{label}</div>}
			<div className="date-chip__row">
				<Input
					type="date"
					name={name}
					value={current}
					onChange={(e) => setCurrent(e.target.value)}
					className="date-chip__input"
				/>
				<Button variant="secondary" onClick={addDate} disabled={!current}>
					Add
				</Button>
			</div>
			{values.length > 0 && (
				<div className="date-chip__list">
					{values.map((d, idx) => (
						<Pill
							key={`${d}-${idx}`}
							tone="primary"
							onRemove={() => removeAt(idx)}
						>
							{formatForDisplay(d)}
						</Pill>
					))}
				</div>
			)}
		</div>
	);
};

export default DateChipInput;
