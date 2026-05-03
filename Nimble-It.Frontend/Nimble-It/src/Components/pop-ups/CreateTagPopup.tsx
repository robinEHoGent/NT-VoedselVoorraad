import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CreateTag } from "@/Api/apiCallsTags";
import { useState } from "react";
import toast from "react-hot-toast";
import { AxiosError } from "axios";

interface CreateTagPopupProps {
  onClose: () => void;
}

function CreateTagPopup({ onClose }: CreateTagPopupProps) {
  const [newTagName, setNewTagName] = useState("");
  const queryClient = useQueryClient();

  const createTagMutation = useMutation({
    mutationFn: CreateTag,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tags"] });
      onClose();
      toast.success("Tag created successfully!", {
        duration: 2000,
        position: "top-center",
      });
    },
    onError: (error: AxiosError<{ message: string }> | Error) => {
      const message =
        error instanceof AxiosError
          ? error.response?.data?.message || "Failed to create tag"
          : "Failed to create tag";
      toast.error(message, {
        duration: 3000,
        position: "top-center",
      });
    },
  });

  const handleCreateTag = () => {
    if (newTagName.trim()) {
      createTagMutation.mutate({ name: newTagName.trim() });
    }
  };

  return (
    <div className="flex items-center justify-center">
      <form
        noValidate
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          handleCreateTag();
        }}
      >
        <p className="pb-4 text-center text-lg font-semibold">Create New Tag</p>

        <div className="flex flex-col items-center pb-4">
          <input
            type="text"
            value={newTagName}
            onChange={(e) => setNewTagName(e.target.value)}
            placeholder="Enter tag name..."
            className="w-64 rounded-xl border-2 px-3 py-2 text-center"
            autoFocus
          />
        </div>

        <div className="flex min-w-1/2 justify-center gap-2 justify-self-center md:gap-4">
          <svg
            onClick={onClose}
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
            type="submit"
            disabled={createTagMutation.isPending || !newTagName.trim()}
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
      </form>
    </div>
  );
}

export default CreateTagPopup;
