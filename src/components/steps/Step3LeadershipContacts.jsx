import { useEffect } from "react";
import Card from "../common/Card";
import ContactSubsection from "../form/ContactSubsection";
import AddressFields from "../form/AddressFields";
import { useFormContext } from "../../context/FormContext";
import {
	isRequired,
	isValidEmail,
	isValidPhone,
	isValidZip,
} from "../../utils/validators";
import "../../styles/components/steps/Step.css";

/**
 * Snapshot of the primary contact captured in Step 1, shaped to match
 * the contact schema used on this step.
 */
const primaryContactSnapshot = (primary) => {
	return {
		firstName: primary.firstName,
		lastName: primary.lastName,
		phone: primary.workPhone,
		email: primary.email,
	};
};

const Step3LeadershipContacts = ({ registerValidator }) => {
	const { data, updateNested } = useFormContext();
	const section = data.leadershipContacts;
	const primary = data.quoteRequest.primaryContact;

	useEffect(() => {
		registerValidator?.(() => {
			const errors = {};

			// CEO - required
			const ceo = section.ceo;
			if (isRequired(ceo.firstName))
				errors.ceoFirstName = isRequired(ceo.firstName);
			if (isRequired(ceo.lastName))
				errors.ceoLastName = isRequired(ceo.lastName);
			if (isValidPhone(ceo.phone)) errors.ceoPhone = isValidPhone(ceo.phone);
			if (isValidEmail(ceo.email)) errors.ceoEmail = isValidEmail(ceo.email);

			// Invoicing contact - required (billing tied to this)
			const inv = section.invoicingContact;
			if (isRequired(inv.firstName))
				errors.invFirstName = isRequired(inv.firstName);
			if (isRequired(inv.lastName))
				errors.invLastName = isRequired(inv.lastName);
			if (isValidPhone(inv.phone)) errors.invPhone = isValidPhone(inv.phone);
			if (isValidEmail(inv.email)) errors.invEmail = isValidEmail(inv.email);

			const addr = inv.billingAddress;
			if (isRequired(addr.street)) errors.street = isRequired(addr.street);
			if (isRequired(addr.city)) errors.city = isRequired(addr.city);
			if (isRequired(addr.state)) errors.state = isRequired(addr.state);
			if (isValidZip(addr.zip)) errors.zip = isValidZip(addr.zip);

			return errors;
		});
	}, [registerValidator, section]);

	const handleContactField = (contactKey) => (field, value) => {
		updateNested("leadershipContacts", contactKey, { [field]: value });
	};

	const handleSameAsPrimary = (contactKey) => (checked) => {
		if (checked) {
			updateNested("leadershipContacts", contactKey, {
				sameAsPrimary: true,
				...primaryContactSnapshot(primary),
			});
		} else {
			updateNested("leadershipContacts", contactKey, {
				sameAsPrimary: false,
				firstName: "",
				lastName: "",
				phone: "",
				email: "",
			});
		}
	};

	const handleBillingChange = (field, value) => {
		updateNested("leadershipContacts", "invoicingContact", {
			billingAddress: {
				...section.invoicingContact.billingAddress,
				[field]: value,
			},
		});
	};

	return (
		<div className="step">
			<Card title="Contact Information">
				<ContactSubsection
					title="Chief Executive Officer (CEO)"
					values={section.ceo}
					onChange={handleContactField("ceo")}
					onSameAsPrimaryToggle={handleSameAsPrimary("ceo")}
					required
				/>

				<ContactSubsection
					title="Director of Quality"
					values={section.directorOfQuality}
					onChange={handleContactField("directorOfQuality")}
					onSameAsPrimaryToggle={handleSameAsPrimary("directorOfQuality")}
				/>

				<ContactSubsection
					title="Invoicing Contact"
					values={section.invoicingContact}
					onChange={handleContactField("invoicingContact")}
					onSameAsPrimaryToggle={handleSameAsPrimary("invoicingContact")}
					required
				/>

				<AddressFields
					title="Billing Address"
					values={section.invoicingContact.billingAddress}
					onChange={handleBillingChange}
					required
				/>
			</Card>
		</div>
	);
};

export default Step3LeadershipContacts;
