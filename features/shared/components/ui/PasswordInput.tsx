"use client";

import { forwardRef, type InputHTMLAttributes } from "react";
import { Eye, EyeOff } from "lucide-react";
import Input from "@/features/shared/components/ui/Input";
import { useToggle } from "@/lib/hooks/useToggle";

interface PasswordInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  id: string;
  label: string;
  error?: string;
}

const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(function PasswordInput({ id, label, ...props }, ref) {
  const { open: visible, toggle } = useToggle();
  return (
    <Input
      ref={ref}
      id={id}
      label={label}
      type={visible ? "text" : "password"}
      trailing={
        <button
          type="button"
          aria-label={visible ? "Sakrij lozinku" : "Prikaži lozinku"}
          onClick={toggle}
          className="text-muted hover:text-foreground grid size-9 place-items-center rounded-full transition-colors"
        >
          {visible ? <EyeOff size={16} aria-hidden="true" /> : <Eye size={16} aria-hidden="true" />}
        </button>
      }
      {...props}
    />
  );
});

export default PasswordInput;
