import "../../styles/components/layout/Header.css";

const Header = ({ userName = "Katherine Martinez" }) => {
	const initials = userName
		.split(" ")
		.map((n) => n[0])
		.slice(0, 2)
		.join("")
		.toUpperCase();

	return (
		<header className="app-header">
			<div className="app-header__inner">
				<div className="app-header__brand">DNV Healthcare</div>
				<div className="app-header__user">
					<div className="app-header__avatar" aria-hidden="true">
						{initials}
					</div>
					<span className="app-header__name">{userName}</span>
				</div>
			</div>
		</header>
	);
};

export default Header;
