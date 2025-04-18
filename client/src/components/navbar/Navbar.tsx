import { Link } from "react-router-dom";
import { useUserStore } from "@/store/user.store";
import { Icons } from "@/components/Icons";
import DropDown from "@/components/navbar/DropDown";
import ModeToggle from "@/components/mode-toggle";
import { SheetLeft } from "@/components/sheet/sheet-left";
import { SheetRight } from "@/components/sheet/sheet-right";
import useWindowWidth from "@/hooks/window-width";
import useGetUser from "@/hooks/get-user";
import { getUserId } from "@/utils/get-userId";

const Navbar = () => {
  const isConnected = useUserStore((state) => state.token) ? true : false;
  const windowWidth = useWindowWidth();
  const isMobileView = windowWidth < 1024;
  const userId = getUserId();
  const { data: currentUser } = useGetUser(userId);

  return (
    <nav className="bg-primary flex items-center justify-between h-24 px-2 dark:bg-primary-foreground md:px-10">
      <h1 className="font-bold text-xl lg:text-3xl text-primary-foreground dark:text-secondary-foreground ">
        <Link
          to="/chateo"
          title="Accueil"
          className="flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-md ring-offset-background p-1 md-p2"
        >
          <Icons.logo width="26" height="26" />
          Chateo
        </Link>
      </h1>

      <div className="flex items-center gap-2 md:gap-5">
        {isMobileView && isConnected && (
          <>
            <SheetLeft currentUser={currentUser} />
            <SheetRight />
          </>
        )}
        {isConnected ? (
          <DropDown />
        ) : (
          <Link to="chateo/login" className="link-nav" title="Se connecter">
            <Icons.login />
            <span className="hidden-text">Se connecter</span>
          </Link>
        )}
        <ModeToggle />
      </div>
    </nav>
  );
};

export default Navbar;
