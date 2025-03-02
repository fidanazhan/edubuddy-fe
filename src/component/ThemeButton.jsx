import { useTheme } from "../context/ThemeContext";
import { Moon, Sun } from "lucide-react"; // Icons for dark and light modes

const ThemeToggleButton = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-full bg-gray-200 dark:bg-gray-700"
    >
      {theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
    </button>
  );
};

export default ThemeToggleButton;
