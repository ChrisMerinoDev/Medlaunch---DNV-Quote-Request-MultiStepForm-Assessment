import "../../styles/components/common/Pill.css";

/**
 * Small rounded tag. Supports several visual tones plus an optional onRemove handler,
 * used for standards chips, selected service tags, date chips etc.
 */
const Pill = ({ children, tone = "neutral", onRemove, className = "" }) => {
	return (
		<span className={`pill pill--${tone} ${className}`}>
			<span className="pill__label">{children}</span>
			{onRemove && (
				<button
					type="button"
					className="pill__remove"
					onClick={onRemove}
					aria-label="Remove"
				>
					<svg width="10" height="10" viewBox="0 0 10 10" aria-hidden="true">
						<path
							d="M2 2 L8 8 M8 2 L2 8"
							stroke="currentColor"
							strokeWidth="1.5"
							strokeLinecap="round"
						/>
					</svg>
				</button>
			)}
		</span>
	);
};

export default Pill;
