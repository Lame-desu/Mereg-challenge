// Small helpers related to files. Kept for testability and extension.
import fs from "fs";

export function fileExists(path: string): boolean {
  try {
    return fs.existsSync(path);
  } catch (_e) {
    return false;
  }
}
