import { FORM_STEPS } from "../../constants/steps";
import "../../styles/components/layout/ProgressIndicator.css";

/**
 * Visual step tracker. Replicates the Figma progress-indicator component:
 * a row of horizontal bars + labels that fill in navy as the user advances.
 */
const ProgressIndicator = ({ currentStep }) => {
	return (
		<nav className="progress" aria-label="Form progress">
			<ol className="progress__list">
				{FORM_STEPS.map((step) => {
					const isComplete = step.id < currentStep;
					const isActive = step.id === currentStep;
					const state = isActive
						? "active"
						: isComplete
							? "complete"
							: "pending";
					return (
						<li
							key={step.id}
							className={`progress__item progress__item--${state}`}
							aria-current={isActive ? "step" : undefined}
						>
							<span className="progress__bar" />
							<span className="progress__label">{step.label}</span>
						</li>
					);
				})}
			</ol>
		</nav>
	);
};

export default ProgressIndicator;
