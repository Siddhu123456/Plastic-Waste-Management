import { useEffect, useState } from "react";
import { LuMoon, LuSun, LuSunDim } from 'react-icons/lu';


const ThemeToggle = ({theme,setTheme}) => {
  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <button
      onClick={toggleTheme}
      className="flex items-center justify-center cursor-pointer hover:text-lgg"
    >
      {theme === "light" ? <LuMoon className="text-2xl sm:text-xl md:text-2xl" /> : <LuSun className="text-2xl" />}
    </button>
  );
};

export default ThemeToggle;
