import type { Metadata } from "next";
import { LOCAL_IMAGES } from "@/lib/data";
import { PageHero } from "@/components/sections/page-hero";
import { ContactForm } from "@/components/contact/contact-form";
import { Reveal } from "@/components/motion/reveal";
import { SectionLayout } from "@/components/sections/section-layout";

export const metadata: Metadata = {
  title: "Join CCI",
  description:
    "Apply to join the Conscious Cinema Initiative as a volunteer, member, partner, or collaborator.",
};

export default async function JoinPage({
  searchParams,
}: {
  searchParams: Promise<{ interest?: string | string[] }>;
}) {
  const params = await searchParams;
  const interest =
    typeof params.interest === "string"
      ? params.interest
      : Array.isArray(params.interest)
        ? params.interest[0]
        : "Join the Movement";

  return (
    <>
      <PageHero
        kicker="Join CCI"
        titleLines={["Become part of", "the movement."]}
        goldLineIndex={1}
        intro="Submit your Join CCI application. After review and approval, members receive a digital ID card by email and appear in the community directory."
        image={LOCAL_IMAGES.heroScreening}
      />

      <section className="section-pad">
        <div className="shell">
          <SectionLayout
            media={
              <ContactForm initialInterest={interest} mode="join" />
            }
            mediaClassName="!justify-start lg:!justify-end"
          >
            <Reveal>
              <h2 className="font-display text-3xl font-light text-warm md:text-4xl">
                One form. One community.
              </h2>
              <p className="mt-5 max-w-md text-cloud/80">
                Tell us how you want to take part — volunteering, hosting screenings,
                institutional partnership, or membership. Approved applicants receive
                an email ID card and are added to the community map and member list.
              </p>
              <ol className="mt-8 space-y-3 text-sm text-cloud">
                <li>1. Submit the Join CCI form</li>
                <li>2. Admin reviews your application</li>
                <li>3. On approval, a membership ID is generated</li>
                <li>4. Your ID card is emailed to you</li>
                <li>5. You appear on the Community map & directory</li>
              </ol>
            </Reveal>
          </SectionLayout>
        </div>
      </section>
    </>
  );
}
