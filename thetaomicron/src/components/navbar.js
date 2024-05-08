import { useState } from "react";
import "./componentCSS/navbar.css";
import { Link } from "react-router-dom";

const Navbar = ({children}) => {
    const [logoPath, setLP] = useState('/images/crestBW.png');
    const [logo, setL] = useState("Monochrome Kappa Sigma Crest");
    const [homeColor, toggleHomeColor] = useState("black");
    const [rushColor, toggleRushColor] = useState("black");
    const [portalColor, togglePortalColor] = useState("black");
    const [dirColor, toggleDirColor] = useState("black");

    
    const logoHover = () => {
        setLP('/images/crestC.png');
        setL("Colored Kappa Sigma Crest");
        toggleHomeColor("#ae1717");
    }
    const leaveLogo = () => {
        setLP('/images/crestBW.png');
        setL("Monochrome Kappa Sigma Crest");
        toggleHomeColor("");
    }

    return (
        <>
            <nav className="navbar">
                <div className="navContainer">
                    <Link to={"/"} className="homeButton" onMouseOver={logoHover} onMouseOut={leaveLogo}>
                        <img src={logoPath} alt={logo} className="logo"/>
                        <h3 style={{color: homeColor}}>Kappa<br/>Sigma</h3>
                    </Link>
                    <div className="navLinks">
                        <Link className="navLink" to={"/rush"}  onMouseOver={() => toggleRushColor("#ae1717")} onMouseOut={() => toggleRushColor("black")} >
                            <h3 style={{color: rushColor}}>
                                Rush
                            </h3>
                        </Link>
                        <Link className="navLink" to={"/directory"} onMouseOver={() => toggleDirColor("#ae1717")} onMouseOut={() => toggleDirColor("black")}>
                            <h3 style={{color: dirColor}}>
                                Brothers<br/>Directory
                            </h3>
                        </Link>
                        <Link className="navLink" to={"/portal"} onMouseOver={() => togglePortalColor("#ae1717")} onMouseOut={() => togglePortalColor("black")}>
                            <h3 style={{color: portalColor}}>
                                Brothers<br/>Portal
                            </h3>
                        </Link>
                    </div>
                </div>
            </nav>
            {children}
        </>
    )
}

export default Navbar;