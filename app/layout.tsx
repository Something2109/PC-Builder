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
  const [toggle, setToggle] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setToggle(false); // Close the navigation panel
  }, [pathname]);

  return (
    <html lang="en">
      <body className="dark:text-line dark:bg-background overflow-y-scroll">
        <Header toggle={() => setToggle(!toggle)} />
        <NavigationBar toggle={toggle} />
        <main className="container w-11/12 min-h-screen mx-auto *:my-2">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
