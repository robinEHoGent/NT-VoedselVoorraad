import { useState } from "react";

interface ValueStepperButtonProps {
  value?: number;
  onChange?: (newValue: number) => void;
  disabled?: boolean;
}

const ValueStepperButton = ({
  value = 1,
  onChange,
  disabled = false,
}: ValueStepperButtonProps) => {
  const [internalCount, setInternalCount] = useState(value);

  const currentValue = onChange ? value : internalCount;

  const handleChange = (newValue: number) => {
    if (onChange) {
      onChange(newValue);
    } else {
      setInternalCount(newValue);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => {
          if (!disabled) handleChange(Math.max(1, currentValue - 1));
        }}
        className="text-customBlack active:bg-primary cursor-pointer rounded-2xl px-4 py-2 shadow transition-colors active:text-white"
      >
        -
      </button>

      <span className="bg-bg w-16 rounded-2xl px-2 py-2 text-center text-xl font-semibold shadow">
        {currentValue}
      </span>

      <button
        onClick={() => {
          if (!disabled) handleChange(currentValue + 1);
        }}
        className="text-customBlack active:bg-primary cursor-pointer rounded-2xl px-4 py-2 shadow transition-colors active:text-white"
      >
        +
      </button>
    </div>
  );
};

export default ValueStepperButton;
