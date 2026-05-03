import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import HomePage from "./Pages/HomePage.tsx";
import AppLayout from "./UI/AppLayout.tsx";
import RecipeBookPage from "./Pages/RecipeBookPage.tsx";
import ShoppingListPage from "./Pages/ShoppingListPage.tsx";
import InventoryPage from "./Pages/InventoryPage.tsx";
import ManageProductPage from "./Pages/ManageProductPage.tsx";
import NotFound from "./UI/NotFound.tsx";
import InventoryExpiresSoon from "./Pages/InventoryExpiresSoon.tsx";
import RecipeFullPage from "./Components/recipeBook/RecipeFullPage.tsx";
import CreateRecipePage from "./Components/recipeBook/CreateRecipePage.tsx";
import RecipeFilterProvider from "./Context/recipeFilterOptions/RecipeFilterProvider.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    children: [
      {
        path: "/",
        element: <HomePage />,
      },
      {
        path: "/recipe-book",
        element: <RecipeBookPage />,
      },
      {
        path: "/shopping-list",
        element: <ShoppingListPage />,
      },
      {
        path: "/inventory",
        element: <InventoryPage />,
      },
      {
        path: "/manage-products",
        element: <ManageProductPage />,
      },
      {
        path: "/expires-soon",
        element: <InventoryExpiresSoon />,
      },
      {
        path: "/recipe/:id",
        element: <RecipeFullPage />,
      },
      {
        path: "/recipe/create",
        element: <CreateRecipePage />,
      },
      {
        path: "/recipe/:id/edit",
        element: <CreateRecipePage />,
      },
      {
        path: "*", // try to keep this as the last path, this will catch every path
        element: <NotFound />,
      },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RecipeFilterProvider>
      <RouterProvider router={router} />
    </RecipeFilterProvider>
  </StrictMode>,
);
