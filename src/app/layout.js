import { ThemeProvider } from "@/components/shared/ThemeProvider";
import ErrorModal from "@/components/shared/ErrorModal";
import "./globals.css";

export const metadata = {
  title: "IQ Test App",
  description: "An interactive IQ test experience",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider>
          {children}
          <ErrorModal />
        </ThemeProvider>
      </body>
    </html>
  );
}
