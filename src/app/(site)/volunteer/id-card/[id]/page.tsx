import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { VolunteerIdCard } from "@/components/volunteer/volunteer-id-card";
import { getVolunteerById } from "@/lib/volunteer-service";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const volunteer = await getVolunteerById(id).catch(() => null);
  if (!volunteer) return { title: "Volunteer ID Card" };
  return {
    title: `${volunteer.volunteerId} — Digital Volunteer ID`,
    robots: { index: false, follow: false },
  };
}

export default async function VolunteerIdCardPage({ params }: Props) {
  const { id } = await params;
  const volunteer = await getVolunteerById(id).catch(() => null);
  if (!volunteer) notFound();

  return (
    <section className="section-pad">
      <div className="shell">
        <VolunteerIdCard
          volunteer={{
            id: volunteer.id,
            volunteerId: volunteer.volunteerId,
            name: volunteer.name,
            email: volunteer.email,
            phone: volunteer.phone,
            status: volunteer.status,
            joinedAt: volunteer.joinedAt,
            profilePhoto: volunteer.profilePhoto,
          }}
        />
      </div>
    </section>
  );
}
