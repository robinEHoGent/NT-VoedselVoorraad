import { AxiosError } from "axios";

interface ErrorMessageProps {
  error: Error | null;
  title?: string;
}

function ErrorMessage({
  error,
  title = "Something went wrong",
}: ErrorMessageProps) {
  // Check if it's an Axios error to provide more specific information
  if (error instanceof AxiosError) {
    const status = error.response?.status;
    const message = error.response?.data?.message || error.message;

    return (
      <div className="mt-40 px-4 text-center">
        <h2 className="text-customRed mb-2 text-2xl">{title}</h2>
        {status && (
          <p className="text-customGrayMedium mb-2 text-sm">Error {status}</p>
        )}
        <p className="text-customGrayMedium">{message}</p>
      </div>
    );
  }

  // Generic error fallback
  return (
    <div className="mt-40 px-4 text-center">
      <h2 className="text-customRed mb-2 text-2xl">{title}</h2>
      <p className="text-customGrayMedium">
        {error?.message || "An unexpected error occurred"}
      </p>
    </div>
  );
}

export default ErrorMessage;
