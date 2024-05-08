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
            <div className="navContainer">
                <Link to={"/portal"} className="homeButton" onMouseOver={logoHover} onMouseOut={leaveLogo}>
                    <img src={logoPath} alt={logo} className="logo"/>
                    <h3 style={{ color: homeColor }}>Portal Home</h3>
                </Link>
                <div className="navLinks">
                    <Link className="navLink" to={"/portal"}>
                        <h3 onMouseOver={() => toggleRushColor("#ae1717")} onMouseOut={() => toggleRushColor("black")} style={{ color: rushColor }}>
                            Rush
                        </h3>
                    </Link>
                    <Link className="navLink" to={"/portal"}>
                        <h3 onMouseOver={() => toggleDirColor("#ae1717")} onMouseOut={() => toggleDirColor("black")} style={{ color: dirColor }}>
                            Brothers<br/>Directory
                        </h3>
                    </Link>
                    <Link className="navLink" to={"/portal"}>
                        <h3 onMouseOver={() => togglePortalColor("#ae1717")} onMouseOut={() => togglePortalColor("black")} style={{ color: portalColor }}>
                            Brothers<br/>Portal
                        </h3>
                    </Link>
                    <Link className="navLink" to="/" onClick={logout}>
                        <h3 onMouseOver={() => toggleLoColor("#ae1717")} onMouseOut={() => toggleLoColor("black")} style={{ color: loColor }}>
                            Log<br/>Out
                        </h3>
                    </Link>
                </div>
            </div>
        </nav>
        {children}
    </>
)};