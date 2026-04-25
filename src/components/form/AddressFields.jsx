import Input from "../common/Input";
import Select from "../common/Select";
import { STATES_FROM_THE_US } from "../../constants/states";
import { formatZip } from "../../utils/formatters";
import "../../styles/components/steps/Step.css";

/**
 * Reusable address block: Street, City, State, ZIP.
 * Writes changes back through a single `onChange(field, value)` callback.
 */
const AddressFields = ({
	title = "Address",
	values,
	errors = {},
	onChange,
	required = false,
}) => {
	const stateOptions = STATES_FROM_THE_US.map((s) => ({
		value: s.shortName,
		label: s.fullName,
	}));

	const handle = (field) => (e) => {
		let value = e.target.value;
		if (field === "zip") value = formatZip(value);
		onChange(field, value);
	};

	return (
		<div>
			{title && <div className="step__section-title">{title}</div>}
			<Input
				label="Street Address"
				name="street"
				value={values.street}
				onChange={handle("street")}
				required={required}
				error={errors.street}
			/>
			<div
				className="step__grid step__grid--3"
				style={{ marginTop: "var(--sp-4)" }}
			>
				<Input
					label="City"
					name="city"
					value={values.city}
					onChange={handle("city")}
					required={required}
					error={errors.city}
				/>
				<Select
					label="State"
					name="state"
					value={values.state}
					onChange={handle("state")}
					options={stateOptions}
					placeholder="Select State"
					required={required}
					error={errors.state}
				/>
				<Input
					label="ZIP Code"
					name="zip"
					value={values.zip}
					onChange={handle("zip")}
					required={required}
					error={errors.zip}
				/>
			</div>
		</div>
	);
};

export default AddressFields;
