"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signIn } from "next-auth/react";
import { HomeIcon } from "@/components/icons/HomeIcon";
import { SearchIcon } from "@/components/icons/SearchIcon";
import { PlusIcon } from "@/components/icons/PlusIcon";
import { UserIcon } from "@/components/icons/UserIcon";

export default function BottomNav() {
  const pathname = usePathname();
  const { data: session } = useSession();

  const handleAuthCheck = (e: React.MouseEvent, href: string) => {
    if (!session && (href === "/create" || href === "/dashboard")) {
      e.preventDefault();
      signIn("google", { callbackUrl: href });
    }
  };

  // Hide on login page if needed, or specific pages? 
  // For now show everywhere.

  const navItems = [
    {
      name: "Timeline",
      href: "/timeline",
      icon: (active: boolean) => (
        <HomeIcon
          className="w-6 h-6"
          strokeWidth={active ? 2 : 1.5}
          fill={active ? "currentColor" : "none"}
        />
      )
    },
    {
      name: "Search",
      href: "/search",
      icon: (active: boolean) => (
        <SearchIcon
          className="w-6 h-6"
          strokeWidth={active ? 2.5 : 1.5}
        />
      )
    },
    {
      name: "Create",
      href: "/create",
      icon: (active: boolean) => (
        <div className={`w-10 h-10 rounded-full flex items-center justify-center -mt-4 shadow-lg transition-transform ${active ? "bg-main scale-110 ring-4 ring-white text-white" : "bg-dark-gray text-white"}`}>
          <PlusIcon className="w-6 h-6" strokeWidth={2.5} />
        </div>
      ),
      isFab: true
    },
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: (active: boolean) => (
        <UserIcon
          className="w-6 h-6"
          strokeWidth={active ? 2 : 1.5}
          fill={active ? "currentColor" : "none"}
        />
      )
    },
  ];

  return (
    <div className="fixed bottom-0 left-0 w-full bg-white/90 backdrop-blur-md border-t border-base-secondary/50 pb-safe z-50">
      <div className="flex justify-around items-center h-16 max-w-lg mx-auto px-2 relative">
        {navItems.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={(e) => handleAuthCheck(e, item.href)}
              className={`flex flex-col items-center justify-center w-full h-full transition-colors ${item.isFab ? "" : (active ? "text-main" : "text-middle-gray hover:text-dark-gray")}`}
            >
              {item.icon(active)}
              {!item.isFab && (
                <span className={`text-[10px] font-bold mt-1 ${active ? "text-main" : "text-middle-gray"}`}>
                  {item.name}
                </span>
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
