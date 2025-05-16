import { ThemeProvider } from "@/components/shared/ThemeProvider";
import ErrorModal from "@/components/shared/ErrorModal";
import ConditionalFooter from "@/components/shared/ConditionalFooter";
import CookieConsent from "@/components/shared/CookieConsent";
import "./globals.css";

export const metadata = {
  title: "IQ Test App",
  description: "An interactive IQ test experience",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="overflow-x-hidden">
        <ThemeProvider>
          <div className="min-h-screen overflow-x-hidden flex flex-col">
            <main className="flex-grow">
              {children}
            </main>
            <ConditionalFooter />
          </div>
          <ErrorModal />
          <CookieConsent />
        </ThemeProvider>
      </body>
    </html>
  );
}
