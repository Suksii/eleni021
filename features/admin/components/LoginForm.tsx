"use client";

import { useActionState } from "react";
import { LogIn } from "lucide-react";
import Button from "@/features/shared/components/ui/Button";
import Input from "@/features/shared/components/ui/Input";
import PasswordInput from "@/features/shared/components/ui/PasswordInput";
import FormAlert from "@/features/shared/components/ui/FormAlert";
import { login, type LoginState } from "@/features/admin/actions/auth";

export default function LoginForm({ next }: { next?: string }) {
  const [state, action, pending] = useActionState<LoginState, FormData>(
    login,
    {},
  );
  return (
    <form action={action} className="space-y-4">
      {next && <input type="hidden" name="next" value={next} />}
      <Input
        id="email"
        name="email"
        type="email"
        label="Email"
        required
        autoComplete="username"
        autoFocus
      />
      <PasswordInput
        id="password"
        name="password"
        label="Lozinka"
        required
        autoComplete="current-password"
      />
      {state.error && <FormAlert>{state.error}</FormAlert>}
      <Button type="submit" size="lg" fullWidth loading={pending}>
        <LogIn size={17} aria-hidden="true" /> Prijavi se
      </Button>
    </form>
  );
}
