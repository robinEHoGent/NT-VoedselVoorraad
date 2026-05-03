function SearchButton({ search, setSearch }: SearchButtonProps) {
  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  return (
    <input
      value={search}
      onChange={handleInput}
      className="bg-bg col-start-1 grid w-full place-self-center rounded-[9999px] p-4 shadow-md outline-0"
      placeholder="Search..."
    />
  );
}

interface SearchButtonProps {
  search: string;
  setSearch: React.Dispatch<React.SetStateAction<string>>;
}

export default SearchButton;
