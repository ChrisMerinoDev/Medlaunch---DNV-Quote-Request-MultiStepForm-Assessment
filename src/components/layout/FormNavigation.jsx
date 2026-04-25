import Button from "../common/Button";
import "../../styles/components/layout/FormNavigation.css";

/**
 * Footer navigation row. Shows Previous / Exit on the left
 * and Save / Continue (or Submit) on the right.
 */
const FormNavigation = ({
	onPrevious,
	onExit,
	onSave,
	onContinue,
	onSubmit,
	showPrevious = true,
	showExit = false,
	showSave = true,
	isLastStep = false,
	continueDisabled = false,
	submitDisabled = false,
}) => {
	return (
		<div className="form-nav">
			<div className="form-nav__left">
				{showPrevious && (
					<Button variant="secondary" onClick={onPrevious}>
						Previous
					</Button>
				)}
				{showExit && (
					<Button variant="secondary" onClick={onExit}>
						Exit
					</Button>
				)}
			</div>
			<div className="form-nav__right">
				{showSave && (
					<Button variant="primary" onClick={onSave}>
						Save
					</Button>
				)}
				{isLastStep ? (
					<Button
						variant="primary"
						onClick={onSubmit}
						disabled={submitDisabled}
					>
						Submit Application
					</Button>
				) : (
					<Button
						variant="primary"
						onClick={onContinue}
						disabled={continueDisabled}
					>
						Continue
					</Button>
				)}
			</div>
		</div>
	);
};

export default FormNavigation;
