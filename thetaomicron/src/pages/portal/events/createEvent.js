import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import apiCall from "../../../services/apiCall";

const CreateEvent = () => {
    const navigate = useNavigate();
    const formatDateForInput = (date) => {
        const local = new Date(date);
        local.setMinutes(date.getMinutes() - date.getTimezoneOffset());
        return local.toJSON().slice(0,16);
    };
    const [loaded, setLoaded] = useState(false);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [locOptions, setLocOptions] = useState([]);
    const [commOptions, setCommOptions] = useState([]);
    const [officerComms, setOfficerComms] = useState([]);
    const [location, setLocation] = useState('-1');
    const [committee, setCommittee] = useState('');
    const [newLocName, setNewLocName] = useState('');
    const [newLocAddress, setNewLocAddress] = useState('');
    const [start, setStart] = useState(formatDateForInput(new Date()));
    const [end, setEnd] = useState(formatDateForInput(new Date()));
    const [image, setImage] = useState(null);
    const [visibility, setVisibility] = useState('');
    

    useEffect(() => {
        const getInfo = async () => {
            const options = await apiCall('getEventCreation', {}, {'Authorization': `Bearer ${localStorage.getItem("token")}`});
            setLocOptions(options.locations);
            setCommOptions(options.committees.member);
            setOfficerComms(options.committees.officer);
        };
        getInfo();
        setLoaded(true);
    },[]);

    const add = async e => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        const data = new FormData();
        data.append('name', name);
        data.append('description', description);

        data.append('location', JSON.stringify(locOptions.find(l => l._id === location) ?? location));
        if (location === '0') {
            data.append('newLocName', newLocName);
            data.append('newLocAddress', newLocAddress);
        }

        data.append('start', start);
        data.append('end', end);
        data.append('image', image);

        const com = [...commOptions, ...officerComms].find(e=> e._id === committee);
        console.log(com);
        data.append('committee', JSON.stringify(com));
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
                        <select id="location" value={location} onChange={(e) => setLocation(e.target.value)}>
                            <option key='location-disabled' value={'-1'} disabled>Please select a location</option>
                            {locOptions.map(location => {
                                return <option key={location._id} value={location._id}>{location.name}</option>
                            })}
                            <option key='location-0' value={'0'}>Other</option>
                        </select>
                    </div>

                    {location === '0' ?
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
                        <label htmlFor="committee">Facilitating committee: </label>
                        <select id="committee" value={committee} onChange={(e) => setCommittee(e.target.value)}>
                            <option key={"committee"} value='' disabled>Please select a committee</option>
                            {commOptions.map(option => (
                                <option key={`committee-${option._id}`} value={option._id}>{option.name}</option>
                            ))}
                            {officerComms.length > 0 && <option key={"ocommittee"} value='' disabled>Officer Committees</option>}
                            {officerComms.map(option => (
                                <option key={`ocommittee-${option._id}`} value={option._id}>{option.name}</option>
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
                            {commOptions.includes("Pledge Educator") &&
                            <option value="Pledges">Pledges Only</option>
                        }
                            <option value="Committee">Committee Only</option>
                            {commOptions.includes("Executive Committee") &&
                            <option value="Executive Committee">EC Only</option>
                        }
                        </select>
                    </div>

                    <br/>

                    <input required type="submit" value="Create"/>
                </form>
                <button onClick={() => console.log(start)}>Check</button>
                
            </div> :
            <div className="loader">Loading...</div>
            }
        </>
)};

export default CreateEvent;