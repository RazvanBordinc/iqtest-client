import "./globals.css";
import { ThemeProvider } from "@/components/shared/ThemeProvider";

export const metadata = {
  title: "IQ Test App",
  description: "An interactive IQ test experience",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
