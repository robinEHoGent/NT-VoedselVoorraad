import { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import emailjs from "@emailjs/browser";

type Props = {
  items: ShoppingListItem[];
  onClose: () => void;
};
// Validatie schema met Yup
const validationSchema = Yup.object({
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
});
const SendMailPopup = ({ items, onClose }: Props) => {
  const [sending, setSending] = useState(false);
  const formik = useFormik({
    initialValues: {
      email: "",
    },
    validationSchema,
    onSubmit: (values) => {
      if (items.length === 0) return;
      setSending(true);
      const itemList = items
        .map(
          (item) =>
            `${item.product.productName} (${item.amount} ${item.product.uomName})`,
        )
        .join("\n");
      const templateParams = {
        to_email: values.email,
        shoppinglist: itemList,
      };

      console.log(
        "Sending email to:",
        templateParams.to_email,
        "with items:",
        templateParams.shoppinglist,
      );
      emailjs
        .send(
          "service_6obdwrn",
          "template_i9ejalw",
          templateParams,
          "Uw2Phbn0fJEEnc4Aj",
        )
        .then(
          () => {
            alert("Email sent successfully!");
            setSending(false);
            onClose();
          },
          () => {
            alert("Failed to send email. Please try again.");
            setSending(false);
          },
        );
    },
  });
  return (
    <div className="bg-bg border-secondary fixed top-1/2 left-1/2 z-50 flex w-2/3 max-w-xl -translate-1/2 flex-col rounded-2xl border-2 px-4 py-4 text-left shadow-md md:w-1/2">
      <h3 className="mb-2 text-xl">Send shopping list</h3>
      {items.length === 0 ? (
        <p className="text-sm text-gray-500">No checked items.</p>
      ) : (
        <ul className="mb-3 max-h-40 overflow-auto">
          {items.map((item) => (
            <li key={item.id}>
              • {item.product.productName} ({item.amount} {item.product.uomName}
              )
            </li>
          ))}
        </ul>
      )}
      <form onSubmit={formik.handleSubmit} className="flex flex-col gap-2">
        <input
          type="email"
          name="email"
          placeholder="Email address"
          value={formik.values.email}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          className="mb-1 w-full rounded border px-2 py-1"
        />
        {formik.touched.email && formik.errors.email && (
          <p className="text-sm text-red-500">{formik.errors.email}</p>
        )}
        <div className="mt-2 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="bg-primary rounded px-3 py-1"
            disabled={sending}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={sending || items.length === 0 || !!formik.errors.email}
            className="bg-tertiary rounded px-3 py-1 disabled:opacity-50"
          >
            {sending ? "Sending..." : "Send"}
          </button>
        </div>
      </form>
    </div>
  );
};
export default SendMailPopup;
