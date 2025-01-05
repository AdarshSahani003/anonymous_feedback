'use client'
import AuthProvider from "@/context/AuthProvider";

export default function layoutSign({
    children,
  }: {
    children: React.ReactNode;
  }) {
    return (
      <html lang="en">
        <body>
        <AuthProvider>{children}</AuthProvider>
        </body>
      </html>
    );
  }