import { useEffect, useMemo, useState } from "react";
import Card from "../common/Card";
import Checkbox from "../common/Checkbox";
import Input from "../common/Input";
import Button from "../common/Button";
import Pill from "../common/Pill";
import DateChipInput from "../form/DateChipInput";
import { useFormContext } from "../../context/FormContext";
import {
	SERVICE_CATEGORIES,
	SERVICE_TABS,
	STANDARDS,
} from "../../constants/services";
import { isRequired } from "../../utils/validators";
import "../../styles/components/steps/Step.css";
import "../../styles/components/steps/Step5Services.css";

const Step5Services = ({ registerValidator }) => {
	const { data, updateSection } = useFormContext();
	const section = data.servicesAndCertifications;

	const [activeTab, setActiveTab] = useState("all");
	const [searchTerm, setSearchTerm] = useState("");
	const [showStandardsDropdown, setShowStandardsDropdown] = useState(false);

	useEffect(() => {
		registerValidator?.(() => {
			const errors = {};
			if (
				section.selectedServices.length === 0 &&
				section.otherServices.length === 0
			) {
				errors.selectedServices = "Please choose at least one service";
			}
			if (section.standards.length === 0) {
				errors.standards = "Please select at least one standard";
			}
			if (section.applicationDate && isRequired(section.applicationDate)) {
				errors.applicationDate = isRequired(section.applicationDate);
			}
			return errors;
		});
	}, [registerValidator, section]);

	// --- Services catalog filtered by tab + search ---------------------------
	const filteredCategories = useMemo(() => {
		const term = searchTerm.trim().toLowerCase();
		return SERVICE_CATEGORIES.filter(
			(cat) => activeTab === "all" || cat.tab === activeTab,
		)
			.map((cat) => ({
				...cat,
				services: cat.services.filter(
					(svc) => !term || svc.label.toLowerCase().includes(term),
				),
			}))
			.filter((cat) => cat.services.length > 0);
	}, [activeTab, searchTerm]);

	// --- Handlers -------------------------------------------------------------
	const toggleService = (id) => {
		const next = section.selectedServices.includes(id)
			? section.selectedServices.filter((s) => s !== id)
			: [...section.selectedServices, id];
		updateSection("servicesAndCertifications", { selectedServices: next });
	};

	const addOtherService = () => {
		updateSection("servicesAndCertifications", {
			otherServices: [...section.otherServices, ""],
		});
	};

	const updateOtherService = (idx, value) => {
		const next = section.otherServices.map((s, i) => (i === idx ? value : s));
		updateSection("servicesAndCertifications", { otherServices: next });
	};

	const removeOtherService = (idx) => {
		updateSection("servicesAndCertifications", {
			otherServices: section.otherServices.filter((_, i) => i !== idx),
		});
	};

	const toggleStandard = (value) => {
		const next = section.standards.includes(value)
			? section.standards.filter((s) => s !== value)
			: [...section.standards, value];
		updateSection("servicesAndCertifications", { standards: next });
	};

	const removeStandard = (value) => {
		updateSection("servicesAndCertifications", {
			standards: section.standards.filter((s) => s !== value),
		});
	};

	const standardLabel = (value) =>
		STANDARDS.find((s) => s.value === value)?.label ?? value;

	return (
		<div className="step">
			<Card title="Service Offering" subtitle="Primary Site Service offering">
				{/* Tabs */}
				<div className="services__tabs" role="tablist">
					{SERVICE_TABS.map((tab) => (
						<button
							key={tab.id}
							type="button"
							role="tab"
							aria-selected={activeTab === tab.id}
							className={`services__tab ${activeTab === tab.id ? "services__tab--active" : ""}`}
							onClick={() => setActiveTab(tab.id)}
						>
							{tab.label}
						</button>
					))}
				</div>

				{/* Search */}
				<div className="services__search">
					<svg
						className="services__search-icon"
						width="16"
						height="16"
						viewBox="0 0 24 24"
						fill="none"
						aria-hidden="true"
					>
						<circle
							cx="11"
							cy="11"
							r="8"
							stroke="currentColor"
							strokeWidth="2"
						/>
						<path
							d="m21 21-4.35-4.35"
							stroke="currentColor"
							strokeWidth="2"
							strokeLinecap="round"
						/>
					</svg>
					<input
						type="text"
						className="services__search-input"
						placeholder="Search services..."
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
						aria-label="Search services"
					/>
				</div>

				{/* Categories grid */}
				<div className="services__grid">
					{filteredCategories.map((cat) => (
						<div key={cat.id} className="services__category">
							<div className="services__category-title">{cat.name}</div>
							<div className="services__category-list">
								{cat.services.map((svc) => (
									<Checkbox
										key={svc.id}
										name={`svc-${svc.id}`}
										label={svc.label}
										checked={section.selectedServices.includes(svc.id)}
										onChange={() => toggleService(svc.id)}
									/>
								))}
							</div>
						</div>
					))}
					{filteredCategories.length === 0 && (
						<div className="step__empty">No services match your search</div>
					)}
				</div>

				<Button variant="ghost" onClick={addOtherService}>
					+ Add Other Service
				</Button>

				{/* Other services repeater */}
				{section.otherServices.length > 0 && (
					<div className="services__other">
						<div className="step__subsection-title">Other Service</div>
						{section.otherServices.map((value, idx) => (
							<div key={idx} className="services__other-row">
								<Input
									name={`other-service-${idx}`}
									placeholder="Specify other service"
									value={value}
									onChange={(e) => updateOtherService(idx, e.target.value)}
								/>
								<Button
									variant="danger"
									onClick={() => removeOtherService(idx)}
									aria-label="Remove service"
								>
									<svg width="16" height="16" viewBox="0 0 24 24" fill="none">
										<path
											d="M6 6 L18 18 M18 6 L6 18"
											stroke="currentColor"
											strokeWidth="2"
											strokeLinecap="round"
										/>
									</svg>
								</Button>
							</div>
						))}
					</div>
				)}
			</Card>

			<Card title="Standards to Apply">
				<div className="services__standards-wrapper">
					<button
						type="button"
						className="services__standards-trigger"
						onClick={() => setShowStandardsDropdown((v) => !v)}
						aria-expanded={showStandardsDropdown}
						aria-haspopup="listbox"
					>
						<span className="services__standards-placeholder">
							{section.standards.length === 0
								? "Select Standard(s)"
								: `${section.standards.length} selected`}
						</span>
						<svg width="14" height="14" viewBox="0 0 12 12" aria-hidden="true">
							<path
								d="M2 4 L6 8 L10 4"
								stroke="currentColor"
								strokeWidth="1.5"
								fill="none"
								strokeLinecap="round"
								strokeLinejoin="round"
							/>
						</svg>
					</button>
					{showStandardsDropdown && (
						<div className="services__standards-dropdown" role="listbox">
							{STANDARDS.map((std) => (
								<Checkbox
									key={std.value}
									name={`std-${std.value}`}
									label={std.label}
									checked={section.standards.includes(std.value)}
									onChange={() => toggleStandard(std.value)}
									className="services__standards-option"
								/>
							))}
						</div>
					)}
				</div>

				{section.standards.length > 0 && (
					<div className="services__standards-chips">
						{section.standards.map((value) => (
							<Pill
								key={value}
								tone="outline"
								onRemove={() => removeStandard(value)}
							>
								{standardLabel(value)}
							</Pill>
						))}
					</div>
				)}

				<div className="step__grid step__grid--2">
					<Input
						label="Expiration Date of Current Stroke Certification"
						type="date"
						name="expirationDate"
						value={section.expirationDate}
						onChange={(e) =>
							updateSection("servicesAndCertifications", {
								expirationDate: e.target.value,
							})
						}
					/>
					<Input
						label="Date of Application"
						type="date"
						name="applicationDate"
						value={section.applicationDate}
						onChange={(e) =>
							updateSection("servicesAndCertifications", {
								applicationDate: e.target.value,
							})
						}
					/>
				</div>

				<DateChipInput
					label="Dates of last twenty-five thrombolytic administrations"
					name="thrombolyticDates"
					values={section.thrombolyticDates}
					onChange={(vals) =>
						updateSection("servicesAndCertifications", {
							thrombolyticDates: vals,
						})
					}
				/>
				<DateChipInput
					label="Dates of last fifteen thrombectomies"
					name="thrombectomyDates"
					values={section.thrombectomyDates}
					onChange={(vals) =>
						updateSection("servicesAndCertifications", {
							thrombectomyDates: vals,
						})
					}
				/>
			</Card>
		</div>
	);
};

export default Step5Services;
