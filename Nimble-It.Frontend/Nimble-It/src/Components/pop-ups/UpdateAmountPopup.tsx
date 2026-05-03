import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { UpdateAmountInventory } from "../../Api/apiCallsInventory";
import { useFormik } from "formik";
import * as Yup from "yup";

function UpdateAmountPopup({ item, close }: UpdateAmountPopupProps) {
  const [isChecked, setIsChecked] = useState<boolean>(false);

  const queryClient = useQueryClient();

  const validationSchema = Yup.object().shape({
    amount: Yup.number()
      .required("Amount is required")
      .min(0.001, `Minimum amount to use is 0,001 ${item.uomName}`)
      .max(
        item.amount,
        `Maximum amount to use is ${item.amount} ${item.uomName}`,
      ),
  });

  const mutation = useMutation({
    mutationFn: ({
      inventoryId,
      amount,
    }: {
      inventoryId: number;
      amount: number;
    }) => UpdateAmountInventory(inventoryId, amount),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inventory"] });
    },
  });

  const { values, handleSubmit, errors, setFieldValue, setFieldTouched } =
    useFormik({
      initialValues: {
        amount: "",
        uomName: item.uomName,
      },
      onSubmit: (values) => {
        if (!item.inventoryId || !values.amount) return;

        mutation.mutate({
          inventoryId: item.inventoryId,
          amount: Number(values.amount),
        });

        setIsChecked(true);

        setTimeout(() => {
          close();
          setIsChecked(false);
        }, 500);
      },
      validationSchema,
      validateOnChange: true,
    });

  return (
    <div className="flex items-center justify-center">
      <form noValidate onSubmit={handleSubmit}>
        <p className="pb-4 text-center text-lg font-semibold">Update amount</p>
        <div className="pb-4 text-center">
          <p>
            Current amount:{" "}
            <strong>
              {item.amount} {item.uomName}
            </strong>
          </p>
        </div>

        <div className="flex flex-col items-center pb-4">
          <input
            type="number"
            name="amount"
            value={values.amount}
            onChange={(e) => setFieldValue("amount", e.target.value)}
            onBlur={() => setFieldTouched("amount", true)}
            step="any"
            className="w-40 rounded-xl border-2 px-3 py-1 text-center"
            placeholder="0"
          />

          {errors.amount && (
            <p className="text-primary pt-2 text-sm">{errors.amount}</p>
          )}
        </div>
        {!errors.amount && (
          <p className="text-md pb-4 text-center whitespace-pre-line">
            {!isChecked
              ? `Are you sure you want to use this amount? 
              The current amount will be ${item.amount - Number(values.amount)} ${item.uomName}.`
              : "Updating..."}
          </p>
        )}
        <div className="flex min-w-1/2 justify-center gap-2 justify-self-center md:gap-4">
          <svg
            onClick={close}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="text-primary size-10 cursor-pointer"
          >
            <path
              fillRule="evenodd"
              d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm-1.72 6.97a.75.75 0 1 0-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 1 0 1.06 1.06L12 13.06l1.72 1.72a.75.75 0 1 0 1.06-1.06L13.06 12l1.72-1.72a.75.75 0 1 0-1.06-1.06L12 10.94l-1.72-1.72Z"
              clipRule="evenodd"
            />
          </svg>
          <button type="submit">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="text-tertiary size-10 cursor-pointer"
            >
              <path
                fillRule="evenodd"
                d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
      </form>
    </div>
  );
}

interface UpdateAmountPopupProps {
  item: {
    inventoryId: number;
    amount: number;
    uomName: string;
  };
  close: () => void;
}

export default UpdateAmountPopup;
