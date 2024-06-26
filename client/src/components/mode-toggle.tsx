import { Icons } from "@/components/Icons";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/theme-provider";

const ModeToggle = () => {
  const { theme, setTheme } = useTheme();
  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <Button variant="btn" onClick={toggleTheme} title="Modifier le thème">
      {theme === "light" ? (
        <Icons.sun />
      ) : (
        <Icons.moon/>
      )}
      <span className="sr-only">
        {theme === "light" ? "Passer en mode sombre" : "Passer en mode clair"}
      </span>
    </Button>
  );
};

export default ModeToggle;
