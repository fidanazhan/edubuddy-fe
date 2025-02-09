import Modal from 'react-modal';
import { FaTimes } from 'react-icons/fa';
import './settingModal.css'

const SettingsModal = ({ isOpen, onClose, modalRef }) => {
    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onClose} // This is still required for accessibility
            contentLabel="Settings Modal"
            className="modal-content"
            overlayClassName="modal-overlay"
            shouldCloseOnEsc={false} // Disable closing on Escape key
            shouldCloseOnOverlayClick={false} // Disable closing on backdrop click
        >
            <div ref={modalRef}>
                {/* "X" button at the top right corner */}
                <button
                    className="absolute top-2 right-2 p-2 text-gray-600 hover:text-gray-800"
                    onClick={onClose}
                >
                    <FaTimes className="w-5 h-5" />
                </button>
                <h2 className="text-xl font-bold mb-4">Settings</h2>
            </div>
        </Modal>
    );
};

export default SettingsModal;