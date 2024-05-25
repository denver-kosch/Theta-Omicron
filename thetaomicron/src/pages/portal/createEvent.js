import { useEffect, useState } from "react";
import { apiCall } from "../../components/apiCall";

const CreateEvent = ({addEventId}) => {
    const [loaded, setLoaded] = useState(false);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [location, setLocation] = useState('');
    const [start, setStart] = useState('');
    const [end, setEnd] = useState('');
    const [image, setImage] = useState(null);
    const [committee, setCommittee] = useState('');
    const [commOptions, setCommOptions] = useState([]);
    const [visibility, setVisibility] = useState('');
    

    useEffect(() => {
        const fetchCommittees = async () => {
            const token = localStorage.getItem('token');
            const res = await apiCall("getCommittees", {user: true}, {'Authorization': `Bearer ${token}`});
            setCommOptions(res.committees);
        };
        fetchCommittees();
        setLoaded(true);
    },[]);

    const add = async e => {
        e.preventDefault();
        const data = new FormData();
        data.append('name', name);
        data.append('description', description);
        data.append('location', location);
        data.append('start', start);
        data.append('end', end);
        data.append('image', image);
        data.append('committee', committee);
        data.append('visibility', visibility);
        data.append('type', 'eventPosters');

        const newEvent = await apiCall('addEvent', {data});
        if (newEvent.success) addEventId(newEvent.eventId);
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
                        <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} />
                    </div>

                    <br/>
                    <div className="field longtext">
                        <label htmlFor="description">Description: </label>
                        <br/>
                        <textarea
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows={3}
                        />
                    </div>

                    <br/>

                    <div className="field">
                        <label htmlFor="location">Location: </label>
                        <input type="text" id="location" value={location} onChange={(e) => setLocation(e.target.value)} />
                    </div>

                    <br/>

                    <div className="field">
                        <label htmlFor="start">Start: </label>
                        <input type="datetime-local" id="start" value={start} onChange={(e) => setStart(e.target.value)} />
                    </div>

                    <br/>

                    <div className="field">
                        <label htmlFor="end">End: </label>
                        <input type="datetime-local" id="end" value={end} onChange={(e) => setEnd(e.target.value)} />
                    </div>

                    <br/>

                    <div className="field">
                        <label htmlFor="image">Image: </label>
                        <input type="file" id="image" onChange={(e) => setImage(e.target.value)} accept="image/png, image/jpeg, image/jpg" />
                    </div>

                    <br/>

                    <div className="field">
                        <label htmlFor="committee">Committee: </label>
                        <select id="committee" value={committee} onChange={(e) => setCommittee(e.target.value)}>
                            {commOptions.map(option => (
                                <option key={option.id} value={option.id}>{option.name}</option>
                            ))}
                        </select>
                    </div>

                    <br/>

                    <div className="field">
                        <label htmlFor="visibility">Visibility: </label>
                        <select id="visibility" value={visibility} onChange={(e) => setVisibility(e.target.value)}>
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

                    <input type="submit" value="Create"/>
                </form>
                
            </div> :
            <div className="loader">Loading...</div>
            }
        </>
)};

export default CreateEvent;