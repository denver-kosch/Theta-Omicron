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
                <>
                    <table className="navTable">
                        <tbody>
                            <tr>
                                <td>
                                    <Link to={"/"} className="navLink">
                                        <div className="homeButton" onMouseOver={logoHover} onMouseOut={leaveLogo}>
                                            <img
                                                src={logoPath}
                                                alt={logo}
                                                className="logo"
                                            />
                                            <h3 style={{color: homeColor, paddingLeft: '20px'}}>Kappa Sigma</h3>
                                        </div>
                                    </Link>
                                </td>
                                <td style={{width: "100%"}}></td>
                                <td>
                                    <Link className="navLink" to={"/rush"}>
                                        <h3 style={{color: rushColor}} onMouseOver={() => toggleRushColor("#ae1717")} onMouseOut={() => toggleRushColor("black")}>
                                            Rush
                                        </h3>
                                    </Link>
                                </td>
                                <td>
                                    <Link className="navLink" to={"/directory"}>
                                        <h3 style={{color: dirColor}} onMouseOver={() => toggleDirColor("#ae1717")} onMouseOut={() => toggleDirColor("black")}>
                                            Brothers Directory
                                        </h3>
                                    </Link>
                                </td>
                                <td>
                                    <Link className="navLink" to={"/portal"}>
                                        <h3 style={{color:portalColor}} onMouseOver={() => togglePortalColor("#ae1717")} onMouseOut={() => togglePortalColor("black")}>
                                            Brothers Portal
                                        </h3>
                                    </Link>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </>
            </nav>
            {children}
        </>
    )
}

export default Navbar;