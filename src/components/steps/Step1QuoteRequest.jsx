import { useEffect } from "react";
import Card from "../common/Card";
import Input from "../common/Input";
import Checkbox from "../common/Checkbox";
import Pill from "../common/Pill";
import Button from "../common/Button";
import { useFormContext } from "../../context/FormContext";
import { isRequired, isValidEmail, isValidPhone } from "../../utils/validators";
import { formatPhoneNumber } from "../../utils/formatters";
import "../../styles/components/steps/Step.css";

const Step1QuoteRequest = ({ registerValidator }) => {
	const { data, updateSection, updateNested } = useFormContext();
	const section = data.quoteRequest;
	const primary = section.primaryContact;

	// --- Validation registered with the page-level submit handler -------------
	useEffect(() => {
		registerValidator?.(() => {
			const errors = {};
			if (isRequired(section.legalEntityName))
				errors.legalEntityName = isRequired(section.legalEntityName);
			if (isRequired(section.dbaName))
				errors.dbaName = isRequired(section.dbaName);
			if (isRequired(primary.firstName))
				errors.firstName = isRequired(primary.firstName);
			if (isRequired(primary.lastName))
				errors.lastName = isRequired(primary.lastName);
			if (isRequired(primary.title)) errors.title = isRequired(primary.title);
			if (isValidPhone(primary.workPhone))
				errors.workPhone = isValidPhone(primary.workPhone);
			if (isValidEmail(primary.email))
				errors.email = isValidEmail(primary.email);
			return errors;
		});
	}, [registerValidator, section, primary]);

	// --- Handlers -------------------------------------------------------------
	const handleEntityChange = (field) => (e) => {
		updateSection("quoteRequest", { [field]: e.target.value });
	};

	const handleSameAsLegal = (e) => {
		const checked = e.target.checked;
		updateSection("quoteRequest", {
			sameAsLegalEntity: checked,
			dbaName: checked ? section.legalEntityName : "",
		});
	};

	const handleContactChange = (field) => (e) => {
		let value = e.target.value;
		if (field === "workPhone" || field === "cellPhone") {
			value = formatPhoneNumber(value);
		}
		updateNested("quoteRequest", "primaryContact", { [field]: value });
	};

	const handleSendVerification = () => {
		if (!primary.email || isValidEmail(primary.email)) return;
		// Simulate sending a verification email
		updateNested("quoteRequest", "primaryContact", { emailVerified: true });
	};

	return (
		<div className="step">
			<Card title="Identify Healthcare Organization">
				<Input
					label="Legal Entity Name"
					name="legalEntityName"
					value={section.legalEntityName}
					onChange={handleEntityChange("legalEntityName")}
					required
				/>
				<Input
					label="Doing Business As (d/b/a) Name"
					name="dbaName"
					value={section.dbaName}
					onChange={handleEntityChange("dbaName")}
					required
					disabled={section.sameAsLegalEntity}
				/>
				<Checkbox
					name="sameAsLegalEntity"
					label="Same as Legal Entity Name"
					checked={section.sameAsLegalEntity}
					onChange={handleSameAsLegal}
				/>
			</Card>

			<Card
				title="Primary Contact Information"
				subtitle="Primary contact receives all DNV Healthcare official communications"
			>
				<div className="step__grid step__grid--2">
					<Input
						label="First Name"
						name="firstName"
						value={primary.firstName}
						onChange={handleContactChange("firstName")}
						required
					/>
					<Input
						label="Last Name"
						name="lastName"
						value={primary.lastName}
						onChange={handleContactChange("lastName")}
						required
					/>
				</div>

				<Input
					label="Title"
					name="title"
					value={primary.title}
					onChange={handleContactChange("title")}
					required
				/>

				<div className="step__grid step__grid--2">
					<Input
						label="Work Phone"
						name="workPhone"
						value={primary.workPhone}
						onChange={handleContactChange("workPhone")}
						placeholder="(555) 000-0000"
						required
					/>
					<Input
						label="Cell Phone"
						name="cellPhone"
						value={primary.cellPhone}
						onChange={handleContactChange("cellPhone")}
						placeholder="(555) 000-0000"
					/>
				</div>

				<Input
					label="Email"
					name="email"
					type="email"
					value={primary.email}
					onChange={handleContactChange("email")}
					required
					rightAdornment={
						<span aria-hidden="true" className="step__refresh-icon">
							<svg width="14" height="14" viewBox="0 0 24 24" fill="none">
								<path
									d="M23 4v6h-6M1 20v-6h6M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"
									stroke="currentColor"
									strokeWidth="2"
									strokeLinecap="round"
									strokeLinejoin="round"
								/>
							</svg>
						</span>
					}
				/>

				<div className="step__row step__row--between">
					<Button variant="secondary" onClick={handleSendVerification}>
						Send Verification Email
					</Button>
					<Pill tone={primary.emailVerified ? "success" : "warning"}>
						{primary.emailVerified ? "Verified" : "Not verified"}
					</Pill>
				</div>
			</Card>
		</div>
	);
};

export default Step1QuoteRequest;
