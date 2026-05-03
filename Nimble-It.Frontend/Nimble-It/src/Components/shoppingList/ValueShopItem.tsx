import { useState } from "react";
import { IoMdCheckmarkCircle } from "react-icons/io";
import ValueStepperButton from "../buttons/ValueStepperButton";

const ValueShopItem = ({ label = "Productnaam" }) => {
  const [checked, setChecked] = useState(false);

  return (
    <div>
      <div className="flex items-center gap-3 rounded-2xl bg-white px-4 py-2 shadow">
        <IoMdCheckmarkCircle
          onClick={(e) => {
            e.stopPropagation();
            setChecked(!checked);
          }}
          className={`cursor-pointer text-3xl transition-colors ${
            checked ? "text-tertiary" : "customGrayMedium"
          }`}
        />
        <span className="text-lg font-medium">{label}</span>
        <ValueStepperButton disabled={checked} />
      </div>
    </div>
  );
};

export default ValueShopItem;
