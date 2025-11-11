import fs from "fs";
import path from "path";

const OUTPUT_FILE = "DIRECTORY.md";
const ROOTS = ["backend", "frontend"]; // Folders to include
const IGNORE_DIRS = ["node_modules", "build", "dist", "target", ".git"]; // ignored
const INDENT = "  ";

function generateTree(dir, prefix = "") {
  let tree = "";
  const entries = fs
    .readdirSync(dir, { withFileTypes: true })
    .filter((entry) => !IGNORE_DIRS.includes(entry.name))
    .sort((a, b) => {
      // Directories first, then files alphabetically
      if (a.isDirectory() && !b.isDirectory()) return -1;
      if (!a.isDirectory() && b.isDirectory()) return 1;
      return a.name.localeCompare(b.name);
    });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    tree += `${prefix}${entry.isDirectory() ? "📂" : "📄"} ${entry.name}\n`;
    if (entry.isDirectory()) {
      tree += generateTree(fullPath, prefix + INDENT);
    }
  }

  return tree;
}

let output = "# 📁 Project Directory\n\n";

for (const root of ROOTS) {
  if (fs.existsSync(root)) {
    output += `## ${root}\n\n`;
    output += "```\n";
    output += generateTree(root);
    output += "```\n\n";
  } else {
    console.warn(`⚠️ Folder "${root}" not found — skipping.`);
  }
}

fs.writeFileSync(OUTPUT_FILE, output, "utf-8");
console.log(`✅ ${OUTPUT_FILE} updated successfully.`);
