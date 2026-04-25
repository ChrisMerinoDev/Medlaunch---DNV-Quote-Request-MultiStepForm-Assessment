import "../../styles/components/layout/SupportChat.css";

const SupportChat = () => {
	const handleClick = () => {
		// Placeholder — in a real app this would open a chat widget.
		// eslint-disable-next-line no-console
		console.log("Support chat opened");
	};

	return (
		<button
			type="button"
			onClick={handleClick}
			className="support-chat"
			aria-label="Open support chat"
		>
			<svg
				width="18"
				height="18"
				viewBox="0 0 24 24"
				fill="none"
				aria-hidden="true"
			>
				<path
					d="M8 12h.01M12 12h.01M16 12h.01M21 12a9 9 0 1 1-3.515-7.122L21 3v6h-6"
					stroke="currentColor"
					strokeWidth="2"
					strokeLinecap="round"
					strokeLinejoin="round"
				/>
			</svg>
			<span>Support Chat</span>
		</button>
	);
};

export default SupportChat;
