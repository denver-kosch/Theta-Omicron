import { useState, useEffect } from 'react';
import api from '@/services/apiCall';

const GMC = () => {
    const [notepad, setNotepad] = useState("");
    const [chairReports, setReports] = useState([]);
    const [checklist, setChecklist] = useState([]);

    useEffect(() => {
        const fetchNotepad = async () => {
            const response = await api("getNotes", {}, {Authorization: `Bearer ${localStorage.getItem('token')}`});
            if (response.success) setNotepad(response.notepad);
            else console.error("Error getting notepad", response.error);
        };
        const fetchChairReports = async () => {
            const response = await api("getReports", {}, {Authorization: `Bearer ${localStorage.getItem('token')}`});
            if (response.success) setReports(response.reports);
            else console.error("Error getting chair reports", response.error);
        };
        const fetchToDoList = async () => {
            const response = await api("getChecklist", {}, {Authorization: `Bearer ${localStorage.getItem('token')}`});
            if (response.success) setChecklist(response.checklist);
            else console.error("Error getting checklist", response.error);
        };
        fetchNotepad();
    }, []);
    

    return (
        <div>
            <h1>GMC</h1>
        </div>
)};

export default GMC;