"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Header from "@/components/header";
import NavigationBar from "@/components/navigation";
import "@/css/globals.css";
import Footer from "@/components/footer";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [navbar, setNavbar] = useState(false);
  const [dark, setDark] = useState(true);
  const pathname = usePathname();

  useEffect(() => {
    setNavbar(false); // Close the navigation panel
  }, [pathname]);

  return (
    <html lang="en">
      <body
        className={`${
          dark ? "dark" : ""
        } transition-all ease-in-out duration-500 delay-0 dark:text-line dark:bg-background overflow-y-scroll`}
      >
        <Header
          setNavbar={() => setNavbar(!navbar)}
          setDark={() => setDark(!dark)}
        />
        <NavigationBar toggle={navbar} />
        <main className="container w-11/12 min-h-screen mx-auto *:my-2">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
