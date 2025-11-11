import fs from "fs";
import path from "path";

const OUTPUT_FILE = "DIRECTORY.md";
const ROOTS = (process.env.PATHS || "backend,frontend").split(",");
const IGNORE_DIRS = ["node_modules", "build", "dist", "target", ".git"];
const INDENT = "  ";
const INCLUDE_FILES = true;

const ALLOWED_EXTENSIONS = [".java", ".js", ".html", ".css", ".jsx"];

function generateTree(dir, prefix = "") {
  let tree = "";
  const entries = fs
    .readdirSync(dir, { withFileTypes: true })
    .filter((entry) => !IGNORE_DIRS.includes(entry.name))
    .sort((a, b) => {
      if (a.isDirectory() && !b.isDirectory()) return -1;
      if (!a.isDirectory() && b.isDirectory()) return 1;
      return a.name.localeCompare(b.name);
    });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      tree += `${prefix}📂 ${entry.name}/\n`;
      tree += generateTree(fullPath, prefix + INDENT);
    } else if (INCLUDE_FILES) {
      const ext = path.extname(entry.name).toLowerCase();
      if (ALLOWED_EXTENSIONS.includes(ext)) {
        tree += `${prefix}📄 ${entry.name}\n`;
      }
    }
  }

  return tree;
}

let output = "# 📁 Project Directory\n\n";

for (const root of ROOTS) {
  const trimmed = root.trim();
  if (fs.existsSync(trimmed)) {
    output += `## ${trimmed}\n\n`;
    output += "```\n";
    output += generateTree(trimmed);
    output += "```\n\n";
  } else {
    console.warn(`⚠️ Folder "${trimmed}" not found — skipping.`);
  }
}

fs.writeFileSync(OUTPUT_FILE, output, "utf-8");
console.log(`✅ ${OUTPUT_FILE} updated successfully.`);
