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
  };

  const generateTimeOptions = () => {
    const timeOptions = [];
    let startTime = new Date();
    startTime.setHours(9, 0, 0, 0);
  
    for (let i = 0; i < 24; i++) {
      const hours = startTime.getHours();
      const minutes = startTime.getMinutes();
      const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
      timeOptions.push({ label: formattedTime, value: formattedTime });
  
      startTime.setMinutes(startTime.getMinutes() + 30);
    }
  
    return timeOptions;
  };
  
  const timeOptions = generateTimeOptions();

  const handleAdditionalValue = () => {
    handleFormChange("Deposit", formData.People * 100000)
    handleFormChange("TimeSlot", timeOptions.findIndex((option) => option.value === formData.Time) + 1);
  }

  const calculateMaxDate = () => {
    const maxDate = new Date();
    maxDate.setDate(maxDate.getDate() + 7);
  
    // Format the date as yyyy-mm-dd for the input element
    const formattedMaxDate = maxDate.toISOString().split('T')[0];
    return formattedMaxDate;
  };

  const calculateMinDate = () => {
    const minDate = new Date();
  
    // Format the date as yyyy-mm-dd for the input element
    const formattedMinDate = minDate.toISOString().split('T')[0];
    return formattedMinDate;
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
        disablebackdropclick="false" // Allow clicking outside the modal to close
      >
        <div className="modal open">
          <h2 className="cancel">{modalTitle}</h2>
        {/* Form Fields */}
            <table >
          <tbody>
            <tr >
              <td className="label_form">Full Name:</td>
              <td>
                <input
                  className="input_form"
                  type="text"
                  id="FName"
                  name="FName"
                  value={formData.FName}
                  onChange={(e) => handleFormChange("FName", e.target.value)}
                />
              </td>
            </tr>

            <tr>
              <td className="label_form">Phone:</td>
              <td>
                <input
                  className="input_form"
                  type="tel"
                  id="Phone"
                  name="Phone"
                  value={formData.Phone}
                  onChange={(e) => handleFormChange("Phone", e.target.value)}
                />
              </td>
            </tr>

            <tr>
              <td className="label_form">Email:</td>
              <td>
                <input
                  className="input_form"
                  type="email"
                  id="Email"
                  name="Email"
                  value={formData.Email}
                  onChange={(e) => handleFormChange("Email", e.target.value)}
                />
              </td>
            </tr>

            <tr>
              <td className="label_form">Date:</td>
              <td>
                <input
                  className="input_form"
                  type="date"
                  id="Date"
                  name="Date"
                  value={formData.Date}
                  onChange={(e) => handleFormChange("Date", e.target.value)}
                  max={calculateMaxDate()} // Set the maximum date dynamically
                  min={calculateMinDate()} // Set the minimum date dynamically
                />
              </td>
            </tr>

            <tr>
              <td className="label_form">Time:</td>
              <td>
                <select
                  className="input_form"
                  id="Time"
                  name="Time"
                  value={formData.Time}
                  onChange={(e) => handleFormChange("Time", e.target.value)}
                >
                  {timeOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </td>
            </tr>

            <tr>
              <td className="label_form">Number of People:</td>
              <td>
                <input
                  className="input_form"
                  type="number"
                  id="People"
                  name="People"
                  value={formData.People}
                  onChange={(e) => {
                    const value = parseInt(e.target.value, 10);
                    // Check if the value is greater than 0 before updating the state
                    if (value > 0) {
                      handleFormChange("People", value);
                    }
                  }}
                />
              </td>
            </tr>

            <tr>
              <td className="label_form">Table number:</td>
              <td>
                <input
                  className="input_form"
                  type="number"
                  id="tableNumber"
                  name="tableNumber"
                  value={formData.tableNumber}
                  onChange={(e) => {
                    const value = parseInt(e.target.value, 10);
                    // Check if the value is greater than 0 before updating the state
                    if (value > 0) {
                      handleFormChange("tableNumber", value);
                    }
                  }}
                />
              </td>
            </tr>

            <tr>
              <td className="label_form">Note:</td>
              <td>
                <textarea
                  className="input_form"
                  id="Note"
                  name="Note"
                  value={formData.Note}
                  onChange={(e) => handleFormChange("Note", e.target.value)}
                />
              </td>
            </tr>
          </tbody>
        </table>

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
          <p>Table: {formData.tableNumber}</p>
          <p>Note: {formData.Note}</p>
          <p>Deposit: {formData.People * 100000} vnđ</p>
          <p>Status: Create at time by user...</p>
          {/* ... (display other form fields similarly) */}
          <div className="Btn">
            {/* Perform the actual confirmation action */}
            <button className="confirmBtn" onClick={() => { onConfirm(); handleAdditionalValue(); handleConfirmModalClose(); }}>Confirm</button>
            <button className="cancelBtn" onClick={() => {handleConfirmModalClose(); onClose();}}>Cancel</button>
          </div>
        </div>
      </Modal>
    </div>
    );
  };

export default FormModal;