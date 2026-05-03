import NavHome from "./NavHome";
import NavRecipeBook from "./NavRecipeBook";
import NavShoppingList from "./NavShoppingList";
import NavInventory from "./NavInventory";

//* navbar = adjust the values inside the [] for custom sizes ( px, rem, em, % )

function Header() {
  return (
    <nav
      className={`bg-customWhite fixed bottom-6 left-1/2 z-50 flex h-[75px] w-[350px] -translate-x-1/2 items-center justify-around rounded-4xl shadow-sm md:w-[650px] lg:w-[850px]`}
    >
      <NavHome />
      <NavRecipeBook />
      <NavShoppingList />
      <NavInventory />
    </nav>
  );
}

export default Header;
