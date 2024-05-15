import React, { useState } from "react";
import "./componentCSS/navbar.css";
import { Link } from "react-router-dom";

const Navbar = ({children}) => {
    const [logoPath, setLP] = useState('/images/crestBW.png');
    const [logo, setL] = useState("Monochrome Kappa Sigma Crest");
    const [aboutOpen, toggleAboutOpen] = useState(false);

    
    const logoHover = () => {
        setLP('/images/crestC.png');
        setL("Colored Kappa Sigma Crest");
    }
    const leaveLogo = () => {
        setLP('/images/crestBW.png');
        setL("Monochrome Kappa Sigma Crest");
    }

    return (
        <>
            <nav>
                <div className="navContainer">
                    <Link to={"/"} className="homeButton" onMouseOver={logoHover} onMouseOut={leaveLogo}>
                        <img src={logoPath} alt={logo} className="logo"/>
                        <h3>Kappa<br/>Sigma</h3>
                    </Link>
                    <div className="navLinks">
                        <div className="dropButton" onMouseOver={() => toggleAboutOpen(true)} onMouseOut={() => toggleAboutOpen(false)}>
                            <Link className="navLink" to={"/about/"}>
                                <h3>About Us</h3>
                            </Link>
                            {aboutOpen &&
                            <div className="dropdown">
                                <Link className="navLink" to={"/about/rush"}>
                                    <h4>Leadership</h4>
                                </Link>
                                <Link className="navLink" to={"/about/rush"}>
                                    <h4>Rush</h4>
                                </Link>
                            </div>
                            }
                        </div>
                        <Link className="navLink" to={"/directory"}>
                            <h3>Brothers<br/>Directory</h3>
                        </Link>
                        <Link className="navLink" to={"/portal"}>
                            <h3>Brothers<br/>Portal</h3>
                        </Link>
                    </div>
                </div>
            </nav>
            {children}
        </>
    )
}

export default Navbar;