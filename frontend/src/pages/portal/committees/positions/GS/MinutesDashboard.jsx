import { useForm } from "react-hook-form";
import { useState, useEffect} from "react";
import { fDate } from "@/services/dateFormatting";
import api from "@/services/apiCall";
import axios from "axios";
import Modal from "@/components/modal";

export default ({ style }) => {
	const [selectedMinutes, setSelectedMinutes] = useState(null);
	const [minutesList, setMinutesList] = useState([]);
	const [pdfModalOpen, setPdfModalOpen] = useState(false);
	const [pdfUrl, setPdfUrl] = useState("");
	const [showAll, setShowAll] = useState(false);
	const [searchTerm, setSearchTerm] = useState("");
	const [filteredMinutes, setFilteredMinutes] = useState([]);

	const fetchMinutes = async (numMinutes = null) => {
		const response = await api('minutes', {body: {numMinutes}, headers: {'Authorization': `Bearer ${localStorage.getItem('token')}`}});
		if (response.success) setMinutesList(response.minutes);
		else console.error(response.error);
	};

	useEffect(() => {fetchMinutes(5)}, []);

	useEffect(() => {
		const filtered = minutesList.filter(m => m.date.toLowerCase().includes(searchTerm.toLowerCase()) || m.type.toLowerCase().includes(searchTerm.toLowerCase()));
		setFilteredMinutes(filtered);
	}, [searchTerm, minutesList]);

	const handleViewMinutes = async (minutes) => {
		try {
			const token = localStorage.getItem("token");
			console.log(minutes.filePath);
			const response = await axios.get(minutes.filePath, { headers: {Authorization: `Bearer ${token}`},responseType: 'blob' });
			const blobUrl = URL.createObjectURL(response.data);
			setPdfUrl(blobUrl);
			setPdfModalOpen(true);
		} catch (error) {
			console.error("Failed to load PDF:", error);
			alert("You are not authorized to view this file.");
		}
	};

	const handleDeleteMinutes = async (minutes) => {
		if (!window.confirm("Are you sure you want to delete these minutes?")) return;
		try {
			const response = await api('minutes',{method: "DELETE", body: { minutesId: minutes._id }, headers: {'Authorization': `Bearer ${localStorage.getItem('token')}`}});
			if (response.success) {
				alert("Minutes deleted successfully");
				setMinutesList((prev) => prev.filter(m => m._id !== minutes._id));
			} else throw new Error(response);
		} catch (error) {
			console.error('Error:', error);
			alert(`Error: ${error.message}`);
		}
	};

	const MinutesTable = ({ rows, onView, onEdit, onDelete }) => (
		<table style={{ border: '1px solid white', marginTop: '20px', width: '100%' }}>
			<thead>
			<tr><th>Date</th><th>Type</th><th>Actions</th></tr>
			</thead>
			<tbody>
			{rows.map((minutes) => (
				<tr key={minutes._id}>
				<td>{fDate(minutes.date, { includeTime: false})}</td>
				<td>{minutes.type}</td>
				<td>
					<button onClick={() => onView(minutes)}>View</button>
					<button onClick={() => onEdit(minutes)}>Edit</button>
					<button onClick={() => onDelete(minutes)}>Delete</button>
				</td>
				</tr>
			))}
			</tbody>
		</table>
	);

	const MinutesModal = ({ initialData, onClose, isOpen }) => {
		const { register, handleSubmit, watch, reset, formState: { errors } } = useForm({
			defaultValues: {
			date: "",
			type: "Chapter",
			otherType: "",
			file: null,
			...(initialData || {})
			}
		});

		if (!initialData) return null;

		useEffect(() => {
			if (initialData) reset({ date: initialData.date || "", type: initialData.type || "Chapter", otherType: initialData.otherType || "", file: null });
		}, [initialData, reset]);

		const submitMinutes = async (data) => {
			try {
				const formData = new FormData();
				formData.append('date', data.date);
				formData.append('type', data.type !== "Other" ? data.type : data.otherType);
				formData.append('file', data.file[0]);

				const response = await api('minutes', {method: "POST", body: formData, headers: {'Authorization': `Bearer ${localStorage.getItem('token')}`}});
				if (response.success) {
					alert(initialData ? 'Minutes updated successfully' : 'Minutes uploaded successfully');
					setSelectedMinutes(null);
					fetchMinutes(showAll ? null : 5);
				} else throw new Error(response);
			} catch (error) {
				console.error('Error:', error);
				alert(`Error: ${error.message}`);
			}
		};

		return (
			<Modal isOpen={isOpen} onClose={onClose} title={initialData?.date ? "Edit Meeting Minutes" : "Upload Meeting Minutes"}>
				<form onSubmit={handleSubmit(submitMinutes)}>
					<div>
						<label>Date:</label>
						<input type="date" {...register("date", { required: true })} defaultValue={initialData.date} />
						{errors.date && <span>This field is required</span>}
					</div>
					<div>
						<label>Type:</label>
						<select {...register("type", { required: true })}>
							<option value="Chapter">Chapter</option>
							<option value="EC">EC</option>
							<option value="Initiation">Initiation</option>
							<option value="Nominations">Nominations</option>
							<option value="Elections">Elections</option>
							<option value="Other">Other</option>
						</select>
						{errors.type && <span>This field is required</span>}
					</div>
					{watch("type") === "Other" && (
						<div>
							<label>Specify Type:</label>
							<input type="text" {...register("otherType", { required: true })} />
							{errors.otherType && <span>This field is required</span>}
						</div>
					)}
					<div>
						<label>File:</label>
						<input
						type="file"
						{...register("file", { required: !initialData })}
						accept=".pdf,.docx,.doc,.odt"
						/>
						{errors.file && <span>This field is required</span>}
					</div>
					<button type="submit">{initialData ? "Update" : "Upload"} Minutes</button>
					<button type="button" onClick={onClose}>Cancel</button>
				</form>
			</Modal>
		);
	};

	const FullList = ({ onClose, isOpen, title }) => (
		<Modal isOpen={isOpen} onClose={onClose} title="All Uploaded Minutes">
			{/* <h3>All Uploaded Minutes</h3> */}
			<MinutesTable rows={filteredMinutes} onView={handleViewMinutes} onEdit={setSelectedMinutes} onDelete={handleDeleteMinutes} />
			{/* <button onClick={onClose}>Close</button> */}
			</Modal>
	);


	return (
		<div className="minutes-dashboard" style={style}>
			<h2>Manage Uploaded Minutes</h2>
			<input 
				type="text" 
				placeholder="Search by name or date..." 
				style={{ marginRight: '20px' }} 
				onChange={e => setSearchTerm(e.target.value)} 
				value={searchTerm}
			/>
			<button onClick={() => setSelectedMinutes({})}>New Upload</button>
			<button onClick={() => setShowAll(true)}>View All</button>
			<MinutesTable
				rows={filteredMinutes}
				onView={handleViewMinutes}
				onEdit={setSelectedMinutes}
				onDelete={handleDeleteMinutes}
			/>
			<MinutesModal key={selectedMinutes?._id ?? 'new'} initialData={selectedMinutes} isOpen={selectedMinutes} onClose={() => setSelectedMinutes(null)} />
			{pdfModalOpen && 
			<div className="modal-backdrop" style={{ zIndex: 1000 }} onClick={() => setPdfModalOpen(false)}>
				<div className="modal" style={{ width: '80%', height: '90%' }} onClick={(e) => e.stopPropagation()}>
					<h3>Viewing Minutes</h3>
					<iframe src={pdfUrl} width="100%" height="95%" title="PDF Viewer" style={{ border: '1px solid #ccc' }} />
					<button onClick={() => setPdfModalOpen(false)}>Close</button>
				</div>
			</div>
			}
			<FullList key="full-list" onClose={() => setShowAll(false)} isOpen={showAll} />
		</div>
	)
};