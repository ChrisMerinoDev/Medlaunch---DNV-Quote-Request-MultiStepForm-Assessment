import "../../styles/components/common/Button.css";

/**
 * Button supports three visual variants:
 *  - primary   : filled navy, used for Continue / Save / Submit
 *  - secondary : outlined navy, used for Previous / Exit
 *  - ghost     : transparent, used for inline actions like "+ Add Other"
 */
const Button = ({
	children,
	variant = "primary",
	type = "button",
	onClick,
	disabled = false,
	icon = null,
	className = "",
	...rest
}) => {
	const classes = ["btn", `btn--${variant}`, className]
		.filter(Boolean)
		.join(" ");
	return (
		<button
			type={type}
			className={classes}
			onClick={onClick}
			disabled={disabled}
			{...rest}
		>
			{icon && <span className="btn__icon">{icon}</span>}
			<span className="btn__label">{children}</span>
		</button>
	);
};

export default Button;
