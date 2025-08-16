

const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <h3>{title}</h3>
        {children}
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
}