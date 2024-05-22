import React, { useState } from "react";
import { Link } from "react-router-dom";
import { DropDown } from "./navDropdown";

const Navbar = ({children}) => {
    const [logoPath, setLP] = useState('/images/crestBW.png');
    const [logo, setL] = useState("Monochrome Kappa Sigma Crest");

    
    const logoHover = () => {
        setLP('/images/crestC.png');
        setL("Colored Kappa Sigma Crest");
    }
    const leaveLogo = () => {
        setLP('/images/crestBW.png');
        setL("Monochrome Kappa Sigma Crest");
    }

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

    const directory= {
        parent: {
            link: '/directory/',
            title: <>Brothers<br/>Directory</>
        },
        children: [
            {title: "Family Trees", link: "/directory/trees"},
        ]
    };

    return (
        <>
            <nav>
                <div className="navContainer">
                    <Link to={"/"} className="homeButton" onMouseOver={logoHover} onMouseOut={leaveLogo}>
                        <img src={logoPath} alt={logo} className="logo"/>
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
                <a href="https://www.instagram.com/kappasigma_mu/" target="_blank" rel="noopener noreferrer">
                    <img  className="smLogo" src="/images/ig.png" alt="Instagram"/>
                </a>
            </footer>
        </>
    )
}

export default Navbar;