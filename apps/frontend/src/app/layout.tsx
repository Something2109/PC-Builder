import { Inter, Outfit } from "next/font/google";

import { AuthWrapper } from "@/features/auth";
import { verifyToken } from "@/features/auth/server";
import { ThemeBody } from "@/layout/body";
import Footer from "@/layout/footer";
import Header from "@/layout/header";
import QueryProvider from "@/layout/QueryProvider";

import "../../public/stylesheets/globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await verifyToken();

  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable}`}>
      <QueryProvider>
        <AuthWrapper user={user}>
          <ThemeBody>
            <Header />
            <main className="container w-11/12 min-h-screen mx-auto *:my-4">{children}</main>
            <Footer />
          </ThemeBody>
        </AuthWrapper>
      </QueryProvider>
    </html>
  );
}
