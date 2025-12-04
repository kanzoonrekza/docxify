import Link from "next/link";
import React from "react";

export default function MarketingLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <section className="top-0 sticky">
        <div className="flex px-10 py-5 bg-base-100 justify-between items-center">
          <Link
            style={{ viewTransitionName: "logo" }}
            className="font-black text-lg"
            href="/"
          >
            Docxeaze
          </Link>
          <nav className="">
            <ul className="flex gap-5">
              <li>
                <Link href="/">Home</Link>
              </li>
              <li>
                <Link href="/pricing">Pricing</Link>
              </li>
            </ul>
          </nav>

          <div className="join">
            <Link
              style={{ viewTransitionName: "login-button" }}
              className="btn join-item"
              href="/auth/login"
            >
              Login
            </Link>
            <Link className="btn join-item" href="/signup">
              Signup
            </Link>
          </div>
        </div>
      </section>
      {children}
    </div>
  );
}
