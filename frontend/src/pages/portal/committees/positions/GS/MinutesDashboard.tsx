import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import Modal from "@/components/modal";
import api from "@/services/apiCall";
import { fDate } from "@/services/dateFormatting";
import type {
    MeetingMinutes,
    MinutesEditorProps,
    MinutesForm,
    MinutesListModalProps,
    MinutesTableProps,
    StyleProps,
} from "@/types";

const authHeaders = () => ({Authorization: `Bearer ${localStorage.getItem("token")}`});

const MinutesTable = ({rows, onView, onEdit, onDelete}: MinutesTableProps) => (
    <table style={{border: "1px solid white", marginTop: "20px", width: "100%"}}>
        <thead><tr><th>Date</th><th>Type</th><th>Actions</th></tr></thead>
        <tbody>
            {rows.map(minutes => (
                <tr key={minutes._id}>
                    <td>{fDate(minutes.date, {includeTime: false})}</td>
                    <td>{minutes.type}</td>
                    <td>
                        <button type="button" onClick={() => onView(minutes)}>View</button>
                        <button type="button" onClick={() => onEdit(minutes)}>Edit</button>
                        <button type="button" onClick={() => onDelete(minutes)}>Delete</button>
                    </td>
                </tr>
            ))}
        </tbody>
    </table>
);

const MinutesEditor = ({initialData, onClose, isOpen, onSaved}: MinutesEditorProps) => {
    const {register, handleSubmit, watch, reset, formState: {errors}} = useForm<MinutesForm>({
        defaultValues: {date: "", type: "Chapter", otherType: "", file: null},
    });

    useEffect(() => {
        reset({
            date: initialData?.date ?? "",
            type: initialData?.type ?? "Chapter",
            otherType: initialData?.otherType ?? "",
            file: null,
        });
    }, [initialData, reset]);

    const submitMinutes = async (data: MinutesForm) => {
        const formData = new FormData();
        formData.append("date", data.date);
        formData.append("type", data.type === "Other" ? data.otherType : data.type);
        const file = data.file?.[0];
        if (file) formData.append("file", file);
        if (initialData?._id) formData.append("minutesId", initialData._id);

        const response = await api("minutes", {method: "POST", body: formData, headers: authHeaders()});
        if (!response.success) {
            window.alert(`Error: ${response.error}`);
            return;
        }
        window.alert(initialData?._id ? "Minutes updated successfully" : "Minutes uploaded successfully");
        onSaved();
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={initialData?._id ? "Edit Meeting Minutes" : "Upload Meeting Minutes"}>
            <form onSubmit={handleSubmit(submitMinutes)}>
                <div>
                    <label htmlFor="minutes-date">Date:</label>
                    <input id="minutes-date" type="date" {...register("date", {required: true})}/>
                    {errors.date && <span>This field is required</span>}
                </div>
                <div>
                    <label htmlFor="minutes-type">Type:</label>
                    <select id="minutes-type" {...register("type", {required: true})}>
                        <option value="Chapter">Chapter</option><option value="EC">EC</option>
                        <option value="Initiation">Initiation</option><option value="Nominations">Nominations</option>
                        <option value="Elections">Elections</option><option value="Other">Other</option>
                    </select>
                </div>
                {watch("type") === "Other" && (
                    <div>
                        <label htmlFor="minutes-other-type">Specify Type:</label>
                        <input id="minutes-other-type" {...register("otherType", {required: true})}/>
                    </div>
                )}
                <div>
                    <label htmlFor="minutes-file">File:</label>
                    <input id="minutes-file" type="file" {...register("file", {required: !initialData?._id})} accept=".pdf,.docx,.doc,.odt"/>
                    {errors.file && <span>This field is required</span>}
                </div>
                <button type="submit">{initialData?._id ? "Update" : "Upload"} Minutes</button>
                <button type="button" onClick={onClose}>Cancel</button>
            </form>
        </Modal>
    );
};

const MinutesListModal = ({onClose, isOpen, ...tableProps}: MinutesListModalProps) => (
    <Modal isOpen={isOpen} onClose={onClose} title="All Uploaded Minutes">
        <MinutesTable {...tableProps}/>
    </Modal>
);

const MinutesDashboard = ({style}: StyleProps) => {
    const [selectedMinutes, setSelectedMinutes] = useState<Partial<MeetingMinutes> | null>(null);
    const [minutesList, setMinutesList] = useState<MeetingMinutes[]>([]);
    const [pdfUrl, setPdfUrl] = useState("");
    const [showAll, setShowAll] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

    const fetchMinutes = async (limit: number | null = 5) => {
        const response = await api<{minutes: MeetingMinutes[]}>("minutes", {headers: authHeaders()});
        if (response.success) setMinutesList(limit ? response.minutes.slice(0, limit) : response.minutes);
        else console.error(response.error);
    };

    useEffect(() => { void fetchMinutes(); }, []);
    useEffect(() => () => { if (pdfUrl) URL.revokeObjectURL(pdfUrl); }, [pdfUrl]);

    const filteredMinutes = useMemo(() => {
        const query = searchTerm.toLowerCase();
        return minutesList.filter(minutes => minutes.date.toLowerCase().includes(query) || minutes.type.toLowerCase().includes(query));
    }, [minutesList, searchTerm]);

    const viewMinutes = async (minutes: MeetingMinutes) => {
        try {
            const response = await axios.get<Blob>(minutes.filePath, {headers: authHeaders(), responseType: "blob"});
            setPdfUrl(URL.createObjectURL(response.data));
        } catch (error) {
            console.error("Failed to load PDF:", error);
            window.alert("You are not authorized to view this file.");
        }
    };

    const deleteMinutes = async (minutes: MeetingMinutes) => {
        if (!window.confirm("Are you sure you want to delete these minutes?")) return;
        const response = await api("minutes", {method: "DELETE", body: {minutesId: minutes._id}, headers: authHeaders()});
        if (response.success) setMinutesList(current => current.filter(item => item._id !== minutes._id));
        else window.alert(`Error: ${response.error}`);
    };

    const tableProps: MinutesTableProps = {
        rows: filteredMinutes,
        onView: minutes => void viewMinutes(minutes),
        onEdit: setSelectedMinutes,
        onDelete: minutes => void deleteMinutes(minutes),
    };

    return (
        <div className="minutes-dashboard" style={style}>
            <h2>Manage Uploaded Minutes</h2>
            <input type="search" aria-label="Search minutes" placeholder="Search by name or date..." style={{marginRight: "20px"}} onChange={event => setSearchTerm(event.target.value)} value={searchTerm}/>
            <button type="button" onClick={() => setSelectedMinutes({})}>New Upload</button>
            <button type="button" onClick={() => { void fetchMinutes(null); setShowAll(true); }}>View All</button>
            <MinutesTable {...tableProps}/>
            <MinutesEditor
                key={selectedMinutes?._id ?? "new"}
                initialData={selectedMinutes}
                isOpen={selectedMinutes !== null}
                onClose={() => setSelectedMinutes(null)}
                onSaved={() => void fetchMinutes(showAll ? null : 5)}
            />
            {pdfUrl && (
                <div className="modal-backdrop" style={{zIndex: 1000}} onClick={() => setPdfUrl("")}>
                    <div className="modal" style={{width: "80%", height: "90%"}} onClick={event => event.stopPropagation()}>
                        <h3>Viewing Minutes</h3>
                        <iframe src={pdfUrl} width="100%" height="95%" title="PDF Viewer" style={{border: "1px solid #ccc"}}/>
                        <button type="button" onClick={() => setPdfUrl("")}>Close</button>
                    </div>
                </div>
            )}
            <MinutesListModal {...tableProps} onClose={() => setShowAll(false)} isOpen={showAll}/>
        </div>
    );
};

export default MinutesDashboard;
