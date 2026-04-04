import { Link } from "react-router-dom";
import { AppRoute } from "@/routes";
import { useAppDispatch, useAppSelector } from "@/application/store";
import { resetProfile } from "@/application/state-slices";
import { useAppRouter } from "@/infrastructure/hooks/useAppRouter";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";

export function Navbar() {
  const { loggedIn } = useAppSelector((x) => x.profileReducer);
  const dispatch = useAppDispatch();
  const { redirectToHome } = useAppRouter();

  const logout = () => {
    dispatch(resetProfile());
    redirectToHome();
  };

  return (
    <div className="w-full border-b">
      <div className="mx-auto max-w-7xl px-4">
        <NavigationMenu className="h-14">
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link to={AppRoute.Index} className={navigationMenuTriggerStyle()}>
                  DevLink
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>

            {loggedIn && (
              <>
                <NavigationMenuItem>
                  <NavigationMenuLink asChild>
                    <Link to={AppRoute.Feed} className={navigationMenuTriggerStyle()}>
                      Feed
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuLink asChild>
                    <Link to={AppRoute.Jobs} className={navigationMenuTriggerStyle()}>
                      Jobs
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuLink asChild>
                    <Link to={AppRoute.Applications} className={navigationMenuTriggerStyle()}>
                      Applications
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuLink asChild>
                    <Link to={AppRoute.Feedback} className={navigationMenuTriggerStyle()}>
                      Feedback
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              </>
            )}

            <NavigationMenuItem className="ml-auto">
              {!loggedIn ? (
                <NavigationMenuLink asChild>
                  <Link to={AppRoute.Login} className={navigationMenuTriggerStyle()}>
                    Login
                  </Link>
                </NavigationMenuLink>
              ) : (
                <button
                  onClick={logout}
                  className={navigationMenuTriggerStyle()}
                >
                  Logout
                </button>
              )}
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>
    </div>
  );
}
