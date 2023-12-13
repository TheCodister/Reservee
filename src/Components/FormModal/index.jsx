import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { useState } from "react";

import "./FormModal.css";

const FormModal = ({ onConfirm, onClose, modalTitle, formData, setFormData }) => {
  const handleFormChange = (fieldName, value) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      [fieldName]: value,
    }));
    console.log(formData)
  };

   // State to manage confirmation modal visibility
   const [isConfirmationModalOpen, setConfirmationModalOpen] = useState(false);

   const handleConfirm = () => {
     // Open the confirmation modal
     setConfirmationModalOpen(true);
   };
 
   const handleConfirmModalClose = () => {
     // Close the confirmation modal
     setConfirmationModalOpen(false);
   };

    return (
      <div className='form_modal'>
      <Modal
        open={true}
        onClose={onClose}  // Set the onClose prop to the provided onClose function
        disableBackdropClick={false} // Allow clicking outside the modal to close
      >
        <div className="modal open">
          <h2 className="cancel">{modalTitle}</h2>
        {/* Form Fields */}
        <div className="form-field">
          <label className='label_form' htmlFor="FName">Full Name:</label>
          <input className='input_form'
            type="text"
            id="FName"
            name="FName"
            value={formData.FName}
            onChange={(e) => handleFormChange("FName", e.target.value)}
          />
        </div>

        <div className="form-field">
          <label className='label_form' htmlFor="Phone">Phone:</label>
          <input className='input_form'
            type="tel"
            id="Phone"
            name="Phone"
            value={formData.Phone}
            onChange={(e) => handleFormChange("Phone", e.target.value)}
          />
        </div>

        <div className="form-field">
          <label className='label_form' htmlFor="Email">Email:</label>
          <input className='input_form'
            type="email"
            id="Email"
            name="Email"
            value={formData.Email}
            onChange={(e) => handleFormChange("Email", e.target.value)}
          />
        </div>

        <div className="form-field">
          <label className='label_form' htmlFor="Date">Date:</label>
          <input className='input_form'
            type="date"
            id="Date"
            name="Date"
            value={formData.Date}
            onChange={(e) => handleFormChange("Date", e.target.value)}
          />
        </div>

        <div className="form-field">
          <label className='label_form' htmlFor="Time">Time:</label>
          <input className='input_form'
            type="time"
            id="Time"
            name="Time"
            value={formData.Time}
            onChange={(e) => handleFormChange("Time", e.target.value)}
          />
        </div>

        <div className="form-field">
          <label className='label_form' htmlFor="People">Number of People:</label>
          <input className='input_form'
            type="number"
            id="People"
            name="People"
            value={formData.People}
            onChange={(e) => handleFormChange("People", parseInt(e.target.value, 10))}
          />
        </div>

        <div className="form-field">
          <label className='label_form' htmlFor="Note">Note:</label>
          <textarea className='input_form'
            id="Note"
            name="Note"
            value={formData.Note}
            onChange={(e) => handleFormChange("Note", e.target.value)}
          />
        </div>

        {/* Add other form fields similarly */}
          <div className="Btn">
          <button className="confirmBtn" onClick={handleConfirm}>Đồng ý</button>
          <button className="cancelBtn" onClick={onClose}>Hủy bỏ</button>
          </div>
        </div>
      </Modal>
      {/* Confirmation Modal */}
      <Modal open={isConfirmationModalOpen} onClose={handleConfirmModalClose}>
        <div className="modal open">
          <h2 className="cancel">Confirmation</h2>
          {/* Display confirmation information */}
          <p>Full Name: {formData.FName}</p>
          <p>Phone: {formData.Phone}</p>
          <p>Email: {formData.Email}</p>
          <p>Date: {formData.Date}</p>
          <p>Time: {formData.Time}</p>
          <p>People: {formData.People}</p>
          <p>Note: {formData.Note}</p>
          <p>Deposit: {formData.People * 100000} vnđ</p>
          <p>Status: Create at time by user...</p>
          {/* ... (display other form fields similarly) */}
          <div className="Btn">
            {/* Perform the actual confirmation action */}
            <button className="confirmBtn" onClick={() => { onConfirm; handleConfirmModalClose(); }}>Confirm</button>
            <button className="cancelBtn" onClick={handleConfirmModalClose}>Cancel</button>
          </div>
        </div>
      </Modal>
    </div>
    );
  };

export default FormModal;