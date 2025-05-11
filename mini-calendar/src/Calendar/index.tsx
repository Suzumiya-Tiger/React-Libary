import dayjs, { Dayjs } from "dayjs";
import MonthCalendar from "./components/MonthCalendar";
import Header from "./components/Header";
import { CSSProperties, ReactNode, useState } from "react";
import cs from "classnames";
import LocaleContext from "./LocalContext";
import { useControllableValue } from "ahooks";
export interface CalendarProps {
  value?: Dayjs;
  defaultValue?: Dayjs;
  style?: CSSProperties;
  className?: string | string[];
  /* dateRender 是整个覆盖，连带日期的数字一起，而 dateInnerContent 只会在日期的数字下添加一些内容。 */
  // 日期显示的定制
  dateRender?: (currentDate: Dayjs) => ReactNode;
  // 日期单元格的定制，内容会添加到单元格内，全屏模式下生效
  dateInnerContent?: (currentDate: Dayjs) => ReactNode;
  // 国际化相关
  locale?: string;
  onChange?: (date: Dayjs) => void;
}

function Calendar(props: CalendarProps) {
  const {
    value,
    style,
    locale,
    className,
    dateRender,
    dateInnerContent,
    onChange,
  } = props;
  const [curValue, setCurValue] = useControllableValue<Dayjs>(props, {
    defaultValue: dayjs(),
  });
  const [curMonth, setCurMonth] = useState<Dayjs>(curValue);
  const classNames = cs("calendar", className);
  function changeDate(date: Dayjs) {
    setCurValue(date);
    setCurMonth(date);
  }
  function selectHandler(date: Dayjs) {
    changeDate(date);
  }
  function prevMonthHandler() {
    setCurMonth(curMonth.subtract(1, "month"));
  }
  function nextMonthHandler() {
    setCurMonth(curMonth.add(1, "month"));
  }
  function todayHandler() {
    const date = dayjs(Date.now());
    changeDate(date);
  }
  return (
    <LocaleContext.Provider value={{ locale: locale || navigator.language }}>
      <div className={classNames} style={style}>
        <Header
          curMonth={curMonth}
          prevMonthHandler={prevMonthHandler}
          nextMonthHandler={nextMonthHandler}
          todayHandler={todayHandler}
        />
        <MonthCalendar
          value={curValue}
          curMonth={curMonth}
          dateRender={dateRender}
          dateInnerContent={dateInnerContent}
          selectHandler={selectHandler}
        />
      </div>
    </LocaleContext.Provider>
  );
}

export default Calendar;
