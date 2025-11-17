import React from "react";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="h-screen grid place-items-center">
      <div className="text-center gap-20 grid">
        AuthLayout
        {children}
      </div>
    </div>
  );
}
