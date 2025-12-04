import Link from "next/link";
import React from "react";

export default function NotFound() {
  return (
    <div className="w-screen h-screen grid place-items-center">
      <div className="grid place-items-center gap-3">
        Your destination is no where to be found 🤔
        <Link className="btn" href={"/"}>
          Go to Homepage
        </Link>
      </div>
    </div>
  );
}
