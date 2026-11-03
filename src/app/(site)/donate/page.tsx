import type { Metadata } from "next";
import Link from "next/link";
import { Heart } from "lucide-react";
import { LOCAL_IMAGES } from "@/lib/data";
import { PageHero } from "@/components/sections/page-hero";
import { Reveal } from "@/components/motion/reveal";
import { CtaBand } from "@/components/sections/cta-band";

export const metadata: Metadata = {
  title: "Direct Contribution",
  description:
    "Make an unrestricted contribution to sustain CCI’s vision of a more conscious society through cinema.",
};

export default function DonatePage() {
  return (
    <>
      <PageHero
        kicker="Direct Contribution"
        titleLines={["Support the mission", "beyond a single cause."]}
        goldLineIndex={1}
        intro="If you'd prefer a general financial contribution, it helps sustain every initiative that advances CCI's vision of a more conscious society through cinema."
        image={LOCAL_IMAGES.heroScreening}
      />

      <section className="section-pad">
        <div className="shell max-w-3xl">
          <Reveal>
            <div className="card-modern p-8 text-center md:p-12">
              <span className="mx-auto grid h-14 w-14 place-items-center rounded-full border border-gold/40 text-gold">
                <Heart className="h-6 w-6" />
              </span>
              <h2 className="mt-6 font-display text-3xl font-light text-warm">
                Unrestricted donation
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-cloud/80">
                {/* TODO: Connect Razorpay / Stripe when PAYMENT_GATEWAY_KEY is configured */}
                Online payment checkout will appear here once the payment gateway
                is connected. Until then, write to us and we will share secure
                transfer details.
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-4">
                <a
                  href="mailto:hello@consciouscine.org?subject=Direct%20Contribution"
                  className="btn-cci-primary inline-flex h-12 items-center px-7 text-sm"
                  data-cursor="hover"
                >
                  Email to contribute
                </a>
                <Link
                  href="/support"
                  className="btn-cci-secondary inline-flex h-12 items-center px-7 text-sm"
                  data-cursor="hover"
                >
                  Back to Support
                </Link>
              </div>
              <p className="mt-6 text-xs text-mist">
                Env: <code>RAZORPAY_KEY_ID</code> / <code>STRIPE_SECRET_KEY</code>{" "}
                (optional)
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      <CtaBand
        primary={{ label: "Join CCI", href: "/join" }}
        secondary={{ label: "Transparency Report", href: "/transparency" }}
        image={LOCAL_IMAGES.editingSession}
      />
    </>
  );
}
