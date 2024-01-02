import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
import { MenuItem } from '@mui/material';
import Button from '@mui/material/Button';
import { useEffect, useState } from "react";
import { format, parseISO } from 'date-fns';

import "./FormModal.css";


const FormModal = ({ onConfirm, onClose, modalTitle, formData, timeSlots, setFormData, selectedDate, reserveList }) => {
  const [reservationsForDaT, setReservation] = useState([]);
  const [phoneError, setPhoneError] = useState(false);
  const [tableError, setTableError] = useState(false);
  const [tableInUsed, setTableInUsed] = useState(false);
  const [tempDate, setTempDate] = useState('')
  const handleFormChange = (fieldName, value) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      [fieldName]: value,
    }));

    if(fieldName === 'Date') {
      if(value != '' && formData.Time != '') {
        setTableError(false);
      }
    }
    if(fieldName === 'Time') {
      if(value != '' && formData.Date != '') {
        setTableError(false);
      }
    }
  };

  const handleDateChange = (e) => {
    const rawDate = e.target.value; // Capture the date in 'yyyy-mm-dd' format
    setTempDate(rawDate)
    const formattedDate = format(parseISO(rawDate, 'yyyy-MM-dd', new Date()), 'dd/MM/yyyy'); // Format to 'dd/mm/yyyy'

    handleFormChange('Date', formattedDate);
  };

  const handletableNumberChange = (e) => {
    if(formData.Date === '' || formData.Time === '') {
      setTableError(true);
    }
    else {
      setTableError(false);
    }

    handleFormChange('tableNumber', e);
  };

  useEffect(() => {
    if(formData.Date != '' && formData.Time != '') {
    setReservation(reserveList.filter(
      (Reserve) => 
        Reserve.Date === formData.Date && 
        Reserve.Time === formData.Time && 
        Reserve.tableNumber === formData.tableNumber
      ));
    }
  }, [formData.Date, formData.Time, formData.tableNumber]);

  useEffect(() => {
      if(reservationsForDaT.length != 0) {
        setTableInUsed(true);
      }
      else {
        setTableInUsed(false);
      }
    
  }, [reservationsForDaT]);


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
    // Check if required fields are filled before opening the confirmation modal
    if (formData.FName && formData.Phone && formData.Date && formData.Time && formData.People && formData.tableNumber) {
      // Open the confirmation modal
      setConfirmationModalOpen(true);
    } else {
      // Display an alert if required fields are not filled
      window.alert("Please fill in all required fields");
    }
  };
 
   const handleConfirmModalClose = () => {
     // Close the confirmation modal
     setConfirmationModalOpen(false);
   };

   const handleConfirmModalAccept = () => {
    handleConfirmModalClose();  
    onConfirm();
    onClose();
   }

   const handleConfirmModalDecline = () => {
    handleConfirmModalClose(); 
    onClose();
   }

    return (
      <div className='form_modal'>
        <Modal
        open={true}
        onClose={onClose}
        disablebackdropclick="false"
      >
        <div className="modal open">
          <h2 className="cancel">{modalTitle}</h2>
          {/* Form Fields */}
          <form style={{display:"flex", flexDirection:"column"}}>
            <TextField
              InputProps={{ className: "input_form" }}
              label="Full Name"
              type="text"
              id="FName"
              name="FName"
              value={formData.FName}
              onChange={(e) => handleFormChange("FName", e.target.value)}
              required
            />

            <TextField
              InputProps={{ className: "input_form" }}
              label="Phone"
              type="tel"
              id="Phone"
              name="Phone"
              value={formData.Phone}
              onChange={(e) => {
                handleFormChange("Phone", e.target.value);
                const isValidPhone = /^\d{10}$/.test(e.target.value);
                setPhoneError(!isValidPhone);
              }}
              required
              error={phoneError}
              helperText={phoneError ? 'Invalid phone number' : ''}
            />

            <TextField
              InputProps={{ className: "input_form" }}
              label="Email"
              type="email"
              id="Email"
              name="Email"
              value={formData.Email}
              onChange={(e) => handleFormChange("Email", e.target.value)}
            />

            <TextField
                  InputLabelProps={{ shrink: true, className: 'input_form_label' }}
                  InputProps={{ className: 'input_form' }}
                  label="Date"
                  type="date"
                  id="Date"
                  name="Date"
                  value={tempDate}
                  onChange={handleDateChange}
                  inputProps={{
                    max: calculateMaxDate(), // Set the maximum date dynamically
                    min: calculateMinDate(), // Set the minimum date dynamically
                  }}
                  required
                />


            
            <TextField
              InputProps={{ className: "input_form" }}
              label="Time"
              select
              id="Time"
              name="Time"
              value={formData.Time}
              onChange={(e) => handleFormChange("Time", e.target.value)}
              required
            >
              {timeSlots.map((slot) => (
                <MenuItem key={slot.start} value={slot.start}>
                  {slot.start}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              InputProps={{ className: "input_form" }}
              label="Number of People"
              type="number"
              id="People"
              name="People"
              value={formData.People}
              required
              onChange={(e) => {
                const value = parseInt(e.target.value, 10);
                if (value > 0 & value <= 4) {
                  handleFormChange("People", value);
                }
              }}
            />

            <TextField
              InputProps={{ className: "input_form" }}
              label="Table number"
              type="number"
              id="tableNumber"
              name="tableNumber"
              value={formData.tableNumber}
              onChange={(e) => {
                const value = parseInt(e.target.value, 10);
                if (value > 0 & value <= 8) {
                  handletableNumberChange(value);
                }
              }}
              required
              error={tableError || tableInUsed}
              helperText={tableError
                ? 'Please specify date and time first'
                : tableInUsed
                ? 'Table already in use'
                : ''
              }
            />

            <TextField
              InputProps={{ className: "input_form" }}
              label="Note"
              multiline
              id="Note"
              name="Note"
              value={formData.Note}
              onChange={(e) => handleFormChange("Note", e.target.value)}
            />

            <div className="Btn">
              <Button
                sx={{ mr: "20px" }}
                variant="contained"
                color="primary"
                onClick={handleConfirm}
                disabled={
                  !(formData.FName && formData.Phone && formData.Date && formData.Time && formData.People && formData.tableNumber 
                    && !phoneError && !tableError)
                }
              >
                Đồng ý
              </Button>
              <Button variant="contained" color="error" onClick={onClose}>
                Hủy bỏ
              </Button>
            </div>
          </form>
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
          <div className="Btn">
            <button className="confirmBtn" onClick={handleConfirmModalAccept}>Confirm</button>
            <button className="cancelBtn" onClick={handleConfirmModalDecline}>Cancel</button>
          </div>
        </div>
      </Modal>
    </div>
    );
  };

export default FormModal;