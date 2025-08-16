import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import api from "@/services/apiCall";
import {useForm} from "react-hook-form";

const CreateEvent = () => {
    const navigate = useNavigate();
    const defaultValues = {location: "", committee: '', start: new Date(), end: new Date(), visibility: ''};
    const {register, handleSubmit, watch, formState: {errors}} = useForm({defaultValues});
    const [loaded, setLoaded] = useState(false);
    const [locOptions, setLocOptions] = useState([]);
    const [commOptions, setCommOptions] = useState([]);
    const [officerComms, setOfficerComms] = useState([]);
    const location = watch('location');

    useEffect(() => {
        const getInfo = async () => {
            const options = await api('eventCreation', {headers: {'Authorization': `Bearer ${localStorage.getItem("token")}`}});
            setLocOptions(options.locations);
            setCommOptions(options.committees.member);
            setOfficerComms(options.committees.officer);
        };
        getInfo();
        setLoaded(true);
    },[]);
    
    const onSubmit = async (data) => {
        try {
            const token = localStorage.getItem('token');
            const formData = new FormData();

            const { image, location, committee, newLocName, newLocAddress, ...otherData } = data;

            const com = [...commOptions, ...officerComms].find(e => e._id === committee);
            formData.append('committee', JSON.stringify(com));
            
            formData.append('location', JSON.stringify(locOptions.find(l => l._id === location) ?? location));
            if (location === '0') {
                formData.append('newLocName', newLocName);
                formData.append('newLocAddress', newLocAddress);
            }

            formData.append('image', image[0]);  // Append the file

            // Append other fields
            Object.keys(otherData).forEach((key) => formData.append(key, otherData[key]));

            const newEvent = await api('events', {body: formData, headers: { 'Authorization': `Bearer ${token}` }, method: "POST"});
            if (newEvent.success) navigate('/portal/event/' + newEvent.newId);
            else console.error(newEvent.error);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <>
            { loaded ? 
            <div className="create">
                <h1>Create Event</h1>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="field">
                        <label htmlFor="name">Name: </label>
                        <input required type="text" id="name" {...register("name", {required: true})} />
                        {errors.name && <span className="error">Name is required</span>}
                    </div>

                    <br/>
                    <div className="field longtext">
                        <label htmlFor="description">Description: </label>
                        <br/>
                        <textarea
                        id="description"
                        {...register("description", {required: true})}
                        rows={5}
                        />
                        {errors.description && <span className="error">Description is required</span>}
                    </div>

                    <br/>

                    <div className="field">
                        <label htmlFor="location">Location: </label>
                        <select id="location" {...register("location", {required: true, validate: value => value !== ''})}>
                            <option key='location-disabled' value={''} disabled>Please select a location</option>
                            {locOptions.map(location => {
                                return <option key={location._id} value={location._id}>{location.name}</option>
                            })}
                            <option key='location-0' value={'0'}>Other</option>
                        </select>
                        {errors.location && <span className="error">Location is required</span>}
                    </div>

                    {location === '0' ?
                        <>
                            <br/>
                            <div className="field">
                                <label htmlFor="locationName">New Location Name: </label>
                                <input required type="text" id="locationName" {...register("newLocName", {validate: value => location !== '0' || (location === '0' && value !== '')})} />
                                {errors.newLocName && <span className="error">New Location Name is required</span>}
                            </div>
                            <br/>
                            <div className="field">
                                <label htmlFor="locationAddress">New Location Address: </label>
                                <input required type="text" id="locationAddress" {...register("newLocAddress", {validate: value => location !== '0' || (location === '0' && value !== '')})} />
                                {errors.newLocAddress && <span className="error">New Location Address is required</span>}
                            </div>
                        </>:<></>
                    }

                    <br/>

                    <div className="field">
                        <label htmlFor="start">Start: </label>
                        <input required type="datetime-local" id="start" {...register("start", {required: true, 
                            validate: value => new Date(value) > new Date()})}/>
                        {errors.start && <span className="error">Start date must be in the future</span>}
                    </div>

                    <br/>

                    <div className="field">
                        <label htmlFor="end">End: </label>
                        <input required type="datetime-local" id="end" {...register("end", {required: true,
                            validate: value => new Date(value) > new Date(watch('start'))
                        })} />
                        {errors.end && <span className="error">End date must be after start date</span>}
                    </div>

                    <br/>

                    <div className="field">
                        <label htmlFor="image">Image: </label>
                        <input required type="file" id="image" {...register("image", {required: true})} accept="image/png, image/jpeg, image/jpg" />
                        {errors.image && <span className="error">Image is required</span>}
                    </div>

                    <br/>

                    <div className="field">
                        <label htmlFor="committee">Facilitating committee: </label>
                        <select id="committee" {...register("committee", {required: true, validate: value => value !== ''})}>
                            <option key={"committee"} value='' disabled>Please select a committee</option>
                            {commOptions.map(option => (
                                <option key={`committee-${option._id}`} value={option._id}>{option.name}</option>
                            ))}
                            {officerComms.length > 0 && <optgroup key={"ocommittee"} label='Officer Committees'>
                                {officerComms.map(option => (
                                    <option key={`ocommittee-${option._id}`} value={option._id}>{option.name}</option>
                                ))}
                            </optgroup>}
                        </select>
                        {errors.committee && <span className="error">Committee is required</span>}
                    </div>

                    <br/>

                    <div className="field">
                        <label htmlFor="visibility">Visibility: </label>
                        <select id="visibility" {...register("visibility", {required: true,validate: value => value !== ''})}>
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
                        {errors.visibility && <span className="error">Visibility is required</span>}
                    </div>

                    <br/>

                    <input required type="submit" value="Create"/>
                </form>
                
            </div> :
            <div className="loader">Loading...</div>
            }
        </>
    );
};

export default CreateEvent;