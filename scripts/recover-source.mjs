import fs from "fs";
import path from "path";

const maps = [];

function walk(dir) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p);
    else if (
      e.name.endsWith(".map") &&
      (p.includes("admin") ||
        p.includes("auth") ||
        p.includes("middleware") ||
        p.includes("prisma") ||
        p.includes("cms"))
    ) {
      maps.push(p);
    }
  }
}

walk(".next");

const recovered = {};

for (const m of maps) {
  try {
    const j = JSON.parse(fs.readFileSync(m, "utf8"));
    if (!j.sourcesContent) continue;
    j.sources.forEach((s, i) => {
      const c = j.sourcesContent[i];
      if (!c) return;
      const norm = s.replace(/\\/g, "/").replace(/^.*?(src\/)/, "src/");
      if (norm.startsWith("src/") && !norm.includes("node_modules")) {
        recovered[norm] = c;
      }
    });
  } catch {
    /* skip */
  }
}

console.log("Found", Object.keys(recovered).length, "files");
for (const k of Object.keys(recovered).sort()) {
  const out = k.replace(/\//g, path.sep);
  const full = path.join(process.cwd(), out);
  fs.mkdirSync(path.dirname(full), { recursive: true });
  fs.writeFileSync(full, recovered[k]);
  console.log("Wrote", k);
}
