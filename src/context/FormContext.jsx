import {
	createContext,
	useContext,
	useReducer,
	useCallback,
	useMemo,
} from "react";
import { TOTAL_STEPS } from "../constants/steps";

const FormContext = createContext(null);

const initialState = {
	currentStep: 1,
	visitedSteps: new Set([1]),
	data: {
		// Step 1 - DNV Quote Request
		quoteRequest: {
			legalEntityName: "",
			dbaName: "",
			sameAsLegalEntity: false,
			primaryContact: {
				firstName: "",
				lastName: "",
				title: "",
				workPhone: "",
				cellPhone: "",
				email: "",
				emailVerified: false,
			},
		},
		// Step 2 - Facility Details
		facilityDetails: {
			facilityType: "",
			otherFacilityType: "",
		},
		// Step 3 - Leadership Contacts
		leadershipContacts: {
			ceo: {
				firstName: "",
				lastName: "",
				phone: "",
				email: "",
				sameAsPrimary: false,
			},
			directorOfQuality: {
				firstName: "",
				lastName: "",
				phone: "",
				email: "",
				sameAsPrimary: false,
			},
			invoicingContact: {
				firstName: "",
				lastName: "",
				phone: "",
				email: "",
				sameAsPrimary: false,
				billingAddress: {
					street: "",
					city: "",
					state: "",
					zip: "",
				},
			},
		},
		// Step 4/5 - Site Information
		siteInformation: {
			locationType: "", // 'single' | 'multiple'
			inputMethod: "", // 'upload' | 'manual'  (for multiple locations)
			uploadedFile: null,
			singleSite: {
				address: "",
				city: "",
				state: "",
				zip: "",
				fteCount: "",
				shiftsPerDay: "",
				milesToMain: "",
				daysOpen: [],
			},
			multipleSites: [],
		},
		// Step 5 - Services & Certifications
		servicesAndCertifications: {
			selectedServices: [], // service IDs
			otherServices: [], // free text entries
			standards: [], // standard values
			expirationDate: "",
			applicationDate: "",
			thrombolyticDates: [],
			thrombectomyDates: [],
		},
		// Step 6 - Review & Submit
		reviewAndSubmit: {
			certified: false,
		},
	},
	errors: {},
};

const formReducer = (state, action) => {
	switch (action.type) {
		case "SET_STEP": {
			const next = Math.min(Math.max(action.payload, 1), TOTAL_STEPS);
			const visited = new Set(state.visitedSteps);
			visited.add(next);
			return { ...state, currentStep: next, visitedSteps: visited };
		}
		case "UPDATE_SECTION": {
			const { section, values } = action.payload;
			return {
				...state,
				data: {
					...state.data,
					[section]: { ...state.data[section], ...values },
				},
			};
		}
		case "UPDATE_NESTED": {
			const { section, subsection, values } = action.payload;
			return {
				...state,
				data: {
					...state.data,
					[section]: {
						...state.data[section],
						[subsection]: {
							...state.data[section][subsection],
							...values,
						},
					},
				},
			};
		}
		case "REPLACE_SECTION": {
			const { section, values } = action.payload;
			return {
				...state,
				data: { ...state.data, [section]: values },
			};
		}
		case "SET_ERRORS": {
			return {
				...state,
				errors: {
					...state.errors,
					[action.payload.step]: action.payload.errors,
				},
			};
		}
		case "CLEAR_ERRORS": {
			const nextErrors = { ...state.errors };
			delete nextErrors[action.payload];
			return { ...state, errors: nextErrors };
		}
		case "RESET":
			return initialState;
		default:
			return state;
	}
};

export const FormProvider = ({ children }) => {
	const [state, dispatch] = useReducer(formReducer, initialState);

	const goToStep = useCallback((step) => {
		dispatch({ type: "SET_STEP", payload: step });
	}, []);

	const nextStep = useCallback(() => {
		dispatch({ type: "SET_STEP", payload: state.currentStep + 1 });
	}, [state.currentStep]);

	const prevStep = useCallback(() => {
		dispatch({ type: "SET_STEP", payload: state.currentStep - 1 });
	}, [state.currentStep]);

	const updateSection = useCallback((section, values) => {
		dispatch({ type: "UPDATE_SECTION", payload: { section, values } });
	}, []);

	const updateNested = useCallback((section, subsection, values) => {
		dispatch({
			type: "UPDATE_NESTED",
			payload: { section, subsection, values },
		});
	}, []);

	const replaceSection = useCallback((section, values) => {
		dispatch({ type: "REPLACE_SECTION", payload: { section, values } });
	}, []);

	const setStepErrors = useCallback((step, errors) => {
		dispatch({ type: "SET_ERRORS", payload: { step, errors } });
	}, []);

	const clearStepErrors = useCallback((step) => {
		dispatch({ type: "CLEAR_ERRORS", payload: step });
	}, []);

	const resetForm = useCallback(() => {
		dispatch({ type: "RESET" });
	}, []);

	const value = useMemo(
		() => ({
			state,
			data: state.data,
			currentStep: state.currentStep,
			visitedSteps: state.visitedSteps,
			errors: state.errors,
			goToStep,
			nextStep,
			prevStep,
			updateSection,
			updateNested,
			replaceSection,
			setStepErrors,
			clearStepErrors,
			resetForm,
		}),
		[
			state,
			goToStep,
			nextStep,
			prevStep,
			updateSection,
			updateNested,
			replaceSection,
			setStepErrors,
			clearStepErrors,
			resetForm,
		],
	);

	return <FormContext.Provider value={value}>{children}</FormContext.Provider>;
};

export const useFormContext = () => {
	const context = useContext(FormContext);
	if (!context) {
		throw new Error("useFormContext must be used inside <FormProvider>");
	}
	return context;
};
