import { useMutation, useQueryClient } from "@tanstack/react-query"; //post put delete
import { DeleteShoppingListItem } from "@/Api/apiCallsShoppingList";
import DeletePopupBase from "./DeletePopupBase";

function DeleteShoppingListItemPopup({
  state,
  SetState,
  onDelete,
}: DeleteItemProps) {
  const queryclient = useQueryClient(); //query cache

  const mutation = useMutation({
    mutationFn: (id: number) => DeleteShoppingListItem(id),
    onSuccess: () => {
      queryclient.invalidateQueries({ queryKey: ["shoppinglist"] });
      if (onDelete) onDelete();
    },
  });
  return (
    <DeletePopupBase state={state} SetState={SetState} mutation={mutation} />
  );
}

interface DeleteItemProps {
  state: {
    bool: boolean;
    id: number | undefined;
    productName: string;
  };
  SetState: React.Dispatch<
    React.SetStateAction<{
      bool: boolean;
      id: number | undefined;
      productName: string;
    }>
  >;
  onDelete?: () => void;
}

export default DeleteShoppingListItemPopup;
