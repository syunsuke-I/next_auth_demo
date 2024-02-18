"use client";

import Link from "next/link";
import React from "react";
import { usePathname } from "next/navigation";

const links = [
  { name: "Home", href: "/" },
  { name: "Server", href: "/server" },
  { name: "Client", href: "/client" },
];

export const Sidenav = () => {
  const pathname = usePathname();
  return (
    <div className="w-48 space-y-1">
      {links.map((link) => {
        // トップページの場合は厳密にパスをチェック
        const regex =
          link.href === "/"
            ? new RegExp(`^${link.href}$`)
            : new RegExp(`^${link.href}`);

        const isActive = regex.test(pathname);
        return (
          <Link
            className={`flex items-center h-12 py-2 px-4 space-x-2 rounded ${
              isActive ? "bg-gray-100" : "hover:underline"
            }`}
            key={link.name}
            href={link.href}
          >
            <p>{link.name}</p>
          </Link>
        );
      })}
    </div>
  );
};
