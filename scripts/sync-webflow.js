// Regenerates webflow-cloud/src/components/LeadIntakeForm.jsx from src/app.jsx.
// The two files are identical except for how React is imported and how the
// component is exported, so the root source stays the single source of truth.
const fs = require("fs");
const path = require("path");
const root = path.join(__dirname, "..");
const src = fs.readFileSync(path.join(root, "src/app.jsx"), "utf8");
const lines = src.split("\n");
const first = lines[0].trim();
if (!first.startsWith("const {") || !first.endsWith("} = React;")) throw new Error("Unexpected first line: " + first);
lines[0] = "import React, " + first.replace("const ", "").replace(" = React;", ' from "react";');
const tail = lines.length;
const mountIdx = lines.findIndex((l) => l.includes("ReactDOM.createRoot"));
if (mountIdx < 0) throw new Error("Mount call not found");
const out = lines.slice(0, mountIdx).join("\n").replace(/\s+$/, "") + "\nexport default LeadIntakeForm;\n";
fs.writeFileSync(path.join(root, "webflow-cloud/src/components/LeadIntakeForm.jsx"), out);
console.log("webflow-cloud/src/components/LeadIntakeForm.jsx synced (" + out.split("\n").length + " lines, from " + tail + ")");
