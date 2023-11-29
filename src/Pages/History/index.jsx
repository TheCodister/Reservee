import "./History.css";
import DatePicker from 'react-datepicker';
import React, { useState, useEffect } from 'react';
import 'react-datepicker/dist/react-datepicker.css';
import { filterPrintingLogs } from '../../Controllers/log_controller';
import { ReturnButton } from "../../Components";
import { PrintingLogsTable } from "../../Components";
import vi from 'date-fns/locale/vi';

const History = () => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  // const filteredPrintingLogs = filterPrintingLogs(null, null)
  // console.log(filteredPrintingLogs)
  const [filteredPrintingLogs, setFilteredPrintingLogs] = useState(() => filterPrintingLogs(null, null));
  const [selectAllDates, setSelectAllDates] = useState(false);

  const handleSelectAllDatesChange = (event) => {
    if (!selectAllDates) {
      setStartDate(null)
      setEndDate(null)
    }
    setSelectAllDates(event.target.checked);
  };

  const updateTable = (startDate, endDate) => {
    const logs = filterPrintingLogs(startDate, endDate);
    setFilteredPrintingLogs(logs);
  };

  useEffect(() => {
    updateTable(startDate, endDate);
  }, [selectAllDates, startDate, endDate]);

  return (
    <div className="history">
      <div className="history-title">
        <h1>Lịch sử in</h1>
        <ReturnButton />
      </div>
      <div className="filter">
          <div className="input-container">
            <label htmlFor="startDate">Từ </label>
              <DatePicker
                  id="startDate"
                  selected={startDate}
                  onChange={(date) => setStartDate(date)}
                  selectsStart
                  startDate={startDate}
                  endDate={endDate}
                  dateFormat="dd/MM/yyyy"
                  locale={vi}
                  readOnly={selectAllDates}
              />
          </div>
          <div className="input-container">
            <label htmlFor="endDate">Đến </label>
              <DatePicker
                  id="endDate"
                  selected={endDate}
                  onChange={(date) => setEndDate(date)}
                  selectsStart
                  startDate={startDate}
                  endDate={endDate}
                  dateFormat="dd/MM/yyyy"
                  locale={vi}
                  readOnly={selectAllDates}
              />
          </div>
          <div className="input-container">
            <label htmlFor="selectAllDates">Tất cả các ngày </label>
            <input
                type="checkbox"
                id="selectAllDates"
                name="selectAllDates"
                checked={selectAllDates}
                onChange={handleSelectAllDatesChange}
            />
          </div>
        </div>
        <PrintingLogsTable printingLogs={filteredPrintingLogs} />
    </div>
  );
};

export default History;
