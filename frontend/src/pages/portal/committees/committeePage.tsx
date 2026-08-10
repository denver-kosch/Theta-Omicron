import { useEffect, useState } from "react";
import api from "@/services/apiCall";
import CommitteePosition, { allPositions } from "./positions/committeesMap";
import type { CommitteePositionType } from "@/types";

const CommitteePage = () => {
    const [positions, setPositions] = useState<CommitteePositionType[]>([]);
    const [isAdmin, setIsAdmin] = useState(false);
    const [adminOverride, setAdminOverride] = useState(false);
    const [selectedPosition, setSelectedPosition] = useState<CommitteePositionType | null>(null);

    useEffect(() => {
        const getPositions = async () => {
            const response = await api<{positions: CommitteePositionType[]}>("me/positions", {headers: {Authorization: `Bearer ${localStorage.getItem("token")}`}});
            if (response.success) setPositions(response.positions);
            else console.error(response.error);
    };
        const checkAdmin = async () => {
            const response = await api<{isAdmin: boolean}>("me/admin", {headers: {Authorization: `Bearer ${localStorage.getItem("token")}`}});
            if (response.success && response.isAdmin) setIsAdmin(true);
        };
        void getPositions();
        void checkAdmin();
    }, []);

    const handleOverrideToggle = () => {
        setAdminOverride(prev => {
            const next = !prev;
            if (!next) setSelectedPosition(null);
            return next;
        });
    };

    const AdminList = () => (
        <div className="adminList">
            <div className="adminListHeader" style={{display: "flex", justifyContent: "center", alignItems: "center"}}>
                <h2>Admin Controls</h2>
                <select
                    value={selectedPosition ? allPositions.findIndex(p => p.role === selectedPosition.role && p.committeeName === selectedPosition.committeeName): ""}
                    onChange={event => setSelectedPosition(event.target.value ? allPositions[Number(event.target.value)] : null)}
                >
                    <option key="default" value={""}>Select a position</option>
                    {allPositions.map((position, index) => <option key={`${position.committeeName}-${position.role}`} value={index}>{position.committeeName} - {position.role}</option>)}
                </select>
            </div>
            {selectedPosition && <CommitteePosition position={selectedPosition} />}
        </div>
    );

    return (
        <div className="committeeCentral">
            <h1>Committee Page</h1>
            {isAdmin && (
                <button type="button" className="adminOverride" onClick={handleOverrideToggle}>
                    {adminOverride ? "Disable Override" : "Enable Override"}
                </button>
            )}
            {adminOverride ? <AdminList /> : (
                <div className="committeeList">
                    {positions.map(position => <CommitteePosition key={`${position.committeeName}-${position.role}`} position={position}/>)}
                </div>
            )}
        </div>
    );
};

export default CommitteePage;
