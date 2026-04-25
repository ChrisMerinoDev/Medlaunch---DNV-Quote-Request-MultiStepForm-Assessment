import { useCallback, useRef } from "react";
import Header from "../components/layout/Header";
import ProgressIndicator from "../components/layout/ProgressIndicator";
import FormNavigation from "../components/layout/FormNavigation";
import SupportChat from "../components/layout/SupportChat";
import Step1QuoteRequest from "../components/steps/Step1QuoteRequest";
import Step2FacilityDetails from "../components/steps/Step2FacilityDetails";
import Step3LeadershipContacts from "../components/steps/Step3LeadershipContacts";
import Step4SiteInformation from "../components/steps/Step4SiteInformation";
import Step5Services from "../components/steps/Step5Services";
import Step6Review from "../components/steps/Step6Review";
import { useFormContext } from "../context/FormContext";
import { FORM_STEPS, TOTAL_STEPS } from "../constants/steps";
import "../styles/pages/QuoteRequestPage.css";

const STEP_COMPONENTS = {
	1: Step1QuoteRequest,
	2: Step2FacilityDetails,
	3: Step3LeadershipContacts,
	4: Step4SiteInformation,
	5: Step5Services,
	6: Step6Review,
};

const QuoteRequestPage = () => {
	const {
		currentStep,
		data,
		nextStep,
		prevStep,
		setStepErrors,
		clearStepErrors,
		resetForm,
	} = useFormContext();

	// Validators register themselves here via a ref so we don't re-render
	// the page each time a step wires up its validation function.
	const validatorRef = useRef(null);
	const registerValidator = useCallback((fn) => {
		validatorRef.current = fn;
	}, []);

	const runValidator = () => {
		if (typeof validatorRef.current !== "function") return {};
		return validatorRef.current() || {};
	};

	const handleContinue = () => {
		const errors = runValidator();
		if (Object.keys(errors).length > 0) {
			setStepErrors(currentStep, errors);
			// Scroll back to the top so the user can see the first invalid field
			window.scrollTo({ top: 0, behavior: "smooth" });
			// eslint-disable-next-line no-console
			console.warn(`Step ${currentStep} validation failed:`, errors);
			return;
		}
		clearStepErrors(currentStep);
		nextStep();
		window.scrollTo({ top: 0, behavior: "smooth" });
	};

	const handlePrevious = () => {
		clearStepErrors(currentStep);
		prevStep();
		window.scrollTo({ top: 0, behavior: "smooth" });
	};

	const handleSave = () => {
		const payload = {
			step: currentStep,
			savedAt: new Date().toISOString(),
			data,
		};
		// eslint-disable-next-line no-console
		console.log("[DNV Quote Request] Saved draft:", payload);
		alert("Draft saved. Your progress has been stored locally.");
	};

	const handleExit = () => {
		// eslint-disable-next-line no-restricted-globals, no-alert
		const confirmed = confirm(
			"Are you sure you want to exit? Unsaved changes will be lost.",
		);
		if (confirmed) resetForm();
	};

	const handleSubmit = () => {
		const errors = runValidator();
		if (Object.keys(errors).length > 0) {
			setStepErrors(currentStep, errors);
			alert("Please certify before submitting.");
			return;
		}
		const payload = {
			...data,
			submittedAt: new Date().toISOString(),
		};
		// eslint-disable-next-line no-console
		console.log("[DNV Quote Request] Submitted payload:", payload);
		alert(
			"Application submitted successfully! Check the console for the payload.",
		);
	};

	const StepComponent = STEP_COMPONENTS[currentStep];
	const activeStep = FORM_STEPS.find((s) => s.id === currentStep);
	const isLastStep = currentStep === TOTAL_STEPS;

	return (
		<div className="quote-page">
			<Header />

			<main className="quote-page__main">
				<div className="quote-page__container">
					<header className="quote-page__header">
						<div>
							<h2 className="quote-page__title">{activeStep?.label}</h2>
						</div>
						<span className="quote-page__step-count">
							Step {currentStep} of {TOTAL_STEPS}
						</span>
					</header>

					<ProgressIndicator currentStep={currentStep} />

					<div className="quote-page__content">
						<StepComponent registerValidator={registerValidator} />
					</div>

					<FormNavigation
						showPrevious={currentStep > 1}
						showExit={currentStep === 1 || currentStep === 4}
						showSave={!isLastStep}
						isLastStep={isLastStep}
						onPrevious={handlePrevious}
						onContinue={handleContinue}
						onSave={handleSave}
						onSubmit={handleSubmit}
						onExit={handleExit}
					/>
				</div>
			</main>

			<SupportChat />
		</div>
	);
};

export default QuoteRequestPage;
