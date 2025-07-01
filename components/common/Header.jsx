import { BarChart3, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "../ui/button";

const Header = () => {
  const { theme, setTheme } = useTheme();
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div className="flex items-center space-x-3 sm:space-x-4">
        <div className="w-25 h-25 sm:w-25 sm:h-25 rounded-xl flex items-center justify-center">
          <img src="/Customer_Connect_Logo.png" alt="Logo" className="w-22 h-22 sm:w-22 sm:h-22 object-contain" />
        </div>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100">
            Customer Connect
          </h1>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">
            Social Media Analytics
          </p>
        </div>
      </div>
      <div className="flex items-center space-x-2 sm:space-x-3 w-full sm:w-auto">
        {/* <div className="flex items-center space-x-3">
          <Reanalyze />
        </div> */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        >
          <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </div>
    </div>
  );
};
export default Header;
