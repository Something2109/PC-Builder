import "../public/stylesheets/globals.css";
import Header from "@/layout/header";
import { ThemeBody } from "@/layout/body";
import Footer from "@/layout/footer";
import { AuthWrapper } from "@/features/auth";
import { verifyToken } from "@/features/auth/server";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await verifyToken();

  return (
    <html lang="en">
      <AuthWrapper user={user}>
        <ThemeBody>
          <Header />
          <main className="container w-11/12 min-h-screen mx-auto *:my-2">
            {children}
          </main>
          <Footer />
        </ThemeBody>
      </AuthWrapper>
    </html>
  );
}
