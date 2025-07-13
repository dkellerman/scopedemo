"use client";
import { KEY_USERNAME } from "@/constants";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function LogoutLink() {
  const [show, setShow] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window === "undefined") setShow(false);
    else if (!sessionStorage.getItem(KEY_USERNAME)) setShow(false);
    else if (pathname === "/") setShow(false);
    else setShow(true);
  }, [pathname]);

  if (!show) return null;

  return (
    <button
      onClick={() => {
        sessionStorage.clear();
        location.href = "/";
      }}
      className="text-blue-600 hover:cursor-pointer"
    >
      Log out
    </button>
  );
}
