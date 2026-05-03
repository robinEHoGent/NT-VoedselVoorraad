import { useState } from "react";
import { ChevronDownIcon } from "lucide-react";
import { Button } from "@/Components/ui/button";
import { Calendar } from "@/Components/ui/calendar";

function CalendarButton({ date, setDate }: CalendarButtonProps) {
  const [calendarOpen, setCalendarOpen] = useState(false);

  return (
    <>
      <Button
        variant={"outline"}
        id="date"
        className="border-primary text-primary hover:bg-primary hover:text-customWhite h-full justify-between rounded-[9999px] border-2 px-6 font-semibold"
        onClick={() => setCalendarOpen(true)}
      >
        {date ? date.toLocaleDateString() : "Select date"}
        <ChevronDownIcon />
      </Button>

      {calendarOpen && (
        <div
          className="bg-bg/10 fixed inset-0 z-50 flex items-center justify-center"
          onClick={() => setCalendarOpen(false)}
        >
          <div
            className="bg-bg rounded-md p-0 shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <Calendar
              mode="single"
              selected={date}
              captionLayout="dropdown"
              onSelect={(date) => {
                setDate(date);
                setCalendarOpen(false);
              }}
            />
          </div>
        </div>
      )}
    </>
  );
}

interface CalendarButtonProps {
  date: Date | undefined;
  setDate: (date: Date | undefined) => void;
}

export default CalendarButton;
