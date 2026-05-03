import { UseMutationResult } from "@tanstack/react-query";
import { useState } from "react";

function DeletePopupBase({ state, SetState, mutation }: DeleteItemProps) {
  const [checkedValue, setCheckedValue] = useState<number>(0);

  const HandleClick = (bool: boolean) => {
    console.log(state.id);
    if (!state.id) return;
    if (bool) {
      mutation.mutate(state.id);
      setCheckedValue(1);
    } else setCheckedValue(2);
    setTimeout(() => {
      SetState({ bool: false, id: undefined, productName: "" });
      setCheckedValue(0);
    }, 500);
  };

  return (
    <div className="bg-bg border-secondary fixed top-1/2 left-1/2 z-9 min-w-2/3 -translate-1/2 rounded-2xl border-2 px-4 py-2 shadow-md md:min-w-1/2">
      <p className="pb-4 text-center text-lg whitespace-pre-line">
        {checkedValue === 0
          ? state.message ||
            `Are you sure you want to delete ${state.productName}?`
          : checkedValue === 1
            ? `Deleting ${state.productName}...`
            : "Cancelling..."}
      </p>
      <div className="flex min-w-1/2 justify-center gap-2 justify-self-center md:gap-4">
        <svg
          onClick={() => HandleClick(false)}
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

        <svg
          onClick={() => HandleClick(true)}
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
      </div>
    </div>
  );
}

interface DeleteItemProps {
  state: {
    bool: boolean;
    id: number | undefined;
    productName: string;
    message?: string;
  };
  SetState: React.Dispatch<
    React.SetStateAction<{
      bool: boolean;
      id: number | undefined;
      productName: string;
      message?: string;
    }>
  >;
  mutation: UseMutationResult<void, Error, number, unknown>;
}

export default DeletePopupBase;
