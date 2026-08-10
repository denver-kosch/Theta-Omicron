import { Link } from "react-router-dom";
import DropDown from "./dropdown";

const Navbar = ({children}) => {
	const about = {
		parent: {
			link: '/about/',
			title: <>About Us</>
		},
		children: [
			{title: "Leadership", link: "/about/leadership"},
			{title: "Rush", link: "/about/rush"},
			{title: "Events", link: '/event/calendar'}
		]
	};

	return (
		<>
			<nav>
				<div className="navContainer">
					<Link to={"/"} className="homeButton navLink">
						<img alt='Kappa Sigma Crest' className="logo"/>
						<h3>Kappa<br/>Sigma</h3>
					</Link>
					<div className="navLinks">
						<DropDown content={about}/>
						<Link className="navLink" to={"/directory"}>
							<h3>Brothers<br/>Directory</h3>
						</Link>
						<Link className="navLink" to={"/portal"}>
							<h3>Brothers<br/>Portal</h3>
						</Link>
					</div>
				</div>
			</nav>
			<main>
				{children}
			</main>
			<footer>
				<div className="IG">
					<h2>{'Check us out ->'}</h2>
					<a href="https://www.instagram.com/kappasigma_mu/" target="_blank" rel="noopener noreferrer">
						<img className="smLogo" alt="Instagram"/>
					</a>
				</div>
			</footer>
		</>
	)
};

export default Navbar;
