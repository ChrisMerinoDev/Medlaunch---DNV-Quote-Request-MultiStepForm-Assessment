import { useEffect } from "react";
import Card from "../common/Card";
import SelectableCard from "../common/SelectableCard";
import Input from "../common/Input";
import Button from "../common/Button";
import FileUpload from "../form/FileUpload";
import AddressFields from "../form/AddressFields";
import { useFormContext } from "../../context/FormContext";
import { isRequired, isValidZip } from "../../utils/validators";
import "../../styles/components/steps/Step.css";
import "../../styles/components/steps/Step4SiteInformation.css";

const DAYS = [
	{ value: "M", label: "M" },
	{ value: "T", label: "T" },
	{ value: "W", label: "W" },
	{ value: "TH", label: "Th" },
	{ value: "F", label: "F" },
	{ value: "SA", label: "Sa" },
	{ value: "SU", label: "Su" },
];

const emptySite = () => ({
	id: `site_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
	name: "",
	street: "",
	city: "",
	state: "",
	zip: "",
	fteCount: "",
	shiftsPerDay: "",
	milesToMain: "",
	daysOpen: [],
});

const Step4SiteInformation = ({ registerValidator }) => {
	const { data, updateSection } = useFormContext();
	const section = data.siteInformation;

	useEffect(() => {
		registerValidator?.(() => {
			const errors = {};
			if (isRequired(section.locationType)) {
				errors.locationType = "Please select an option";
				return errors;
			}
			if (section.locationType === "single") {
				const s = section.singleSite;
				if (isRequired(s.street)) errors.street = isRequired(s.street);
				if (isRequired(s.city)) errors.city = isRequired(s.city);
				if (isRequired(s.state)) errors.state = isRequired(s.state);
				if (isValidZip(s.zip)) errors.zip = isValidZip(s.zip);
			} else if (section.locationType === "multiple") {
				if (!section.inputMethod)
					errors.inputMethod = "Please choose how to add your sites";
				if (section.inputMethod === "upload" && !section.uploadedFile) {
					errors.uploadedFile = "Please upload your site information";
				}
			}
			return errors;
		});
	}, [registerValidator, section]);

	// --- Location type toggle -------------------------------------------------
	const setLocationType = (type) => {
		updateSection("siteInformation", {
			locationType: type,
			inputMethod: type === "multiple" ? section.inputMethod || "upload" : "",
		});
	};

	// --- Single site handlers -------------------------------------------------
	const updateSingleSite = (field, value) => {
		updateSection("siteInformation", {
			singleSite: { ...section.singleSite, [field]: value },
		});
	};

	const toggleSingleDay = (day) => {
		const current = section.singleSite.daysOpen;
		const next = current.includes(day)
			? current.filter((d) => d !== day)
			: [...current, day];
		updateSingleSite("daysOpen", next);
	};

	// --- File upload handlers -------------------------------------------------
	const handleFileSelect = (file) => {
		updateSection("siteInformation", {
			uploadedFile: { name: file.name, size: file.size, type: file.type },
		});
	};

	const handleRemoveFile = () => {
		updateSection("siteInformation", { uploadedFile: null });
	};

	const handleDownloadTemplate = () => {
		// Generate a simple CSV template
		const headers = [
			"Site Name",
			"Street Address",
			"City",
			"State",
			"ZIP",
			"FTE Count",
			"Shifts Per Day",
			"Miles to Main",
			"Days Open",
		];
		const csv = headers.join(",") + "\n";
		const blob = new Blob([csv], { type: "text/csv" });
		const url = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = "site-information-template.csv";
		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);
		URL.revokeObjectURL(url);
	};

	// --- Multiple sites manual entry ------------------------------------------
	const setInputMethod = (method) => {
		updateSection("siteInformation", {
			inputMethod: method,
			multipleSites:
				method === "manual" && section.multipleSites.length === 0
					? [emptySite()]
					: section.multipleSites,
		});
	};

	const addSite = () => {
		updateSection("siteInformation", {
			multipleSites: [...section.multipleSites, emptySite()],
		});
	};

	const removeSite = (id) => {
		updateSection("siteInformation", {
			multipleSites: section.multipleSites.filter((s) => s.id !== id),
		});
	};

	const updateMultipleSite = (id, field, value) => {
		updateSection("siteInformation", {
			multipleSites: section.multipleSites.map((s) =>
				s.id === id ? { ...s, [field]: value } : s,
			),
		});
	};

	const toggleMultipleDay = (id, day) => {
		const site = section.multipleSites.find((s) => s.id === id);
		if (!site) return;
		const next = site.daysOpen.includes(day)
			? site.daysOpen.filter((d) => d !== day)
			: [...site.daysOpen, day];
		updateMultipleSite(id, "daysOpen", next);
	};

	return (
		<div className="step">
			<Card>
				<div className="site-info__question">
					Do you have multiple sites or locations?
				</div>
				<div className="site-info__cards">
					<SelectableCard
						title="Single Location"
						description="We operate from one facility only"
						selected={section.locationType === "single"}
						onClick={() => setLocationType("single")}
					/>
					<SelectableCard
						title="Multiple Locations"
						description="We have multiple facilities or practice locations"
						selected={section.locationType === "multiple"}
						onClick={() => setLocationType("multiple")}
					/>
				</div>

				{/* Single location inline form */}
				{section.locationType === "single" && (
					<div className="site-info__single">
						<h4 className="step__section-title">Facility Details</h4>
						<AddressFields
							title=""
							values={section.singleSite}
							onChange={updateSingleSite}
							required
						/>
						<div className="step__grid step__grid--3">
							<Input
								label="FTE Count"
								name="fteCount"
								value={section.singleSite.fteCount}
								onChange={(e) => updateSingleSite("fteCount", e.target.value)}
								type="number"
							/>
							<Input
								label="Shifts Per Day"
								name="shiftsPerDay"
								value={section.singleSite.shiftsPerDay}
								onChange={(e) =>
									updateSingleSite("shiftsPerDay", e.target.value)
								}
								type="number"
							/>
							<Input
								label="Miles to Main"
								name="milesToMain"
								value={section.singleSite.milesToMain}
								onChange={(e) =>
									updateSingleSite("milesToMain", e.target.value)
								}
								type="number"
							/>
						</div>
						<div>
							<div className="step__section-title">Days Open</div>
							<div className="site-info__days">
								{DAYS.map((d) => (
									<button
										key={d.value}
										type="button"
										className={`site-info__day ${
											section.singleSite.daysOpen.includes(d.value)
												? "site-info__day--active"
												: ""
										}`}
										onClick={() => toggleSingleDay(d.value)}
										aria-pressed={section.singleSite.daysOpen.includes(d.value)}
									>
										{d.label}
									</button>
								))}
							</div>
						</div>
					</div>
				)}

				{/* Multiple locations input method picker */}
				{section.locationType === "multiple" && (
					<div className="site-info__multiple">
						<div className="site-info__subheading">
							How would you like to add your site information?
						</div>

						<div className="site-info__method-list">
							<button
								type="button"
								className={`site-info__method ${
									section.inputMethod === "upload"
										? "site-info__method--selected"
										: ""
								}`}
								onClick={() => setInputMethod("upload")}
								aria-pressed={section.inputMethod === "upload"}
							>
								<span className="site-info__method-title">
									Upload CSV / Excel
								</span>
								<span className="site-info__method-description">
									Upload a spreadsheet with all site information
								</span>
							</button>
							<button
								type="button"
								className={`site-info__method ${
									section.inputMethod === "manual"
										? "site-info__method--selected"
										: ""
								}`}
								onClick={() => setInputMethod("manual")}
								aria-pressed={section.inputMethod === "manual"}
							>
								<span className="site-info__method-title">Enter Manually</span>
								<span className="site-info__method-description">
									Fill in each site using the form below
								</span>
							</button>
						</div>

						{section.inputMethod === "upload" && (
							<FileUpload
								uploadedFile={section.uploadedFile}
								onFileSelect={handleFileSelect}
								onRemoveFile={handleRemoveFile}
								onDownloadTemplate={handleDownloadTemplate}
							/>
						)}

						{section.inputMethod === "manual" && (
							<div className="site-info__manual">
								{section.multipleSites.map((site, index) => (
									<div key={site.id} className="site-info__site-card">
										<div className="site-info__site-header">
											<h4 className="step__subsection-title">
												Site #{index + 1}
											</h4>
											{section.multipleSites.length > 1 && (
												<Button
													variant="danger"
													onClick={() => removeSite(site.id)}
												>
													Remove
												</Button>
											)}
										</div>
										<Input
											label="Site Name"
											name={`site-${site.id}-name`}
											value={site.name}
											onChange={(e) =>
												updateMultipleSite(site.id, "name", e.target.value)
											}
										/>
										<AddressFields
											title=""
											values={site}
											onChange={(field, value) =>
												updateMultipleSite(site.id, field, value)
											}
										/>
										<div className="step__grid step__grid--3">
											<Input
												label="FTE Count"
												name={`site-${site.id}-fte`}
												value={site.fteCount}
												onChange={(e) =>
													updateMultipleSite(
														site.id,
														"fteCount",
														e.target.value,
													)
												}
												type="number"
											/>
											<Input
												label="Shifts Per Day"
												name={`site-${site.id}-shifts`}
												value={site.shiftsPerDay}
												onChange={(e) =>
													updateMultipleSite(
														site.id,
														"shiftsPerDay",
														e.target.value,
													)
												}
												type="number"
											/>
											<Input
												label="Miles to Main"
												name={`site-${site.id}-miles`}
												value={site.milesToMain}
												onChange={(e) =>
													updateMultipleSite(
														site.id,
														"milesToMain",
														e.target.value,
													)
												}
												type="number"
											/>
										</div>
										<div>
											<div className="step__section-title">Days Open</div>
											<div className="site-info__days">
												{DAYS.map((d) => (
													<button
														key={d.value}
														type="button"
														className={`site-info__day ${
															site.daysOpen.includes(d.value)
																? "site-info__day--active"
																: ""
														}`}
														onClick={() => toggleMultipleDay(site.id, d.value)}
														aria-pressed={site.daysOpen.includes(d.value)}
													>
														{d.label}
													</button>
												))}
											</div>
										</div>
									</div>
								))}
								<Button variant="ghost" onClick={addSite}>
									+ Add Another Site
								</Button>
							</div>
						)}
					</div>
				)}
			</Card>
		</div>
	);
};

export default Step4SiteInformation;
