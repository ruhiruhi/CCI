"use client";

import dynamic from "next/dynamic";

const FindOurCommunityInner = dynamic(
  () =>
    import("@/components/community/find-our-community").then(
      (m) => m.FindOurCommunity,
    ),
  {
    ssr: false,
    loading: () => (
      <section className="section-pad">
        <div className="shell">
          <div className="mx-auto h-24 max-w-xl animate-pulse rounded-2xl bg-warm/5" />
          <div className="mt-10 h-[500px] animate-pulse rounded-[20px] border border-warm/10 bg-charcoal/40 md:h-[600px] lg:h-[700px]" />
        </div>
      </section>
    ),
  },
);

export function FindOurCommunitySection() {
  return <FindOurCommunityInner />;
}
