import { useEffect } from "react";
import Checkbox from "../common/Checkbox";
import Button from "../common/Button";
import Pill from "../common/Pill";
import { useFormContext } from "../../context/FormContext";
import { FACILITY_TYPES } from "../../constants/facilityTypes";
import { SERVICE_CATEGORIES, STANDARDS } from "../../constants/services";
import { STATES_FROM_THE_US } from "../../constants/states";
import "../../styles/components/steps/Step.css";
import "../../styles/components/steps/Step6Review.css";

/**
 * Helper lookups used for displaying human-readable labels from ids/codes.
 */
const findServiceLabel = (id) => {
	for (const cat of SERVICE_CATEGORIES) {
		const svc = cat.services.find((s) => s.id === id);
		if (svc) return svc.label;
	}
	return id;
};

const findStandardLabel = (value) =>
	STANDARDS.find((s) => s.value === value)?.label ?? value;

const findFacilityLabel = (value) =>
	FACILITY_TYPES.find((f) => f.value === value)?.label ?? value;

const findStateName = (state) =>
	STATES_FROM_THE_US.find((s) => s.shortName === state)?.fullName ?? state;

const formatDate = (iso) => {
	if (!iso || !iso.includes("-")) return iso;
	const [y, m, d] = iso.split("-");
	return `${m}/${d}/${y}`;
};

/** Small section row label/value pair. */
const Row = ({ label, children }) => {
	return (
		<div className="review__row">
			<div className="review__row-label">{label}</div>
			<div className="review__row-value">{children}</div>
		</div>
	);
};

/** Collapsible-style section with a header bar and Edit link. */
const Section = ({ title, onEdit, children }) => {
	return (
		<div className="review__section">
			<header className="review__section-header">
				<span className="review__section-title">
					<svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true">
						<path
							d="M2 4 L6 8 L10 4"
							stroke="currentColor"
							strokeWidth="1.5"
							fill="none"
							strokeLinecap="round"
							strokeLinejoin="round"
						/>
					</svg>
					{title}
				</span>
				{onEdit && (
					<button type="button" className="review__edit" onClick={onEdit}>
						Edit
					</button>
				)}
			</header>
			<div className="review__section-body">{children}</div>
		</div>
	);
};

const Step6Review = ({ registerValidator }) => {
	const { data, errors, goToStep, updateSection } = useFormContext();
	const stepErrors = errors[6] || {};

	useEffect(() => {
		registerValidator?.(() => {
			const errors = {};
			if (!data.reviewAndSubmit.certified) {
				errors.certified = "You must certify before submitting";
			}
			return errors;
		});
	}, [registerValidator, data.reviewAndSubmit.certified]);

	const q = data.quoteRequest;
	const facility = data.facilityDetails;
	const leadership = data.leadershipContacts;
	const site = data.siteInformation;
	const services = data.servicesAndCertifications;

	const handleCertify = (e) => {
		updateSection("reviewAndSubmit", { certified: e.target.checked });
	};

	const downloadPayload = (format) => {
		const payload = {
			quoteRequest: q,
			facilityDetails: facility,
			leadershipContacts: leadership,
			siteInformation: site,
			servicesAndCertifications: services,
			submittedAt: new Date().toISOString(),
		};

		let blob;
		let filename;
		if (format === "pdf") {
			// Not a real PDF; emit a text representation for demonstration.
			blob = new Blob([JSON.stringify(payload, null, 2)], {
				type: "text/plain",
			});
			filename = "dnv-quote-request.txt";
		} else {
			blob = new Blob([JSON.stringify(payload, null, 2)], {
				type: "application/json",
			});
			filename = "dnv-quote-request.json";
		}
		const url = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = filename;
		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);
		URL.revokeObjectURL(url);
	};

	return (
		<div className="step">
			<div className="review">
				<h3 className="review__heading">Hospital Information</h3>

				{/* Basic Information */}
				<Section title="Basic Information" onEdit={() => goToStep(1)}>
					<Row label="Legal Entity Name">{q.legalEntityName || "—"}</Row>
					<Row label="d/b/a Name">{q.dbaName || "—"}</Row>
					<Row label="Primary Contact">
						<div className="review__contact">
							<div className="review__contact-name">
								{q.primaryContact.firstName} {q.primaryContact.lastName}
							</div>
							{q.primaryContact.title && <div>{q.primaryContact.title}</div>}
							{q.primaryContact.workPhone && (
								<div>Work: {q.primaryContact.workPhone}</div>
							)}
							{q.primaryContact.cellPhone && (
								<div>Cell: {q.primaryContact.cellPhone}</div>
							)}
							{q.primaryContact.email && (
								<div>
									Email: {q.primaryContact.email}{" "}
									<Pill
										tone={
											q.primaryContact.emailVerified ? "success" : "warning"
										}
									>
										{q.primaryContact.emailVerified
											? "Verified"
											: "Not verified"}
									</Pill>
								</div>
							)}
						</div>
					</Row>
				</Section>

				{/* Facility Details */}
				<Section title="Facility Details" onEdit={() => goToStep(2)}>
					<Row label="Facility Type">
						{facility.facilityType
							? findFacilityLabel(facility.facilityType)
							: "—"}
						{facility.facilityType === "other" &&
							facility.otherFacilityType && (
								<span> ({facility.otherFacilityType})</span>
							)}
					</Row>
				</Section>

				{/* Leadership Contacts */}
				<Section title="Leadership Contacts" onEdit={() => goToStep(3)}>
					<Row label="CEO">
						<div className="review__contact">
							<div className="review__contact-name">
								{leadership.ceo.firstName} {leadership.ceo.lastName}
							</div>
							{leadership.ceo.phone && <div>Phone: {leadership.ceo.phone}</div>}
							{leadership.ceo.email && <div>Email: {leadership.ceo.email}</div>}
						</div>
					</Row>
					{(leadership.directorOfQuality.firstName ||
						leadership.directorOfQuality.email) && (
						<Row label="Director of Quality">
							<div className="review__contact">
								<div className="review__contact-name">
									{leadership.directorOfQuality.firstName}{" "}
									{leadership.directorOfQuality.lastName}
								</div>
								{leadership.directorOfQuality.phone && (
									<div>Phone: {leadership.directorOfQuality.phone}</div>
								)}
								{leadership.directorOfQuality.email && (
									<div>Email: {leadership.directorOfQuality.email}</div>
								)}
							</div>
						</Row>
					)}
					<Row label="Invoicing Contact">
						<div className="review__contact">
							<div className="review__contact-name">
								{leadership.invoicingContact.firstName}{" "}
								{leadership.invoicingContact.lastName}
							</div>
							{leadership.invoicingContact.phone && (
								<div>Phone: {leadership.invoicingContact.phone}</div>
							)}
							{leadership.invoicingContact.email && (
								<div>Email: {leadership.invoicingContact.email}</div>
							)}
							<div>
								Billing Address:{" "}
								{leadership.invoicingContact.billingAddress.street},{" "}
								{leadership.invoicingContact.billingAddress.city},{" "}
								{findStateName(
									leadership.invoicingContact.billingAddress.state,
								)}{" "}
								{leadership.invoicingContact.billingAddress.zip}
							</div>
						</div>
					</Row>
				</Section>

				{/* Site Information */}
				<Section title="Site Information" onEdit={() => goToStep(4)}>
					<Row label="Site Configuration">
						{site.locationType === "single" && "Single Location"}
						{site.locationType === "multiple" &&
							`Multiple Locations${site.multipleSites.length > 0 ? ` (${site.multipleSites.length} sites)` : ""}`}
						{!site.locationType && "—"}
					</Row>
					{site.locationType === "multiple" && (
						<Row label="Input Method">
							{site.inputMethod === "upload" && "File Upload"}
							{site.inputMethod === "manual" && "Manual Entry"}
							{!site.inputMethod && "—"}
						</Row>
					)}
					{site.locationType === "single" && (
						<Row label="Address">
							{site.singleSite.street}, {site.singleSite.city},{" "}
							{findStateName(site.singleSite.state)} {site.singleSite.zip}
							{site.singleSite.daysOpen.length > 0 && (
								<div>Days Open: {site.singleSite.daysOpen.join(", ")}</div>
							)}
						</Row>
					)}
					{site.locationType === "multiple" &&
						site.inputMethod === "manual" &&
						site.multipleSites.map((s, idx) => (
							<Row key={s.id} label={`Practice Location ${idx + 1}`}>
								<div className="review__contact">
									{s.name && (
										<div className="review__contact-name">{s.name}</div>
									)}
									<div>
										{s.street}, {s.city}, {findStateName(s.state)} {s.zip}
									</div>
									{s.fteCount && (
										<div>
											FTEs: {s.fteCount} | Shifts: {s.shiftsPerDay} | Miles to
											Main: {s.milesToMain}
										</div>
									)}
									{s.daysOpen.length > 0 && (
										<div>Days Open: {s.daysOpen.join(", ")}</div>
									)}
								</div>
							</Row>
						))}
					{site.uploadedFile && (
						<Row label="Uploaded File">{site.uploadedFile.name}</Row>
					)}
				</Section>

				{/* Services & Certifications */}
				<Section title="Services & Certifications" onEdit={() => goToStep(5)}>
					<Row label="Services Provided">
						<div className="review__chips">
							{services.selectedServices.map((id) => (
								<Pill key={id} tone="outline">
									{findServiceLabel(id)}
								</Pill>
							))}
							{services.otherServices.filter(Boolean).map((txt, idx) => (
								<Pill key={`other-${idx}`} tone="outline">
									{txt}
								</Pill>
							))}
							{services.selectedServices.length === 0 &&
								services.otherServices.length === 0 &&
								"—"}
						</div>
					</Row>
					<Row label="Standards to Apply">
						<div className="review__chips">
							{services.standards.map((value) => (
								<Pill key={value} tone="outline">
									{findStandardLabel(value)}
								</Pill>
							))}
							{services.standards.length === 0 && "—"}
						</div>
					</Row>
					{services.applicationDate && (
						<Row label="Date of Application">
							{formatDate(services.applicationDate)}
						</Row>
					)}
					{services.expirationDate && (
						<Row label="Expiration Date of Current Stroke Certification">
							{formatDate(services.expirationDate)}
						</Row>
					)}
					{services.thrombolyticDates.length > 0 && (
						<Row label="Dates of last twenty-five thrombolytic administrations">
							<div className="review__dates">
								{services.thrombolyticDates.map((d, i) => (
									<span key={i} className="review__date">
										{formatDate(d)}
									</span>
								))}
							</div>
						</Row>
					)}
					{services.thrombectomyDates.length > 0 && (
						<Row label="Dates of last fifteen thrombectomies">
							<div className="review__dates">
								{services.thrombectomyDates.map((d, i) => (
									<span key={i} className="review__date">
										{formatDate(d)}
									</span>
								))}
							</div>
						</Row>
					)}
				</Section>

				{/* Submit block */}
				<div className="review__submit-block">
					<h4 className="review__submit-title">Ready to Submit?</h4>
					<Checkbox
						name="certified"
						label="I certify that all information provided is accurate and complete to the best of my knowledge"
						checked={data.reviewAndSubmit.certified}
						onChange={handleCertify}
					/>
					{stepErrors.certified && (
						<span className="step__error" role="alert">
							{stepErrors.certified}
						</span>
					)}
					<p className="review__submit-note">
						By submitting this form, you agree to our terms and conditions. DNV
						will review your application and contact you within 2-3 business
						days.
					</p>
					<div className="review__download-buttons">
						<Button variant="secondary" onClick={() => downloadPayload("pdf")}>
							Download as PDF
						</Button>
						<Button variant="secondary" onClick={() => downloadPayload("csv")}>
							Export to CSV
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Step6Review;
