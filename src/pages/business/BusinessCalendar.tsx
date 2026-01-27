import React from "react";
import { Calendar, dayjsLocalizer } from "react-big-calendar";
import dayjs from "dayjs";
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";

import "./calendar.scss";
import { Views } from "react-big-calendar";

const DnDCalendar = withDragAndDrop(Calendar);

const localizer = dayjsLocalizer(dayjs);

const BusinessCalendar = () => {
  return (
    <div className="w-full">
      <div className="md:w-[2000px] m-auto">
        <DnDCalendar
          defaultView={Views.WEEK}
          localizer={localizer}
          draggableAccessor={(event) => true}
          selectable
          style={{ height: 700 }}
          scrollToTime={new Date().setHours(7)}
        />
      </div>
    </div>
  );
};

export default BusinessCalendar;
