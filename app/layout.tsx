import "@/css/globals.css";
import Header from "@/components/header";
import { ThemeBody } from "@/components/body";
import Footer from "@/components/footer";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <ThemeBody>
        <Header />
        <main className="container w-11/12 min-h-screen mx-auto *:my-2">
          {children}
        </main>
        <Footer />
      </ThemeBody>
    </html>
  );
}
