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
        ]
    };

    const directory = {
        parent: {
            link: '/directory/',
            title: <>Brothers<br/>Directory</>
        },
        children: [
            {title: "Family Trees", link: "/directory/trees"},
            {title: "Alumni", link: "/directory/alumni"},
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
    )
};

export default Navbar;