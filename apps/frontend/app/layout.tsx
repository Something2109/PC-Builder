import "@/css/globals.css";
import Header from "@/components/header";
import { ThemeBody } from "@/components/body";
import Footer from "@/components/footer";
import { AuthWrapper } from "@/components/auth";
import { verifyToken } from "@/components/auth-server";

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
