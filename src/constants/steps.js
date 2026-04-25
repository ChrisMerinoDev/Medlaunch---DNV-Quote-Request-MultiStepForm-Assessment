/**
 * Configuration for each step of the multi-step form.
 * The `key` must match the data slice in FormContext state.
 */
export const FORM_STEPS = [
	{ id: 1, key: "quoteRequest", label: "DNV Quote Request" },
	{ id: 2, key: "facilityDetails", label: "Facility Details" },
	{ id: 3, key: "leadershipContacts", label: "Leadership Contacts" },
	{ id: 4, key: "siteInformation", label: "Site Information" },
	{
		id: 5,
		key: "servicesAndCertifications",
		label: "Services & Certifications",
	},
	{ id: 6, key: "reviewAndSubmit", label: "Review & Submit" },
];

export const TOTAL_STEPS = FORM_STEPS.length;
