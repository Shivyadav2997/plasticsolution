import React from "react";
import DateRangePicker from "react-bootstrap-daterangepicker";
import "bootstrap-daterangepicker/daterangepicker.css";
import moment from "moment";
const CustomDatePicker = ({ startDate, endDate, onCallback, children }) => {
  return (
    <DateRangePicker
      initialSettings={{
        startDate: startDate,
        endDate: endDate,
        autoApply: true,
        ranges: {
          Today: [moment().toDate(), moment().toDate()],
          Yesterday: [
            moment().subtract(1, "days").toDate(),
            moment().subtract(1, "days").toDate(),
          ],
          "Last 7 Days": [
            moment().subtract(6, "days").toDate(),
            moment().toDate(),
          ],
          "Last 30 Days": [
            moment().subtract(29, "days").toDate(),
            moment().toDate(),
          ],
          "This Month": [
            moment().startOf("month").toDate(),
            moment().endOf("month").toDate(),
          ],
          "Last Month": [
            moment().subtract(1, "month").startOf("month").toDate(),
            moment().subtract(1, "month").endOf("month").toDate(),
          ],
        },
        alwaysShowCalendars: true,
      }}
      onCallback={onCallback}
    >
      {children}
    </DateRangePicker>
  );
};

export default CustomDatePicker;
