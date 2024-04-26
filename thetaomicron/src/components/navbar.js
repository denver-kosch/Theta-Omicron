import { useState } from "react";
import "./componentCSS/navbar.css";
import crestBW from "../images/crestBW.png";
import crestC from "../images/crestC.png";

const Navbar = () => {
    const [logoPath, setLP] = useState(crestBW);
    const [logo, setL] = useState("Monochrome Kappa Sigma Crest");
    const [homeColor, toggleHomeColor] = useState("black");
    const [rushColor, toggleRushColor] = useState("black");
    const [portalColor, togglePortalColor] = useState("black");
    const [dirColor, toggleDirColor] = useState("black");

    
    const logoHover = () => {
        setLP(crestC);
        setL("Colored Kappa Sigma Crest");
        toggleHomeColor("#ae1717");
    }
    const leaveLogo = () => {
        setLP(crestBW);
        setL("Monochrome Kappa Sigma Crest");
        toggleHomeColor("");
    }

    return (
        <nav className="navbar">
            <>
                <table className="navTable">
                    <tr>
                        <td>
                            <div className="homeButton" onMouseOver={logoHover} onMouseOut={leaveLogo}>
                                <img
                                    src={logoPath}
                                    alt={logo}
                                    className="logo"
                                />
                                <h3 style={{color: homeColor, paddingLeft: '20px'}}>Kappa Sigma</h3>
                            </div>
                        </td>
                        <td style={{width: "100%"}}></td>
                        <td>
                            <h3 
                            style={{color: rushColor}} 
                            onMouseOver={() => toggleRushColor("#ae1717")} 
                            onMouseOut={() => toggleRushColor("black")}
                            >
                                Rush
                            </h3>
                        </td>
                        <td>
                            <h3 
                            style={{textAlign: "center", textWrap: "wrap", color: dirColor}}
                            onMouseOver={() => toggleDirColor("#ae1717")} 
                            onMouseOut={() => toggleDirColor("black")}
                            >
                                Brothers Directory
                            </h3>
                        </td>
                        <td>
                            <h3 
                            style={{textAlign: "center", textWrap: "wrap", color:portalColor}}
                            onMouseOver={() => togglePortalColor("#ae1717")} 
                            onMouseOut={() => togglePortalColor("black")}
                            >
                                Brothers Portal
                            </h3>
                        </td>
                    </tr>
                </table>
            </>
        </nav>
    )
}

export default Navbar;