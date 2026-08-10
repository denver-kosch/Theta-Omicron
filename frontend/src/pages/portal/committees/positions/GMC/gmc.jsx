import { useState, useEffect } from 'react';
import api from '@/services/apiCall';

const GMC = () => {
    const [notepad, setNotepad] = useState("");
    const [chairReports, setReports] = useState([]);

    useEffect((async () => {
        await api("getNotes", {}, {Authorization: `Bearer ${localStorage.getItem('token')}`})
            .then(response => setNotepad(response.notepad))
            .catch(err => console.error("Error getting notepad", err));
        await api("getReports", {}, {Authorization: `Bearer ${localStorage.getItem('token')}`})
            .then(response => setReports(response.reports))
            .catch(error => console.error("Error getting chair reports", error));
    })(), []);
    

    return (
        <div>
            <h1>GMC</h1>

        </div>
)};

export default GMC;