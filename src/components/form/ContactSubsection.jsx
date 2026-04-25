import Input from "../common/Input";
import Checkbox from "../common/Checkbox";
import { formatPhoneNumber } from "../../utils/formatters";
import "../../styles/components/steps/Step.css";

/**
 * A reusable block for capturing a named contact (CEO, Director, etc).
 * Can optionally include a "Same as Primary Contact" checkbox.
 */
const ContactSubsection = ({
	title,
	values,
	errors = {},
	onChange,
	onSameAsPrimaryToggle,
	required = false,
	showSameAsPrimary = true,
}) => {
	const handleField = (field) => (e) => {
		let value = e.target.value;
		if (field === "phone") value = formatPhoneNumber(value);
		onChange(field, value);
	};

	// When no title is passed the block renders inline (no card wrapper),
	// so it can be nested inside a larger subsection (e.g. Invoicing).
	const Wrapper = title ? "div" : "div";
	const wrapperClass = title ? "step__subsection" : "step__subsection-inline";

	return (
		<Wrapper className={wrapperClass}>
			{title && <h4 className="step__subsection-title">{title}</h4>}
			{showSameAsPrimary && (
				<Checkbox
					name={`${title || "contact"}-sameAsPrimary`}
					label="Same as Primary Contact entered in Step 1"
					checked={values.sameAsPrimary}
					onChange={(e) => onSameAsPrimaryToggle(e.target.checked)}
				/>
			)}

			<div className="step__grid step__grid--2">
				<Input
					label="First Name"
					name="firstName"
					value={values.firstName}
					onChange={handleField("firstName")}
					required={required}
					error={errors.firstName}
					disabled={values.sameAsPrimary}
				/>
				<Input
					label="Last Name"
					name="lastName"
					value={values.lastName}
					onChange={handleField("lastName")}
					required={required}
					error={errors.lastName}
					disabled={values.sameAsPrimary}
				/>
			</div>

			<Input
				label="Phone"
				name="phone"
				value={values.phone}
				onChange={handleField("phone")}
				placeholder="(555) 000-0000"
				required={required}
				error={errors.phone}
				disabled={values.sameAsPrimary}
			/>
			<Input
				label="Email"
				name="email"
				type="email"
				value={values.email}
				onChange={handleField("email")}
				required={required}
				error={errors.email}
				disabled={values.sameAsPrimary}
			/>
		</Wrapper>
	);
};

export default ContactSubsection;
