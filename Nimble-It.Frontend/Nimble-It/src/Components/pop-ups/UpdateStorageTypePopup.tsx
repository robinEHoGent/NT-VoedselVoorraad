import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { UpdateStorageTypeInventory } from "../../Api/apiCallsInventory";
import { GetAllStorageTypes } from "../../Api/apiCallsStorage";
import { useFormik } from "formik";
import toast from "react-hot-toast";
import * as Yup from "yup";

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "../ui/select";
import { SelectGroup, SelectLabel } from "@radix-ui/react-select";
import { AxiosError } from "axios";
import NotFound from "../../UI/NotFound";
import ErrorMessage from "../../UI/ErrorMessage";

function UpdateStorageTypePopup({ item, close }: UpdateStorageTypePopupProps) {
  const [isChecked, setIsChecked] = useState<boolean>(false);

  const queryClient = useQueryClient();

  const {
    data: storageTypes,
    error,
    isError,
  } = useQuery({
    queryKey: ["storageTypes"],
    queryFn: GetAllStorageTypes,
    retry: (failureCount, error) => {
      if (error instanceof AxiosError && error.response?.status === 404) {
        return false;
      }
      return failureCount < 1;
    },
    staleTime: 5 * 60 * 1000,
  });

  const validationSchema = Yup.object().shape({
    storageTypeName: Yup.string().oneOf(
      storageTypes?.map((st) => st.storageTypeName) ?? [],
      `Choose one of the following storage types: ${storageTypes?.map((st) => st.storageTypeName).join(", ")}`,
    ),
  });

  const mutation = useMutation({
    mutationFn: ({
      inventoryId,
      storageType,
    }: {
      inventoryId: number;
      storageType: StorageTypeRequest;
    }) => UpdateStorageTypeInventory(inventoryId, storageType),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inventory"] });
    },
  });

  const { values, handleSubmit, errors, setFieldValue, setFieldTouched } =
    useFormik({
      initialValues: {
        storageTypeName: "",
      },
      onSubmit: (values) => {
        if (!item.inventoryId || !values.storageTypeName) return;

        if (values.storageTypeName === item.storageTypeName) {
          toast.error(
            `Storage type is the same!
            Choose one of the following types: 
            ${storageTypes
              ?.filter((st) => st.storageTypeName !== item.storageTypeName)
              .map((st) => st.storageTypeName)
              .join(", ")}.`,
            {
              style: {
                border: "1px solid #ff6347",
                padding: "12px",
                color: "#ff6347",
                backgroundColor: "#faf9f7",
              },
              iconTheme: {
                primary: "#ff6347",
                secondary: "#faf9f7",
              },
            },
          );
          return;
        }
        mutation.mutate({
          inventoryId: item.inventoryId,
          storageType: { storageTypeName: values.storageTypeName },
        });

        setIsChecked(true);

        setTimeout(() => {
          close();
          setIsChecked(false);
        }, 500);
      },
      validationSchema,
      validateOnChange: false,
    });

  if (isError) {
    if (error instanceof AxiosError && error.response?.status === 404) {
      return <NotFound />;
    }
    return <ErrorMessage error={error} title="Error loading inventory" />;
  }

  if (!storageTypes) return null;

  return (
    <div className="flex items-center justify-center">
      <form onSubmit={handleSubmit}>
        <p className="pb-4 text-center text-lg font-semibold">
          Update storage type
        </p>
        <div className="pb-4 text-center">
          <p>
            Current place: <strong>{item.storageTypeName}</strong>
          </p>
        </div>

        <div className="flex flex-col items-center pb-4">
          <Select
            name="storageTypeName"
            value={values.storageTypeName}
            onValueChange={(value) => setFieldValue("storageTypeName", value)}
            onOpenChange={(isOpen) => {
              if (!isOpen) setFieldTouched("storageTypeName", true);
            }}
          >
            <SelectTrigger className="rounded-xl border-2 px-3 py-1 text-center">
              <SelectValue placeholder="Select a storage type"></SelectValue>
            </SelectTrigger>
            <SelectContent position="popper">
              <SelectGroup>
                <SelectLabel>Storage types</SelectLabel>
                {storageTypes.map((st) => (
                  <SelectItem key={st.storageTypeId} value={st.storageTypeName}>
                    {st.storageTypeName}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>

          {errors.storageTypeName && (
            <p className="text-primary pt-2 text-sm">
              {errors.storageTypeName}
            </p>
          )}
        </div>

        <p className="text-md pb-4 text-center">
          {!isChecked
            ? "Are you sure you want to update to this storage type?"
            : "Updating..."}
        </p>
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

interface UpdateStorageTypePopupProps {
  item: {
    inventoryId: number;
    storageTypeName: string;
  };
  close: () => void;
}

export default UpdateStorageTypePopup;
