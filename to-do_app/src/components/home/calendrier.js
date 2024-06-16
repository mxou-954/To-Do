import { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

function Calendrier() {
  const [value, setValue] = useState(new Date());

  const handleChange = (newValue) => {
    setValue(newValue);
  };

  return (
    <div className="div_generaletask">
      <div className="container_mesTasksDetails">
        <h1>Calendrier :</h1>
        <div className="container_calendar_details">
          <div className="calendrier_wrapper">
            <Calendar
              onChange={handleChange}
              value={value}
              className="react-calendar"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Calendrier;
