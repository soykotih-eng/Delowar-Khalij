import "server-only";
import sharp, { type OutputInfo } from "sharp";
import { exec } from "./db";

const MAX_UPLOAD = 15 * 1024 * 1024;

/**
 * Stores an uploaded photo in the database (Hostinger replaces the app folder on every deploy, so
 * files written to disk would be lost). Photos are auto-rotated, resized to max 1600 px and saved as WebP.
 */
export async function storeImage(file: File) {
  if (!file || file.size === 0) throw new Error("Please choose a photo.");
  if (file.size > MAX_UPLOAD) throw new Error("Photo is too large (max 15 MB).");
  if (!file.type.startsWith("image/")) throw new Error("Please upload an image file (JPG, PNG or WebP).");

  let output: { data: Buffer; info: OutputInfo };
  try {
    output = await sharp(Buffer.from(await file.arrayBuffer()))
      .rotate()
      .resize({ width: 1600, height: 1600, fit: "inside", withoutEnlargement: true })
      .webp({ quality: 82 })
      .toBuffer({ resolveWithObject: true });
  } catch {
    throw new Error("This photo format is not supported. Please upload JPG, PNG or WebP.");
  }

  const result = await exec("INSERT INTO media (mime, width, height, data) VALUES (?, ?, ?, ?)", [
    "image/webp",
    output.info.width,
    output.info.height,
    output.data,
  ]);
  return { url: `/media/${result.insertId}`, w: output.info.width, h: output.info.height };
}

/** Deletes an uploaded photo (starter photos under /images are left alone). */
export async function deleteImage(url: string) {
  const match = /^\/media\/(\d+)$/.exec(url);
  if (match) await exec("DELETE FROM media WHERE id = ?", [Number(match[1])]);
}
