import Modal from "@/components/modal";
import { useState, useEffect } from "react";
import api from "@/services/apiCall";


export default ({ initialData, onClose, onSubmit, isOpen }) => {
	const [oldEC, setOldEC] = useState(initialData || {});
	const [newEC, setNewEC] = useState({});

	const handleChange = (e) => {
		const { position, person, id } = e.target;
		setNewEC(prev => ({ ...prev, [position]: { person, id } }));
	};
	
	useEffect(() => {
		const getOldEC = async () => {
			try {
				const response = await api('committees/Executive%20Committee', { headers: {'Authorization': `Bearer ${localStorage.getItem('token')}`}});
				if (response.success) setOldEC(response.committee.positions);
				else console.error(response.error);
			} catch (error) {
				console.error('Error fetching EC roster:', error);
			}
		};
		getOldEC();
	}, [oldEC]);

	const updateEC = async (data) => {
		try {
			// const response = await fetch(`${ENDPOINT}/committees/Executive%20Committee`, { method: 'PUT', headers: { 'Content-Type': 'application/json'}, body: JSON.stringify(data) });
			// const response = await api(`${ENDPOINT}/committees/Executive%20Committee`, { method: 'PUT', headers: { 'Content-Type': 'application/json'}, body: JSON.stringify(data) });
			if (!response.ok) throw new Error('Failed to update EC roster');
			const updatedData = await response.json();
			setSelectedMinutes(updatedData);
		} catch (error) {
			console.error('Error:', error);
			alert(`Error: ${error.message}`);
		} finally {
            onClose();
        }
	};

	return (
		<Modal isOpen={isOpen} onClose={onClose} title="Update Executive Committee Roster">
            <form onSubmit={(e) => { e.preventDefault(); onSubmit(newEC); }}>
                {Object.entries(oldEC).map(([position, info]) => (
                    <div key={position}>
                        <label>{position}:</label>
                        <input type="text" position={position} person={info.person} id={info.id} defaultValue={info.person} onChange={handleChange} />
                    </div>
                ))}
                <button type="submit" onClick={updateEC}>Update Roster</button>
            </form>
		</Modal>
	)
};