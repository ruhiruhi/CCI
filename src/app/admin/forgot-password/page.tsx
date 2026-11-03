import Link from "next/link";
import { Film, ArrowLeft } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default function ForgotPasswordPage() {
  return (
    <div className="relative flex min-h-dvh items-center justify-center px-4">
      <div className="relative w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-gold/15 text-gold">
            <Film className="h-7 w-7" />
          </div>
          <h1 className="font-display text-2xl font-medium text-warm">
            Reset Password
          </h1>
          <p className="mt-2 text-sm text-mist">
            Enter your email and we&apos;ll send reset instructions
          </p>
        </div>

        <form className="rounded-2xl border border-warm/10 bg-charcoal/40 p-8 backdrop-blur-sm">
          <div className="space-y-2">
            <Label htmlFor="email">Email address</Label>
            <Input
              id="email"
              type="email"
              placeholder="admin@consciouscinema.in"
              required
            />
          </div>

          <Button type="submit" className="mt-6 h-11 w-full">
            Send reset link
          </Button>

          <Link
            href="/admin/login"
            className="mt-4 flex items-center justify-center gap-2 text-sm text-mist hover:text-gold"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to sign in
          </Link>
        </form>
      </div>
    </div>
  );
}
