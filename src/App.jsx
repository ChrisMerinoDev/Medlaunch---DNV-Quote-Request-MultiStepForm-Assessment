import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { FormProvider } from "./context/FormContext";
import QuoteRequestPage from "./pages/QuoteRequestPage";

const App = () => {
	return (
		<BrowserRouter>
			<FormProvider>
				<Routes>
					<Route path="/" element={<Navigate to="/quote-request" replace />} />
					<Route path="/quote-request" element={<QuoteRequestPage />} />
					<Route path="*" element={<Navigate to="/quote-request" replace />} />
				</Routes>
			</FormProvider>
		</BrowserRouter>
	);
};

export default App;
