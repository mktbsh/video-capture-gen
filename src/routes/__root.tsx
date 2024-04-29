import { NavBar } from "@/components/navbar";
import { APP_NAME } from "@/const/site";
import { createRootRoute, Link, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";

import logo from '/camera.svg';

export const Route = createRootRoute({
  component: () => (
    <main className="flex w-full h-full overflow-hidden">
      <aside className="w-64 h-full bg-gray-100/40 border-r">
        <nav className="border-b h-16 w-full flex items-center px-4">
          <Link to="/" className="flex gap-2 items-center">
            <img src={logo} decoding="async" className="size-6" />
            <span className="font-bold">{APP_NAME}</span>
          </Link>
        </nav>
        <NavBar/>
      </aside>
      <div className="flex-1">
        <Outlet />
        <TanStackRouterDevtools />
      </div>
    </main>
  ),
});
