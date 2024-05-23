import { useEffect, useState } from "react";
import { apiCall } from "../../components/apiCall";

const CreateEvent = ({addEvent}) => {
    const [loaded, setLoaded] = useState(true);
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
            const res = await apiCall("getCommittees", {user: true});
            setCommOptions(res.committees);
        };
        // fetchCommittees();
    },[]);

    const add = () => {

    };
    
    return(
        <>
            { loaded ? 
            <div className="form">
                <h1>Create Event</h1>
                <form onSubmit={add}>
                    <label htmlFor="name">Name: </label>
                    <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} />
                    <br/>
                    <label htmlFor="description">Description: </label>
                    <input type="text" id="description" value={description} onChange={(e) => setDescription(e.target.value)} />
                    <br/>
                    <label htmlFor="location">Location: </label>
                    <input type="text" id="location" value={location} onChange={(e) => setLocation(e.target.value)} />
                    <br/>
                    <label htmlFor="start">Start: </label>
                    <input type="datetime-local" id="start" value={start} onChange={(e) => setStart(e.target.value)} />
                    <br/>
                    <label htmlFor="end">End: </label>
                    <input type="datetime-local" id="end" value={end} onChange={(e) => setEnd(e.target.value)} />
                    <br/>
                    <label htmlFor="image">Image: </label>
                    <input type="file" id="image" value={image} onChange={(e) => setImage(e.target.value)} />
                    <br/>
                    <label htmlFor="committee">Committee: </label>
                    <select id="committee" value={committee} onChange={(e) => setCommittee(e.target.value)}>
                        {commOptions.map((option) => (
                            <option key={option.id} value={option.id}>{option.name}</option>
                        ))}
                    </select>
                    <br/>
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
                    <br/>
                    <input type="submit" value="Create"/>
                </form>
                
            </div> :
            <div className="loader">Loading...</div>
            }
        </>
)};

export default CreateEvent;