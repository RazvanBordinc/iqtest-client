import { ThemeProvider } from "@/components/shared/ThemeProvider";
import ErrorModal from "@/components/shared/ErrorModal";
import ConditionalFooter from "@/components/shared/ConditionalFooter";
import CookieConsent from "@/components/shared/CookieConsent";
import BackendStatusModal from "@/components/shared/BackendStatusModal";
import Favicon from "@/components/shared/Favicon";
import "./globals.css";

export const metadata = {
  title: {
    default: "IQ Test App | Test Your Intelligence",
    template: "%s | IQ Test App",
  },
  description:
    "Measure your intelligence with our comprehensive IQ test. Take tests for numerical reasoning, verbal intelligence, memory, and more.",
  keywords: [
    "IQ test",
    "intelligence test",
    "cognitive assessment",
    "numerical reasoning",
    "verbal intelligence",
    "memory test",
  ],
  authors: [{ name: "IQ Test Team" }],
  creator: "IQ Test App",
  publisher: "IQ Test App",
  formatDetection: {
    email: false,
    telephone: false,
    address: false,
  },
  metadataBase: new URL("https://iqtest-app.vercel.app"),
  openGraph: {
    title: "IQ Test App | Test Your Intelligence",
    description:
      "Measure your intelligence with our comprehensive IQ test suite featuring numerical, verbal, and memory assessments.",
    url: "https://iqtest-app.vercel.app",
    siteName: "IQ Test App",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "IQ Test App | Test Your Intelligence",
    description:
      "Measure your intelligence with our comprehensive IQ test suite.",
  },
  icons: {
    icon: "favicon.ico",
    shortcut: "favicon.ico",
    apple: "favicon.ico",
  },
  robots: {
    index: true,
    follow: true,
  },
  manifest: "/manifest.json",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Standard favicon */}
        <link rel="icon" href="/favicon.ico" />
        <link rel="shortcut icon" href="/favicon.ico" />
        
        {/* iOS icons */}
        <link rel="apple-touch-icon" href="/favicon.ico" />
        
        {/* Web manifest */}
        <link rel="manifest" href="/site.webmanifest" />
        
        {/* Theme color */}
        <meta name="theme-color" content="#6366f1" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="#6366f1" />
        
        {/* For IE */}
        <meta name="msapplication-TileImage" content="/favicon.ico" />
        <meta name="msapplication-TileColor" content="#6366f1" />
      </head>
      <body className="overflow-x-hidden">
        <ThemeProvider>
          <Favicon />
          <div className="min-h-screen overflow-x-hidden flex flex-col">
            <main className="flex-grow">{children}</main>
            <ConditionalFooter />
          </div>
          <ErrorModal />
          <CookieConsent />
          <BackendStatusModal />
        </ThemeProvider>
      </body>
    </html>
  );
}
