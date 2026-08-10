import { useEffect, useState } from "react";
import Modal from "@/components/modal";
import type { ExecutiveRoster, ExecutiveRosterModalProps } from "@/types";

const ECUpdateModal = ({initialData = {}, onClose, onSubmit, isOpen}: ExecutiveRosterModalProps) => {
    const [roster, setRoster] = useState<ExecutiveRoster>(initialData);

    useEffect(() => setRoster(initialData), [initialData]);

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Update Executive Committee Roster">
            <form onSubmit={event => { event.preventDefault(); onSubmit(roster); onClose(); }}>
                {Object.entries(roster).map(([position, info]) => (
                    <div key={position}>
                        <label htmlFor={`roster-${position}`}>{position}:</label>
                        <input
                            id={`roster-${position}`}
                            type="text"
                            value={info.person}
                            onChange={event => setRoster(current => ({
                                ...current,
                                [position]: {...info, person: event.target.value},
                            }))}
                        />
                    </div>
                ))}
                <button type="submit">Update Roster</button>
            </form>
        </Modal>
    );
};

export default ECUpdateModal;
