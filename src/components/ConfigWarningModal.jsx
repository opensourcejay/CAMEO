import './ConfigWarningModal.css';

function ConfigWarningModal({ isOpen, onClose, message }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-icon">⚙️</div>
          <h2>Configuration Required</h2>
          <button className="modal-close" onClick={onClose}>&times;</button>
        </div>
        <div className="modal-body">
          <p className="modal-message">{message}</p>
          <div className="modal-instructions">
            <p><strong>To get started:</strong></p>
            <ol>
              <li>Click the <strong>Settings button (⚙️)</strong> in the sidebar</li>
              <li>Enter your Azure OpenAI API key and endpoint</li>
              <li>Save your configuration</li>
              <li>Return here to generate media</li>
            </ol>
          </div>
        </div>
        <div className="modal-footer">
          <button className="modal-button" onClick={onClose}>
            Got it!
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfigWarningModal;
