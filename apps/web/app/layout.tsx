import type { Metadata } from "next";
import ClickSparkProvider from "@/components/shared/click-spark-provider";
import { Toaster } from "@/components/shared/toaster";
import { AuthProvider } from "@/lib/auth-context";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI Content Agent",
  description: "AI content marketing agent platform"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" className="dark">
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
        />
      </head>
      <body className="font-sans antialiased">
        <AuthProvider>
          <ClickSparkProvider>
            {children}
            <Toaster />
          </ClickSparkProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
