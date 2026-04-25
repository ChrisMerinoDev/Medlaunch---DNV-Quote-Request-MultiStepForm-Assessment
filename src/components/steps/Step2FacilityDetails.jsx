import { useEffect } from "react";
import Card from "../common/Card";
import Radio from "../common/Radio";
import Input from "../common/Input";
import { useFormContext } from "../../context/FormContext";
import { FACILITY_TYPES } from "../../constants/facilityTypes";
import { isRequired } from "../../utils/validators";
import "../../styles/components/steps/Step.css";
import "../../styles/components/steps/Step2FacilityDetails.css";

const Step2FacilityDetails = ({ registerValidator }) => {
	const { data, errors, updateSection } = useFormContext();
	const section = data.facilityDetails;
	const stepErrors = errors[2] || {};

	useEffect(() => {
		registerValidator?.(() => {
			const errors = {};
			if (isRequired(section.facilityType)) {
				errors.facilityType = "Please select a facility type";
			}
			if (
				section.facilityType === "other" &&
				isRequired(section.otherFacilityType)
			) {
				errors.otherFacilityType = "Please describe the facility type";
			}
			return errors;
		});
	}, [registerValidator, section]);

	const handleChange = (e) => {
		updateSection("facilityDetails", { facilityType: e.target.value });
	};

	return (
		<div className="step">
			<Card title="Facility and Organization Type">
				<div className="facility-types">
					<div className="facility-types__label">
						Facility Type <span className="facility-types__required">*</span>
					</div>
					<div className="facility-types__list">
						{FACILITY_TYPES.map((type) => (
							<Radio
								key={type.value}
								name="facilityType"
								value={type.value}
								label={type.label}
								checked={section.facilityType === type.value}
								onChange={handleChange}
							/>
						))}
					</div>
					{stepErrors.facilityType && (
						<span className="step__error" role="alert">
							{stepErrors.facilityType}
						</span>
					)}

					{section.facilityType === "other" && (
						<Input
							label="Please specify"
							name="otherFacilityType"
							value={section.otherFacilityType}
							onChange={(e) =>
								updateSection("facilityDetails", {
									otherFacilityType: e.target.value,
								})
							}
							required
							error={stepErrors.otherFacilityType}
						/>
					)}
				</div>
			</Card>
		</div>
	);
};

export default Step2FacilityDetails;
