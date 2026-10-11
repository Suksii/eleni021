"use client";

import { useFormStatus } from "react-dom";
import Button from "@/features/shared/components/ui/Button";

export default function SubmitButton({ children, ...props }: React.ComponentProps<typeof Button>) {
  const { pending } = useFormStatus();
  return <Button type="submit" loading={pending} {...props}>{children}</Button>;
}
