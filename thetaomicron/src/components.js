import { useState } from "react";
import { Link } from "react-router-dom";
import {APIProvider, Map, Marker} from '@vis.gl/react-google-maps';

export const MemberCard = ({ name, emailLink, memberId, title }) => {
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
                        <img className="smLogo" alt="Instagram"/>
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
    const port = process.env.REACT_APP_SERVERPORT || 3001;
    const host = window.location.hostname || 'localhost';
    const apiLink = `http://${host}:${port}/${api}`;
    
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

export const EventCard = ({event, loggedIn}) => {
    const {_id, name, description, time, location, imageUrl} = event;

    const FormatTime = ({date1, date2}) => {
        const options = {
          month: "numeric",
          day: "numeric",
          year: "numeric",
          hour: "numeric",
          minute: "numeric",
          hour12: true,
        };
        const formatted1  = date1.toLocaleString("en-US", options);
        const formatted2  = date2.toLocaleString("en-US", options);
        const [datePart1, timePart1] = formatted1.split(", ");
        const [datePart2, timePart2] = formatted2.split(", ");
        return (datePart1 === datePart2) ?
             <p className="time">{datePart1} {`${timePart1} - ${timePart2}`}</p>:
             <p className="time">{`${datePart1} ${timePart1} - `}<br/>{`${datePart2} ${timePart2}`}</p>;
    };

    return (
        <Link to={loggedIn ? `/portal/event/${_id}` :`/event/${_id}`} key={_id}>
            <div className="eventCard easyLink">
                <img src={imageUrl || `${process.env.REACT_APP_API_URL}/images/events/default.png`} alt={name}/>
                <div>
                    <p style={{fontWeight: 'bold'}} className="name">{name}</p>
                    <FormatTime date1={new Date(time.start)} date2={new Date(time.end)}/>
                    {location && <div className="location">
                        <img src='/images/locPin.png' alt="pin" className="locPin"/>
                        <p>{location}</p>
                    </div>}
                    {description && <p className="description">{description}</p>}
                </div>
            </div>
        </Link>
)};