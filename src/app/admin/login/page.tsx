import { Suspense } from "react";
import { LoginForm } from "@/components/admin/login-form";

export default function AdminLoginPage() {
  return (
    <Suspense fallback={<div className="grid min-h-dvh place-items-center text-mist">Loading...</div>}>
      <LoginForm />
    </Suspense>
  );
}
