import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';

import "./FormModal.css";

const FormModal = ({ onConfirm, onClose, modalTitle, formData, setFormData }) => {
  const handleFormChange = (fieldName, value) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      [fieldName]: value,
    }));
    console.log(formData)
  };

    return (
      <Modal
        open={true}
        onClose={onClose}  // Set the onClose prop to the provided onClose function
        disableBackdropClick={false} // Allow clicking outside the modal to close
      >
        <div className="modal open">
          <h2 className="cancel">{modalTitle}</h2>
        {/* Form Fields */}
        <div className="form-field">
          <label htmlFor="FName">Full Name:</label>
          <input
            type="text"
            id="FName"
            name="FName"
            value={formData.FName}
            onChange={(e) => handleFormChange("FName", e.target.value)}
          />
        </div>

        <div className="form-field">
          <label htmlFor="Phone">Phone:</label>
          <input
            type="tel"
            id="Phone"
            name="Phone"
            value={formData.Phone}
            onChange={(e) => handleFormChange("Phone", e.target.value)}
          />
        </div>

        <div className="form-field">
          <label htmlFor="Email">Email:</label>
          <input
            type="email"
            id="Email"
            name="Email"
            value={formData.Email}
            onChange={(e) => handleFormChange("Email", e.target.value)}
          />
        </div>

        <div className="form-field">
          <label htmlFor="Date">Date:</label>
          <input
            type="date"
            id="Date"
            name="Date"
            value={formData.Date}
            onChange={(e) => handleFormChange("Date", e.target.value)}
          />
        </div>

        <div className="form-field">
          <label htmlFor="Time">Time:</label>
          <input
            type="time"
            id="Time"
            name="Time"
            value={formData.Time}
            onChange={(e) => handleFormChange("Time", e.target.value)}
          />
        </div>

        <div className="form-field">
          <label htmlFor="People">Number of People:</label>
          <input
            type="number"
            id="People"
            name="People"
            value={formData.People}
            onChange={(e) => handleFormChange("People", parseInt(e.target.value, 10))}
          />
        </div>

        <div className="form-field">
          <label htmlFor="Note">Note:</label>
          <textarea
            id="Note"
            name="Note"
            value={formData.Note}
            onChange={(e) => handleFormChange("Note", e.target.value)}
          />
        </div>

        {/* Add other form fields similarly */}
          <div className="Btn">
          <button className="confirmBtn" onClick={onConfirm}>Đồng ý</button>
          <button className="cancelBtn" onClick={onClose}>Hủy bỏ</button>
          </div>
        </div>
      </Modal>
      
    );
  };

export default FormModal;