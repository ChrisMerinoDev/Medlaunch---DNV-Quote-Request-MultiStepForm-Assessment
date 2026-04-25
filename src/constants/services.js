/**
 * Catalog of services, grouped by category. Used on the
 * Services & Certifications step.
 */
export const SERVICE_CATEGORIES = [
	{
		id: "emergency_critical",
		name: "Emergency & Critical Care",
		tab: "clinical",
		services: [
			{ id: "emergency_department", label: "Emergency Department" },
			{ id: "neonatal_icu", label: "Neonatal Intensive Care Services" },
			{ id: "pediatric_icu", label: "Pediatric Intensive Care Services" },
			{ id: "adult_icu", label: "Adult Intensive Care Services" },
		],
	},
	{
		id: "cardiac",
		name: "Cardiac Services",
		tab: "clinical",
		services: [
			{ id: "cardiac_cath_lab", label: "Cardiac Catheterization Laboratory" },
			{ id: "open_heart", label: "Open Heart" },
		],
	},
	{
		id: "diagnostic",
		name: "Diagnostic Services",
		tab: "diagnostic",
		services: [
			{ id: "mri", label: "Magnetic Resonance Imaging (MRI)" },
			{
				id: "diagnostic_radioisotope",
				label: "Diagnostic Radioisotope Facility",
			},
			{ id: "lithotripsy", label: "Lithotripsy" },
		],
	},
	{
		id: "rehabilitation",
		name: "Rehabilitation Services",
		tab: "rehabilitation",
		services: [
			{ id: "physical_rehab", label: "Physical Rehabilitation Services" },
			{ id: "physical_therapy", label: "Physical Therapy" },
			{ id: "occupational_therapy", label: "Occupational Therapy" },
			{ id: "speech_therapy", label: "Speech/Language Therapy" },
			{ id: "audiology", label: "Audiology" },
		],
	},
	{
		id: "surgical",
		name: "Surgical Services",
		tab: "surgical",
		services: [
			{ id: "general_surgery", label: "General Surgery" },
			{ id: "orthopedic_surgery", label: "Orthopedic Surgery" },
			{ id: "neurosurgery", label: "Neurosurgery" },
		],
	},
	{
		id: "specialty",
		name: "Specialty Services",
		tab: "specialty",
		services: [
			{ id: "oncology", label: "Oncology" },
			{ id: "obstetrics", label: "Obstetrics" },
			{ id: "palliative_care", label: "Palliative Care" },
		],
	},
];

export const SERVICE_TABS = [
	{ id: "all", label: "All Services" },
	{ id: "clinical", label: "Clinical" },
	{ id: "surgical", label: "Surgical" },
	{ id: "diagnostic", label: "Diagnostic" },
	{ id: "rehabilitation", label: "Rehabilitation" },
	{ id: "specialty", label: "Specialty" },
];

export const STANDARDS = [
	{ value: "niahho", label: "NIAHO Hospital Accreditation" },
	{ value: "stroke", label: "Primary Stroke Certification" },
	{ value: "hip_knee", label: "Hip & Knee Replacement Certification" },
	{ value: "palliative", label: "Palliative Care Certification" },
	{ value: "infection", label: "Infection Prevention Certification" },
	{ value: "managing_infection", label: "Managing Infection Risk (MIR)" },
];
