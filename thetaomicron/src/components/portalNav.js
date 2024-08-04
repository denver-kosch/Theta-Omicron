import { Link } from "react-router-dom";

const PortalNav = ({children}) => {
    const logout = () => localStorage.removeItem("token");

    return (
    <>
        <nav>
            <div className="navContainer">
            <Link to={"/portal"} className="homeButton navLink">
                        <img alt='Kappa Sigma Crest' className="logo"/>
                        <h3>Portal Home</h3>
                    </Link>
                <div className="navLinks">
                    <Link className="navLink" to={"/portal/committees"}>
                        <h3>Committees</h3>
                    </Link>
                    <Link className="navLink" to={"/portal/event"}>
                        <h3>All<br/>Events</h3>
                    </Link>
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

export default PortalNav;