"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { KEY_USERNAME } from "@/constants";
import VideosProvider from "@/components/VideosContext";
import { usePathname } from "next/navigation";

export default function VideosLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [username, setUsername] = useState<string | null>(null);

  // Grab user from session storage otherwise redirect to login
  useEffect(() => {
    // Redirect to login, except for video detail page we will
    // allow anonymous users
    const storedUsername = sessionStorage.getItem(KEY_USERNAME);
    const isVideoDetail = /^\/videos\/[^/]+$/.test(pathname);
    if (!storedUsername && !isVideoDetail) {
      router.push("/");
    } else {
      setUsername(storedUsername ?? "anonymous");
    }
  }, [router, pathname]);

  if (!username) return null;

  return <VideosProvider username={username}>{children}</VideosProvider>;
}
