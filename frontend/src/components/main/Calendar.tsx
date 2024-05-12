import { useState } from "react";

import { DayPicker } from "react-day-picker";
// import "react-day-picker/style.css";

const Calendar=()=> {
  const [selected, setSelected] = useState<Date | undefined>(undefined);
  return <DayPicker mode="single" selected={selected} onSelect={setSelected} />;
}
export default Calendar;