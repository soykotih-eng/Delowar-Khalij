// Generates the website QR code files in public/brand/ (run: npm run qr [url]).
//   qr-code.png  – 1200 px, navy, with the company emblem in the centre
//   qr-code.svg  – vector version for printers
//   qr-card.png  – printable card (logo, bilingual call to action, QR, URL)
import fs from "node:fs/promises";
import path from "node:path";
import QRCode from "qrcode";
import sharp from "sharp";

const url = process.argv[2] || "https://delowaralkhalij.net";
const out = path.join(process.cwd(), "public", "brand");
const NAVY = "#0b1a35";
const GOLD = "#b08a4e";

// Emblem = top band of the full logo (above the Arabic/English name).
const full = path.join(out, "logo-full.png");
const { width: fw } = await sharp(full).metadata();
const emblemBand = await sharp(full).extract({ left: 0, top: 0, width: fw, height: 545 }).png().toBuffer();
const emblem = await sharp(emblemBand).trim().png().toBuffer();

/** Square QR image of `size` px with the emblem on a white rounded badge in the middle. */
async function qrPng(size) {
  const qr = await QRCode.toBuffer(url, {
    errorCorrectionLevel: "H", // up to 30% of the code may be covered — leaves room for the logo
    margin: 2,
    width: size,
    color: { dark: NAVY, light: "#ffffff" },
  });
  const badge = Math.round(size * 0.24);
  const logo = await sharp(emblem).resize({ width: Math.round(badge * 0.78), height: Math.round(badge * 0.78), fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } }).toBuffer();
  const plate = Buffer.from(
    `<svg width="${badge}" height="${badge}"><rect width="${badge}" height="${badge}" rx="${badge * 0.2}" fill="#fff"/></svg>`,
  );
  const offset = Math.round((size - badge) / 2);
  return sharp(qr)
    .composite([
      { input: plate, left: offset, top: offset },
      { input: logo, gravity: "center" },
    ])
    .png()
    .toBuffer();
}

// 1) PNG
const png = await qrPng(1200);
await fs.writeFile(path.join(out, "qr-code.png"), png);

// 2) SVG (vector modules + embedded emblem)
const svgQr = await QRCode.toString(url, { type: "svg", errorCorrectionLevel: "H", margin: 2, color: { dark: NAVY, light: "#ffffff" } });
const viewBox = Number(/viewBox="0 0 (\d+) \d+"/.exec(svgQr)[1]);
const b = viewBox * 0.24;
const emblemData = (await sharp(emblem).resize({ width: 300 }).png().toBuffer()).toString("base64");
const svg = svgQr.replace(
  "</svg>",
  `<rect x="${(viewBox - b) / 2}" y="${(viewBox - b) / 2}" width="${b}" height="${b}" rx="${b * 0.2}" fill="#fff"/>` +
    `<image x="${(viewBox - b * 0.78) / 2}" y="${(viewBox - b * 0.78) / 2}" width="${b * 0.78}" height="${b * 0.78}" preserveAspectRatio="xMidYMid meet" href="data:image/png;base64,${emblemData}"/></svg>`,
);
await fs.writeFile(path.join(out, "qr-code.svg"), svg);

// 3) Printable card 1200 x 1600
const W = 1200, H = 1600;
const host = url.replace(/^https?:\/\//, "").replace(/\/$/, "");
const lockup = await sharp(path.join(out, "logo-horizontal.png")).resize({ width: 760 }).toBuffer();
const lockupMeta = await sharp(lockup).metadata();
const qrCard = await qrPng(820);
const text = Buffer.from(`<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
  <rect x="24" y="24" width="${W - 48}" height="${H - 48}" rx="48" fill="none" stroke="${GOLD}" stroke-width="4"/>
  <text x="${W / 2}" y="420" text-anchor="middle" font-family="Segoe UI, Arial, sans-serif" font-size="52" font-weight="700" fill="${NAVY}">Scan to visit our website</text>
  <text x="${W / 2}" y="492" text-anchor="middle" font-family="Segoe UI, Arial, sans-serif" font-size="46" font-weight="700" fill="${GOLD}" direction="rtl">امسح الرمز لزيارة موقعنا</text>
  <rect x="${(W - 900) / 2}" y="540" width="900" height="900" rx="40" fill="#fff" stroke="#e7e1d7" stroke-width="3"/>
  <text x="${W / 2}" y="1520" text-anchor="middle" font-family="Segoe UI, Arial, sans-serif" font-size="50" font-weight="700" fill="${NAVY}" letter-spacing="1">${host}</text>
</svg>`);
await sharp({ create: { width: W, height: H, channels: 4, background: "#f7f4ef" } })
  .composite([
    { input: lockup, left: Math.round((W - 760) / 2), top: Math.round(150 - (lockupMeta.height ?? 180) / 2) + 40 },
    { input: text, left: 0, top: 0 },
    { input: qrCard, left: Math.round((W - 820) / 2), top: 580 },
  ])
  .png()
  .toFile(path.join(out, "qr-card.png"));

console.log(`QR code for ${url} written to public/brand/ (qr-code.png, qr-code.svg, qr-card.png)`);
