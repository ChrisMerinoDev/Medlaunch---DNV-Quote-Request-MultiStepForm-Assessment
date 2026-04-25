import "../../styles/components/common/Card.css";

const Card = ({
	title,
	subtitle,
	children,
	className = "",
	headerRight = null,
}) => {
	return (
		<section className={`card ${className}`}>
			{(title || headerRight) && (
				<header className="card__header">
					<div className="card__header-text">
						{title && <h3 className="card__title">{title}</h3>}
						{subtitle && <p className="card__subtitle">{subtitle}</p>}
					</div>
					{headerRight && (
						<div className="card__header-right">{headerRight}</div>
					)}
				</header>
			)}
			<div className="card__body">{children}</div>
		</section>
	);
};

export default Card;
