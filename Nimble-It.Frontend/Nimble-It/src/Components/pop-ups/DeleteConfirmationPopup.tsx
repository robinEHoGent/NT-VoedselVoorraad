interface DeleteConfirmationPopupProps {
  onConfirm: () => void;
  onCancel: () => void;
  title?: string;
  message?: string;
  isPending?: boolean;
}

function DeleteConfirmationPopup({
  onConfirm,
  onCancel,
  title = "Delete Recipe",
  message = "Are you sure you want to delete this recipe? This action cannot be undone.",
  isPending = false,
}: DeleteConfirmationPopupProps) {
  return (
    <div className="flex items-center justify-center">
      <div>
        <p className="pb-4 text-center text-lg font-semibold text-red-500">
          {title}
        </p>

        <div className="flex flex-col items-center pb-4">
          <p className="w-64 text-center">{message}</p>
        </div>

        <div className="flex min-w-1/2 justify-center gap-2 justify-self-center md:gap-4">
          <svg
            onClick={onCancel}
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
          <button
            onClick={onConfirm}
            disabled={isPending}
            className="disabled:opacity-50"
          >
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
      </div>
    </div>
  );
}

export default DeleteConfirmationPopup;
