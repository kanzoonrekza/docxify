import React from "react";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="h-screen">
      <section className="mx-auto h-full max-w-lg place-content-center">
        <div className="mx-auto text-center text-4xl font-bold">Docxify</div>
        {children}
      </section>
    </div>
  );
}
