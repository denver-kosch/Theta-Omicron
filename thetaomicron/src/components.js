import { useState } from "react";
import { Link } from "react-router-dom";
import {APIProvider, Map, Marker} from '@vis.gl/react-google-maps';


export const Card = ({ name, emailLink, memberId, title }) => {
    const img = `/images/profilePics/${memberId}.jpg`;

    return (
    <div key={memberId} className="card">
        <a href={emailLink}>
            <div>
                <img src={img} alt={name} className="profilePic"/>
                <img src="/images/mail.png" className="emailIcon" alt="Email" />
            </div>
        </a>
        <p>{name}</p>
        <p style={{fontWeight: 'bold'}}>{title}</p>
    </div>
)};

export const Divider = () => <div className="divider"></div>;

export const MapView = ({c}) => {
    return (
        <APIProvider apiKey={process.env.REACT_APP_GOOGLE_API_KEY}>
            <Map
            className='map'
            center={c}
            defaultZoom={17}
            gestureHandling={'none'}
            disableDefaultUI={true}
            clickableIcons={false}
            keyboardShortcuts={false}
            mapTypeId={'hybrid'}
            >
                <Marker position={c} clickable={false}/>
            </Map>
        </APIProvider>
    )
};

export const Navbar = ({children}) => {
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
                        <img  className="smLogo" alt="Instagram"/>
                    </a>
                </div>
            </footer>
        </>
    )
};

export const DropDown = ({content}) => {
    const [isOpen, setIsOpen] = useState(false);
    const {parent, children} = content;

    return (
    <div className="dropButton" onMouseOver={() => setIsOpen(true)} onMouseOut={() => setIsOpen(false)}>
        <Link className="navLink" to={parent.link} onClick={() => setIsOpen(false)}>
            <h3>{parent.title}</h3>
        </Link>
        {isOpen &&
        <div className="dropdown">
            {children.map(child => {return (
                <Link className="navLink" to={child.link} onClick={() => setIsOpen(false)}>
                    <h4>{child.title}</h4>
                </Link>
            )})}
        </div>
        }
    </div>
)};

export async function apiCall (api, body = {}, headers = {}) {
    const apiLink = `http://${process.env.REACT_APP_SERVERHOST}:${process.env.REACT_APP_SERVERPORT}/${api}`;

    const isFormData = body instanceof FormData;
    try {
        const fetchOptions = {
            method: "POST",
            headers: isFormData ? headers : { 'Content-Type': 'application/json', ...headers },
            body: isFormData ? body : JSON.stringify(body)
        };
        const result = await fetch(apiLink, fetchOptions);
        
        if (result.status >= 200 && result.status < 300) return result.json();
        
        const errorData = await result.text();  // Get the error message if not OK
        throw new Error(errorData);
    } catch (error) {
        console.error("Error making API call:", error);
        return error;
    }
};