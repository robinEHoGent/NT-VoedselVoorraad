import { ArrowDownAZ, ArrowUpAZ, CalendarCheck } from "lucide-react";

interface FilterOptions {
  alfabet: boolean;
  date: boolean;
}

interface FilterControlsProps {
  filterOptions: FilterOptions;
  onFilterChange: (name: keyof FilterOptions) => void;
  selectedDate: Date | undefined;
  onDateChange: (date: Date | undefined) => void;
}

function FilterControls({
  filterOptions,
  onFilterChange,
}: FilterControlsProps) {
  return (
    <div className="flex justify-end gap-4">
      <div
        className="bg-primary text-secondary flex h-12 w-12 cursor-pointer items-center justify-center rounded-full"
        onClick={() => onFilterChange("alfabet")}
      >
        {filterOptions.alfabet ? <ArrowDownAZ /> : <ArrowUpAZ />}
      </div>
      <div
        className={`border-primary flex h-12 w-12 cursor-pointer items-center justify-center rounded-full border-2 p-2 ${filterOptions.date ? "bg-bg text-primary" : "bg-primary text-secondary"}`}
        onClick={() => onFilterChange("date")}
      >
        <CalendarCheck />
      </div>
    </div>
  );
}

export default FilterControls;
