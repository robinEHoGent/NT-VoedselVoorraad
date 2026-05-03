import { useMutation, useQueryClient } from "@tanstack/react-query";
import { DeleteProduct } from "../../Api/apiCallsProducts";
import DeletePopupBase from "./DeletePopupBase";

function DeleteProductPopup({ state, SetState }: DeleteProductProps) {
  const queryclient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (id: number) => DeleteProduct(id),
    onSuccess: () => {
      queryclient.invalidateQueries({ queryKey: ["product"] });
      queryclient.invalidateQueries({ queryKey: ["inventory"] });
    },
  });

  return (
    <DeletePopupBase state={state} SetState={SetState} mutation={mutation} />
  );
}

interface DeleteProductProps {
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

export default DeleteProductPopup;
