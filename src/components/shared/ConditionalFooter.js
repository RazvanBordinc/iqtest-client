"use client";

import { usePathname } from "next/navigation";
import Footer, { MinimalFooter } from "./Footer";

export default function ConditionalFooter() {
  const pathname = usePathname();
  
  // Use minimal footer on test pages
  const isTestPage = pathname?.includes("/tests/start");
  
  if (isTestPage) {
    return (
      <>
        <MinimalFooter />
        {/* Spacer to prevent content overlap */}
        <div className="h-16" />
      </>
    );
  }
  
  return <Footer />;
}