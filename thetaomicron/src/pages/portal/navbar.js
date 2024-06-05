import {useState} from 'react';
import { Link, useNavigate, } from 'react-router-dom';


export const NavBar = ({children}) => {
    const [logoPath, setLP] = useState('/images/crestBW.png');
    const [logo, setL] = useState("Monochrome Kappa Sigma Crest");
    const navigate = useNavigate();

    
    const logoHover = () => {
        setLP('/images/crestC.png');
        setL("Colored Kappa Sigma Crest");
    };
    const leaveLogo = () => {
        setLP('/images/crestBW.png');
        setL("Monochrome Kappa Sigma Crest");
    };

    const logout = () => {
        localStorage.removeItem("token");
        navigate("/portal");
    };

    return (
    <>
        <nav>
            <div className="navContainer">
                <Link to={"/portal"} className="homeButton" onMouseOver={logoHover} onMouseOut={leaveLogo}>
                    <img src={logoPath} alt={logo} className="logo"/>
                    <h3>Portal Home</h3>
                </Link>
                <div className="navLinks">
                    <Link className="navLink" to={"/portal/event"}>
                        <h3>Events</h3>
                    </Link>
                    {/* <Link className="navLink" to={"/portal"}>
                        <h3>Brothers<br/>Directory</h3>
                    </Link>
                    <Link className="navLink" to={"/portal"}>
                        <h3>Brothers<br/>Portal</h3>
                    </Link> */}
                    <Link className="navLink" to="/" onClick={logout}>
                        <h3>Log<br/>Out</h3>
                    </Link>
                </div>
            </div>
        </nav>
        <main>
        {children}
        </main>
    </>
)};