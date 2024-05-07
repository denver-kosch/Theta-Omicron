import {useState} from 'react';
import { Link, useNavigate, } from 'react-router-dom';


export const NavBar = ({children}) => {
    const [logoPath, setLP] = useState('/images/crestBW.png');
    const [logo, setL] = useState("Monochrome Kappa Sigma Crest");
    const [homeColor, toggleHomeColor] = useState("black");
    const [rushColor, toggleRushColor] = useState("black");
    const [portalColor, togglePortalColor] = useState("black");
    const [dirColor, toggleDirColor] = useState("black");
    const [loColor, toggleLoColor] = useState("black");
    const navigate = useNavigate();

    
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

    const logout = () => {
        localStorage.removeItem("token");
        navigate("/portal");
    };

    return (
    <>
        <nav className="navbar">
            <table className="navTable">
                <tbody>
                    <tr>
                        <td>
                            <Link to={"/portal"} className="navLink">
                                <div className="homeButton" onMouseOver={logoHover} onMouseOut={leaveLogo}>
                                    <img
                                        src={logoPath}
                                        alt={logo}
                                        className="logo"
                                    />
                                    <h3 style={{color: homeColor, paddingLeft: '20px'}}>Portal Home</h3>
                                </div>
                            </Link>
                        </td>
                        <td style={{width: "100%"}}></td>
                        <td>
                            <Link className="navLink" to={"/portal"}>
                                <h3 style={{color: rushColor}} onMouseOver={() => toggleRushColor("#ae1717")} onMouseOut={() => toggleRushColor("black")}>
                                    Rush
                                </h3>
                            </Link>
                        </td>
                        <td>
                            <Link className="navLink" to={"/portal"}>
                                <h3 style={{color: dirColor}} onMouseOver={() => toggleDirColor("#ae1717")} onMouseOut={() => toggleDirColor("black")}>
                                    Brothers Directory
                                </h3>
                            </Link>
                        </td>
                        <td>
                            <Link className="navLink" to={"/portal/gs"}>
                                <h3 style={{color:portalColor}} onMouseOver={() => togglePortalColor("#ae1717")} onMouseOut={() => togglePortalColor("black")}>
                                    Brothers Portal
                                </h3>
                            </Link>
                        </td>
                        <td>
                            <Link className="navLink" onClick={logout}>
                            <h3 style={{color: loColor}} onMouseOver={() => toggleLoColor("#ae1717")} onMouseOut={() => toggleLoColor("black")}>Log Out</h3>
                            </Link>
                        </td>
                    </tr>
                </tbody>
            </table>
        </nav>
        {children}
    </>
)};