import dayjs, { Dayjs } from "dayjs";
import Calendar from "./Calendar";
import { useState } from "react";
function App() {
  const [value, setValue] = useState<Dayjs>(dayjs());
  return (
    <div className="App">
      {/* 非受控模式 */}
      {/*       <Calendar defaultValue={dayjs()}></Calendar>
       */}
      {/* 受控模式 */}
      <Calendar
        value={value}
        onChange={val => {
          setValue(val);
        }}></Calendar>
    </div>
  );
}

export default App;
