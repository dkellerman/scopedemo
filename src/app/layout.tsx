import type { Metadata } from "next";
import { Geist } from "next/font/google";
import Link from "next/link";
import clsx from "clsx";
import LogoutLink from "@/components/LogoutLink";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "David Kellerman | Scope Labs Exercise",
  description: "Scope Labs video exercise by David Kellerman",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} antialiased`}>
        <header className="sticky top-0 bg-white z-10">
          <nav className="shadow-md w-full">
            <div
              className={clsx(
                "relative flex flex-col w-full px-6 py-4 md:flex-row",
                "md:items-center md:gap-4",
              )}
            >
              <Link href="/" className="text-2xl font-bold tracking-tight">
                Scope Labs Exercise
              </Link>
              <span className="text-gray-500">by David Kellerman</span>
              <div className="flex-1" />
              <div className="absolute right-6 top-4 md:static md:right-auto md:top-auto">
                <LogoutLink />
              </div>
            </div>
          </nav>
        </header>
        <main className="py-10 px-6">{children}</main>
      </body>
    </html>
  );
}
