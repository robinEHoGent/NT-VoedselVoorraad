import * as React from "react";
import { Field } from "formik";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/Components/ui/select";
import { ScrollArea } from "@/Components/ui/scroll-area";
import Input from "@/Components/ui/input";

type Option = {
  label: string;
  value: string;
  imageUrl?: string;
};

interface ExpandableSelectProps {
  name: string;
  label: string;
  options: Option[];

  /** Expansion logic */
  expanded: boolean;
  onToggle: () => void;

  /** When expanded, show extra input */
  showValueInput?: boolean;
  valueInputName?: string;

  /** Optional image preview in dropdown */
  showImages?: boolean;

  /** Disable dropdown when expanded */
  disableWhenExpanded?: boolean;

  /** Called when selection changes */
  onChange?: (value: string) => void;
}

const ExpandableSelect: React.FC<ExpandableSelectProps> = ({
  name,
  label,
  options,
  expanded,
  onToggle,
  showValueInput = false,
  valueInputName,
  showImages = false,
  disableWhenExpanded = true,
  onChange,
}) => {
  return (
    <div className="mb-3">
      {/* Label */}
      <label className="mb-1 block text-sm font-medium">{label}</label>

      {/* Select + Button */}
      <div className="flex items-center gap-2">
        <Field name={name}>
          {({ field, form }: any) => (
            <Select
              value={field.value || ""}
              disabled={disableWhenExpanded && expanded}
              onValueChange={(value) => {
                form.setFieldValue(name, value);
                onChange?.(value);
              }}
            >
              <SelectTrigger
                className={`w-full rounded border-2 px-2 py-1 ${
                  expanded
                    ? "cursor-not-allowed bg-gray-100 text-gray-500 italic"
                    : "bg-white"
                }`}
              >
                <SelectValue placeholder="Select..." />
              </SelectTrigger>

              <SelectContent>
                <ScrollArea className="h-56">
                  {options.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      <div className="flex items-center gap-2">
                        {showImages && option.imageUrl && (
                          <img
                            src={option.imageUrl}
                            alt=""
                            className="h-6 w-6 rounded object-cover"
                          />
                        )}
                        <span>{option.label}</span>
                      </div>
                    </SelectItem>
                  ))}
                </ScrollArea>
              </SelectContent>
            </Select>
          )}
        </Field>

        {/* + / - button */}
        <button
          type="button"
          onClick={onToggle}
          className={`flex h-8 w-8 items-center justify-center rounded-full text-white transition ${expanded ? "bg-red-500" : "bg-[#FF6B4A]"}`}
        >
          {expanded ? "−" : "+"}
        </button>
      </div>

      {/* Extra value input (only when expanded) */}
      {expanded && showValueInput && valueInputName && (
        <div className="mt-2">
          <Field
            as={Input}
            name={valueInputName}
            placeholder="Value"
            className="w-full rounded border-2 px-2 py-1"
          />
        </div>
      )}
    </div>
  );
};

export default ExpandableSelect;
