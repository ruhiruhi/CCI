from pathlib import Path

root = Path(r"C:\Users\Asus\OneDrive\Desktop\Workspase\CCII\src")
files = [
    root / "app/(site)/our-activities/page.tsx",
    root / "app/(site)/our-activities/[slug]/page.tsx",
    root / "components/volunteer/volunteer-id-card.tsx",
    root / "lib/volunteer.ts",
    root / "app/(site)/catalogue/page.tsx",
    root / "components/catalogue/catalogue-hero.tsx",
    root / "components/sections/cta-band.tsx",
    root / "components/home/hero.tsx",
    root / "lib/cms.ts",
]

for f in files:
    if not f.exists():
        print("missing", f)
        continue
    t = f.read_text(encoding="utf-8")
    n = t
    n = n.replace("consciouscinema.in", "consciouscine.org")
    n = n.replace("consciouscinema.org", "consciouscine.org")
    n = n.replace("www.consciouscine.org", "consciouscine.org")
    n = n.replace("?intent=screening", "?interest=Screening%20Request")
    n = n.replace("?intent=partner", "?interest=Partnership")
    if f.name == "cta-band.tsx":
        n = n.replace(
            'primary = { label: "Join the movement", href: "/support" }',
            'primary = { label: "Join the movement", href: "/join" }',
        )
    if f.name == "hero.tsx":
        n = n.replace('href: "/support"', 'href: "/join"')
    if f.name == "cms.ts":
        n = n.replace('href: "/support"', 'href: "/join"')
    if n != t:
        f.write_text(n, encoding="utf-8")
        print("updated", f)
    else:
        print("noop", f)
