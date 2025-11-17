"use client";

import { useActionState } from "react";
import { loginAction } from "./action";

export default function LoginPage() {
  const [state, formAction, isPending] = useActionState(loginAction, {});
  return (
    <>
      <div className="mb-4 text-center text-2xl font-medium">Login</div>
      <form action={formAction} className="grid gap-4">
        <div>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            name="email"
            className="input w-full"
            type="email"
            defaultValue={state?.data?.email || ""}
          />
        </div>
        <div>
          <label htmlFor="username">Username</label>
          <input
            id="username"
            name="username"
            className="input w-full"
            type="text"
            defaultValue={state?.data?.username || ""}
          />
        </div>
        <button className="btn mt-4" type="submit" disabled={isPending}>
          Login
        </button>
        {!isPending && <aside>{state?.data?.username}</aside>}
        {isPending && <aside>Loading</aside>}
        {!isPending && !state.success && <aside>{state.error}</aside>}
      </form>
    </>
  );
}
