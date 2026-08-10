import { Link } from "react-router-dom";
import DropDown from "./dropdown";
import type { DropdownContent, NavbarProps } from "@/types";

const about: DropdownContent = {
	parent: {
		link: "/about/",
		title: <>About Us</>,
	},
	children: [
		{title: "Leadership", link: "/about/leadership"},
		{title: "Rush", link: "/about/rush"},
		{title: "Events", link: "/event/calendar"},
	],
};

const directory: DropdownContent = {
	parent: {
		link: "/directory/",
		title: <>Brothers<br/>Directory</>,
	},
	children: [
		{title: "Family Trees", link: "/directory/trees"},
	],
};

const Navbar = ({children}: NavbarProps) => {
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
						<DropDown content={directory}/>
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
	);
};

export default Navbar;
