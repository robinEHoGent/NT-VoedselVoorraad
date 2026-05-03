import { useTheme } from "../../Hooks/useTheme";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const checked = theme === "dark";

  return (
    <div className="my-2 flex flex-col items-center">
      <span className="text-secondary mb-1 text-sm">
        {checked ? "Dark" : "Light"} mode
      </span>
      <label className="inline-flex cursor-pointer items-center">
        <input
          type="checkbox"
          className="peer sr-only"
          checked={checked}
          onChange={() => setTheme(checked ? "light" : "dark")}
        />

        <div
          className={`peer-checked:bg-customGrayDark after:bg-primary bg-customWhite relative h-6 w-12 rounded-full after:absolute after:top-0.5 after:left-0.5 after:h-5 after:w-5 after:rounded-full after:transition-all after:content-[''] peer-checked:after:translate-x-6`}
        ></div>
      </label>
    </div>
  );
}
