import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { apiCall } from "../../../components";

const CreateEvent = () => {
    const navigate = useNavigate();
    const [loaded, setLoaded] = useState(false);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [locOptions, setLocOptions] = useState([]);
    const [location, setLocation] = useState(-1);
    const [newLocName, setNewLocName] = useState('');
    const [newLocAddress, setNewLocAddress] = useState('');
    const [start, setStart] = useState('');
    const [end, setEnd] = useState('');
    const [image, setImage] = useState(null);
    const [type, setType] = useState('');
    const [typeOptions, setTypeOptions] = useState([]);
    const [visibility, setVisibility] = useState('');
    

    useEffect(() => {
        const fetchTypes = async () => {
            const token = localStorage.getItem('token');
            const res = await apiCall("getTypes", {user: true}, {'Authorization': `Bearer ${token}`});
            console.log(res)
            setTypeOptions(res.types);
        };
        const getLocations = async () => {
            const locOptions = await apiCall('getLocations');
            setLocOptions(locOptions.locations);
        };
        fetchTypes();
        getLocations();
        setLoaded(true);
    },[]);

    const add = async e => {
        e.preventDefault();
        const token = localStorage.getItem('token');

        const data = new FormData();
        data.append('name', name);
        data.append('description', description);

        data.append('location', location);
        if (location === 0) {
            data.append('newLocName', newLocName);
            data.append('newLocAddress', newLocAddress);
        }

        data.append('start', start);
        data.append('end', end);
        data.append('image', image);
        data.append('type', type);
        data.append('visibility', visibility);

        const newEvent = await apiCall('addEvent', data, {'Authorization': `Bearer ${token}`});
        if (newEvent.success) {
            navigate('/portal/event/'+newEvent.newId);
        }
        else console.error(newEvent.error);
    };
    
    return(
        <>
            { loaded ? 
            <div className="create">
                <h1>Create Event</h1>
                <form onSubmit={add}>
                    <div className="field">
                        <label htmlFor="name">Name: </label>
                        <input required type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} />
                    </div>

                    <br/>
                    <div className="field longtext">
                        <label htmlFor="description">Description: </label>
                        <br/>
                        <textarea
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows={5}
                        />
                    </div>

                    <br/>

                    <div className="field">
                        <label htmlFor="location">Location: </label>
                        <select id="location" value={location} onChange={(e) => setLocation(parseInt(e.target.value))}>
                            <option key='location-disabled' value={-1} disabled>Please select a location</option>
                            {locOptions.map(location => {
                                return <option key={location.locationId} value={location.locationId}>{location.name}</option>
                            })}
                            <option key='location-0' value={0}>Other</option>
                        </select>
                    </div>

                    {location === 0 ?
                        <>
                            <br/>
                            <div className="field">
                                <label htmlFor="locationName">New Location Name: </label>
                                <input required type="text" id="locationName" value={newLocName} onChange={(e) => setNewLocName(e.target.value)} />
                            </div>
                            <br/>
                            <div className="field">
                                <label htmlFor="locationAddress">New Location Address: </label>
                                <input required type="text" id="locationAddress" value={newLocAddress} onChange={(e) => setNewLocAddress(e.target.value)} />
                            </div>
                        </>:<></>
                    }

                    <br/>

                    <div className="field">
                        <label htmlFor="start">Start: </label>
                        <input required type="datetime-local" id="start" value={start} onChange={(e) => setStart(e.target.value)} />
                    </div>

                    <br/>

                    <div className="field">
                        <label htmlFor="end">End: </label>
                        <input required type="datetime-local" id="end" value={end} onChange={(e) => setEnd(e.target.value)} />
                    </div>

                    <br/>

                    <div className="field">
                        <label htmlFor="image">Image: </label>
                        <input required type="file" id="image" onChange={(e) => setImage(e.target.files[0])} accept="image/png, image/jpeg, image/jpg" />
                    </div>

                    <br/>

                    <div className="field">
                        <label htmlFor="type">Facilitating committee: </label>
                        <select id="type" value={type} onChange={(e) => setType(e.target.value)}>
                            <option key={"type"} value='' disabled>Please select a committee</option>
                            {typeOptions.map(option => (
                                <option key={`type-${option.typeId}`} value={option.typeId}>{option.name}</option>
                            ))}
                        </select>
                    </div>

                    <br/>

                    <div className="field">
                        <label htmlFor="visibility">Visibility: </label>
                        <select id="visibility" value={visibility} onChange={(e) => setVisibility(e.target.value)}>
                            <option value='' disabled>Please select event visibility</option>
                            <option value="Public">Public</option>
                            <option value="Members">Members Only</option>
                            <option value="Initiates">Initiates Only</option>
                            {typeOptions.includes("Pledge Educator") &&
                            <option value="Pledges">Pledges Only</option>
                        }
                            <option value="Committee">Committee Only</option>
                            {typeOptions.includes("Executive Committee") &&
                            <option value="Executive Committee">EC Only</option>
                        }
                        </select>
                    </div>

                    <br/>

                    <input required type="submit" value="Create"/>
                </form>
                
            </div> :
            <div className="loader">Loading...</div>
            }
        </>
)};

export default CreateEvent;