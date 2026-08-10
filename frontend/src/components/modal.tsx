import type { ModalType } from "@/types";

const Modal = ({ isOpen, onClose, title, children }: ModalType) => {
    if (!isOpen) return null;

    return (
        <div className="modal-backdrop" role="presentation">
            <div className="modal" role="dialog" aria-modal="true" aria-label={title}>
                <h3>{title}</h3>
                {children}
                <button type="button" onClick={onClose} style={{marginTop: "10px"}}>Close</button>
            </div>
        </div>
    );
};

export default Modal;
