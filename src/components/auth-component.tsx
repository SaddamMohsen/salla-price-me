"use client";
import { signIn, signOut } from "next-auth/react";
import { Button } from "./ui/button";

export function SignIn({
  provider,
  ...props
}: { provider?: string } & React.ComponentPropsWithRef<typeof Button>) {
  return (
    <form
      action={async () => {
        await signIn("salla");
      }}>
      <Button {...props}>Sign In</Button>
    </form>
  );
}

export function SignOut(props: React.ComponentPropsWithRef<typeof Button>) {
  return (
    <form
      action={async () => {
        await signOut();
      }}
      className="w-full">
      <Button variant="ghost" className="w-full p-0" {...props}>
        Sign Out
      </Button>
    </form>
  );
}
