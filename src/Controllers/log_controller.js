import { hardcodedPrintingLogs } from '../Models/log_model';

const filterPrintingLogs = (startDate, endDate) => {
    return hardcodedPrintingLogs.filter(log => {
        // Check start_date if defined and not equal
        if (startDate !== null && log.date < startDate) {
            return false;
        }

        // Check end_date if defined and not equal
        if (endDate !== null && log.date > endDate) {
            return false;
        }
        // If all conditions pass, include the log in the result
        return true;
    });
};

export { filterPrintingLogs };