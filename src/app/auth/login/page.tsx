"use client";

import { useActionState } from "react";
import { loginAction } from "./action";

export default function LoginPage() {
  const [state, formAction, isPending] = useActionState(loginAction, {});
  return (
    <>
      <form action={formAction} className="grid gap-2">
        <input
          className="p-2 bg-slate-800"
          type="text"
          name="username"
          defaultValue={state?.data?.username || ""}
        />
        <input
          className="p-2 bg-slate-800"
          type="email"
          name="email"
          defaultValue={state?.data?.email || ""}
        />
        <button type="submit">Login</button>
        {!isPending && <aside>{state?.data?.username}</aside>}
        {isPending && <aside>Loading</aside>}
        {!isPending && !state.success && <aside>{state.error}</aside>}
      </form>
    </>
  );
}
