import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import apiCall from "@/services/apiCall";
import axios from "axios";

const GS = () => {
  const [selectedMinutes, setSelectedMinutes] = useState(null);
  const [minutesList, setMinutesList] = useState([]);
  const [pdfModalOpen, setPdfModalOpen] = useState(false);
  const [pdfUrl, setPdfUrl] = useState("");
  const [showAll, setShowAll] = useState(false);
  
  const fetchMinutes = async (numMinutes = null) => {
    const response = await apiCall('getMinutes', {numMinutes}, {'Authorization': `Bearer ${localStorage.getItem('token')}`});
    if (response.success) setMinutesList(response.minutes);
    else console.error(response.error);
  };

  useEffect(() => {
    fetchMinutes(20);
  }, []);

  const handleViewMinutes = async (minutes) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(minutes.filePath, {
        headers: {
          Authorization: `Bearer ${token}`
        },
        responseType: 'blob'
      });
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
      const response = await apiCall('deleteMinutes', { minutesId: minutes._id }, {'Authorization': `Bearer ${localStorage.getItem('token')}`});
      console.log("Delete response:", response);
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
        <tr>
          <th>Date</th>
          <th>Type</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((minutes) => (
          <tr key={minutes._id}>
            <td>{new Date(minutes.date).toLocaleDateString()}</td>
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

  const GSOutline = () => (
    <div className="gs-outline">
      <p>As the Grand Scribe, you are responsible for maintaining the records of the fraternity. This includes:</p>
      <ul>
        <li>Recording meeting minutes</li>
        <li>Managing correspondence (social media is included here)</li>
        <li>Maintaining the fraternity's archives (submit to HQ)</li>
      </ul>
      <p>Please ensure all records are accurate and up-to-date, and thank you Brother Grand Scribe for your hard work!</p>
    </div>
  );

  const MinutesDashboard = () => {
    const MinutesModal = ({ initialData, onClose }) => {
      const { register, handleSubmit, watch, reset, formState: { errors } } = useForm({
        defaultValues: {
          date: "",
          type: "Chapter",
          otherType: "",
          file: null,
          ...(initialData || {})
        }
      });

      useEffect(() => {
        if (initialData) {
          reset({
            date: initialData.date || "",
            type: initialData.type || "Chapter",
            otherType: initialData.otherType || "",
            file: null
          });
        }
      }, [initialData, reset]);

      const submitMinutes = async (data) => {
        try {
          const formData = new FormData();
          formData.append('date', data.date);
          formData.append('type', data.type !== "Other" ? data.type : data.otherType);
          formData.append('file', data.file[0]);

          const response = await apiCall('uploadMinutes', formData, {'Authorization': `Bearer ${localStorage.getItem('token')}`});
          if (response.success) {
            alert(initialData ? 'Minutes updated successfully' : 'Minutes uploaded successfully');
            setSelectedMinutes(null);
            fetchMinutes(showAll ? null : 20);
          } else {
            throw new Error(response);
          }
        } catch (error) {
          console.error('Error:', error);
          alert(`Error: ${error.message}`);
        }
      };

      return (
        <div className="modal-backdrop">
          <div className="modal">
            <h2>{initialData ? "Edit Meeting Minutes" : "Upload Meeting Minutes"}</h2>
            <form onSubmit={handleSubmit(submitMinutes)}>
              <div>
                <label>Date:</label>
                <input type="date" {...register("date", { required: true })} />
                {errors.date && <span>This field is required</span>}
              </div>
              <div>
                <label>Type:</label>
                <select {...register("type", { required: true })}>
                  <option value="Chapter">Chapter</option>
                  <option value="EC">EC</option>
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
          </div>
        </div>
      );
    };

    const FullList = ({ onClose }) => (
      <div className="modal-backdrop">
        <div className="modal" style={{ width: '80%', height: '80%', backgroundColor: 'rgb(122, 122, 122)'}}>
          <h3>All Uploaded Minutes</h3>
          <MinutesTable
            rows={minutesList}
            onView={handleViewMinutes}
            onEdit={(minutes) => setSelectedMinutes(minutes)}
            onDelete={handleDeleteMinutes}
          />
          <button onClick={onClose}>Close</button>
        </div>
      </div>
    );

    return (
      <div className="minutes-dashboard">
          <h2>Manage Uploaded Minutes</h2>
          <input type="text" placeholder="Search by name or date..." style={{ marginRight: '20px' }} />
          <button onClick={() => setSelectedMinutes({})}>New Upload</button>
          <button onClick={() => setShowAll(true)}>View All</button>
          <MinutesTable
            rows={minutesList}
            onView={handleViewMinutes}
            onEdit={(minutes) => setSelectedMinutes(minutes)}
            onDelete={handleDeleteMinutes}
          />
          {selectedMinutes && <MinutesModal initialData={selectedMinutes} onClose={() => setSelectedMinutes(null)} />}
          {pdfModalOpen && (
            <div className="modal-backdrop" style={{ zIndex: 1000 }}>
              <div className="modal" style={{ width: '80%', height: '90%' }}>
                <h3>Viewing Minutes</h3>
                <iframe
                  src={pdfUrl}
                  width="100%"
                  height="95%"
                  title="PDF Viewer"
                  style={{ border: '1px solid #ccc' }}
                />
                <button onClick={() => setPdfModalOpen(false)}>Close</button>
              </div>
            </div>
          )}
          {showAll && <FullList onClose={() => setShowAll(false)} />}
        </div>
    )
  };

  return (
    <div className="gs-component">
      <h4>GS Component</h4>
      <div className="gs-subcomponents">
        <MinutesDashboard />
        <GSOutline />
      </div>
    </div>
  );
};

export default GS;