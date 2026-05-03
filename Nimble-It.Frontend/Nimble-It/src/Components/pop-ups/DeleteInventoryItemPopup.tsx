import { useMutation, useQueryClient } from "@tanstack/react-query";
import { DeleteInventoryItem } from "@/Api/apiCallsInventory";
import DeletePopupBase from "./DeletePopupBase";

function DeleteInventoryItemPopup({ state, SetState }: DeleteItemProps) {
  const queryclient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (id: number) => DeleteInventoryItem(id),
    onSuccess: () => {
      queryclient.invalidateQueries({ queryKey: ["inventory"] });
    },
  });
  console.log(state.id);
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
}

export default DeleteInventoryItemPopup;
