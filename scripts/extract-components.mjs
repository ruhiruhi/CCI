import fs from "fs";
import path from "path";

const need = [
  "header.tsx",
  "providers.tsx",
  "login-form.tsx",
  "settings-editor.tsx",
  "analytics-charts.tsx",
];

const maps = [];
function walk(dir) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p);
    else if (e.name.endsWith(".map")) maps.push(p);
  }
}
walk(".next");

for (const name of need) {
  for (const m of maps) {
    try {
      const j = JSON.parse(fs.readFileSync(m, "utf8"));
      if (!j.sourcesContent) continue;
      const idx = j.sources.findIndex(
        (s) => s.endsWith(name) && !s.includes("proxy"),
      );-
      if (idx < 0) continue;
      const c = j.sourcesContent[idx];
      if (!c || c.includes("registerClientReference") || c.length < 100)
        continue;
      const out = name.includes("editor")
        ? `src/components/admin/editors/${name}`
        : `src/components/admin/${name}`;
      fs.mkdirSync(path.dirname(out), { recursive: true });
      fs.writeFileSync(out, c);
      console.log("Found", name, "in", m, "len", c.length);
      break;
    } catch {
      /* skip */
    }
  }
}
