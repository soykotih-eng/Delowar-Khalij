import "server-only";
import bcrypt from "bcryptjs";
import mysql, { type Pool, type ResultSetHeader, type RowDataPacket } from "mysql2/promise";
import { randomBytes } from "node:crypto";
import { seedAluWorks } from "@/data/aluminium";
import { seedProducts } from "@/data/products";

/**
 * MySQL access. Connection settings come from environment variables (set in Hostinger hPanel):
 * DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME. Tables are created and filled with the starter
 * catalogue automatically on first use, so there is no manual migration step.
 */
export const isDbConfigured = () => Boolean(process.env.DB_HOST && process.env.DB_USER && process.env.DB_NAME);

const REQUIRED_VARS = ["DB_HOST", "DB_USER", "DB_PASSWORD", "DB_NAME", "ADMIN_EMAIL", "ADMIN_PASSWORD"] as const;

/** Names of setup variables that are empty — shown on the admin login page to help with setup. */
export const missingSetupVars = () => REQUIRED_VARS.filter((key) => !process.env[key]?.trim());

export type DbCheck =
  | { ok: true; admins: number }
  | { ok: false; code: string; configured?: string; user?: string; accessible?: string[] };

/** Tries the database connection; on failure returns the driver error code plus setup hints (never the password). */
export async function checkDatabase(): Promise<DbCheck> {
  try {
    const rows = await query<RowDataPacket & { n: number }>("SELECT COUNT(*) AS n FROM admins");
    return { ok: true, admins: rows[0].n };
  } catch (error) {
    const err = error as Error & { code?: string; accessible?: string[] };
    const code = err.code ?? "UNKNOWN";
    console.error("[db] Connection check failed:", code, err.message);
    return { ok: false, code, configured: env().database, user: env().user, accessible: err.accessible };
  }
}

type Store = { pool?: Pool; ready?: Promise<void>; database?: string };
const store = globalThis as unknown as { __dakDb?: Store };
const state: Store = (store.__dakDb ??= {});

const env = () => ({
  host: process.env.DB_HOST?.trim(),
  port: Number(process.env.DB_PORT?.trim() || 3306),
  user: process.env.DB_USER?.trim() ?? "",
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME?.trim() ?? "",
});

const SYSTEM_DATABASES = new Set(["information_schema", "mysql", "performance_schema", "sys"]);

/**
 * Picks the database to use. Hostinger names start with the account prefix (u123456789_), which is
 * easy to leave out of DB_NAME, so "website" also matches "u123456789_website" when this user can open it.
 * Any other mismatch is reported (with the databases this user can open) instead of guessed.
 */
async function resolveDatabase() {
  const { host, port, user, password, database } = env();
  const conn = await mysql.createConnection({ host, port, user, password }); // wrong user/password/host fails here
  let accessible: string[];
  try {
    const [rows] = await conn.query<RowDataPacket[]>("SHOW DATABASES");
    accessible = rows.map((r) => String(Object.values(r)[0])).filter((name) => !SYSTEM_DATABASES.has(name));
  } catch {
    return database; // listing not allowed: use DB_NAME as given
  } finally {
    await conn.end().catch(() => {});
  }

  const prefix = /^u\d+_/.exec(user)?.[0];
  const candidates = [database, prefix && !database.startsWith(prefix) ? prefix + database : null].filter(Boolean) as string[];
  for (const name of candidates) {
    const match = accessible.find((a) => a === name) ?? accessible.find((a) => a.toLowerCase() === name.toLowerCase());
    if (match) {
      if (match !== database) console.warn(`[db] DB_NAME "${database}" not found — using "${match}".`);
      return match;
    }
  }
  throw Object.assign(new Error(`User "${user}" cannot open database "${database}"`), {
    code: "ER_DBACCESS_DENIED_ERROR",
    accessible,
  });
}

function pool() {
  if (!isDbConfigured()) throw new Error("Database is not configured (DB_HOST, DB_USER, DB_NAME).");
  if (!state.database) throw new Error("Database not resolved yet.");
  const { host, port, user, password } = env();
  state.pool ??= mysql.createPool({
    host,
    port,
    user,
    password,
    database: state.database,
    charset: "utf8mb4",
    connectionLimit: 5,
    decimalNumbers: true,
  });
  return state.pool;
}

function ready() {
  state.ready ??= (async () => {
    state.database ??= await resolveDatabase();
    await migrate();
  })().catch((error) => {
    state.ready = undefined; // retry on the next request
    throw error;
  });
  return state.ready;
}

export async function query<T extends RowDataPacket>(sql: string, params: unknown[] = []) {
  await ready();
  const [rows] = await pool().query<T[]>(sql, params);
  return rows;
}

export async function exec(sql: string, params: unknown[] = []) {
  await ready();
  const [result] = await pool().query<ResultSetHeader>(sql, params);
  return result;
}

export async function getSetting(key: string) {
  const rows = await query<RowDataPacket & { v: string }>("SELECT v FROM settings WHERE k = ?", [key]);
  return rows[0]?.v ?? null;
}

const SCHEMA = [
  `CREATE TABLE IF NOT EXISTS settings (
    k VARCHAR(64) PRIMARY KEY,
    v TEXT NOT NULL
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,
  `CREATE TABLE IF NOT EXISTS admins (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(190) NOT NULL UNIQUE,
    password_hash VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,
  `CREATE TABLE IF NOT EXISTS media (
    id INT AUTO_INCREMENT PRIMARY KEY,
    mime VARCHAR(40) NOT NULL,
    width INT NOT NULL,
    height INT NOT NULL,
    data LONGBLOB NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,
  `CREATE TABLE IF NOT EXISTS products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    slug VARCHAR(140) NOT NULL UNIQUE,
    sku VARCHAR(40) NOT NULL,
    name_en VARCHAR(200) NOT NULL,
    name_ar VARCHAR(200) NOT NULL DEFAULT '',
    category VARCHAR(40) NOT NULL,
    origin VARCHAR(20) NOT NULL,
    color VARCHAR(20) NOT NULL,
    finish VARCHAR(20) NOT NULL,
    thickness DECIMAL(5,2) NULL,
    usage_list VARCHAR(200) NOT NULL DEFAULT '',
    price DECIMAL(12,2) NULL,
    unit VARCHAR(10) NOT NULL DEFAULT 'm2',
    in_stock TINYINT(1) NOT NULL DEFAULT 1,
    featured TINYINT(1) NOT NULL DEFAULT 0,
    short_en TEXT NOT NULL,
    short_ar TEXT NOT NULL,
    image VARCHAR(255) NOT NULL,
    sort INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,
  `CREATE TABLE IF NOT EXISTS alu_works (
    id INT AUTO_INCREMENT PRIMARY KEY,
    slug VARCHAR(140) NOT NULL UNIQUE,
    category VARCHAR(30) NOT NULL,
    title_en VARCHAR(200) NOT NULL,
    title_ar VARCHAR(200) NOT NULL DEFAULT '',
    system_en VARCHAR(200) NOT NULL DEFAULT '',
    system_ar VARCHAR(200) NOT NULL DEFAULT '',
    image VARCHAR(255) NOT NULL,
    w INT NOT NULL,
    h INT NOT NULL,
    featured TINYINT(1) NOT NULL DEFAULT 0,
    sort INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,
  `CREATE TABLE IF NOT EXISTS orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    ref VARCHAR(20) NOT NULL,
    type VARCHAR(30) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'new',
    lang VARCHAR(5) NOT NULL DEFAULT 'en',
    name VARCHAR(200) NOT NULL DEFAULT '',
    phone VARCHAR(60) NOT NULL DEFAULT '',
    email VARCHAR(200) NOT NULL DEFAULT '',
    location VARCHAR(300) NOT NULL DEFAULT '',
    total DECIMAL(14,2) NULL,
    summary TEXT NOT NULL,
    admin_note TEXT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_status (status),
    INDEX idx_created (created_at)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,
  `CREATE TABLE IF NOT EXISTS login_codes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    admin_id INT NOT NULL,
    code_hash CHAR(64) NOT NULL,
    attempts INT NOT NULL DEFAULT 0,
    used TINYINT(1) NOT NULL DEFAULT 0,
    expires_at DATETIME NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_admin (admin_id, used)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,
];

async function migrate() {
  const db = pool();
  for (const statement of SCHEMA) await db.query(statement);

  // Session-signing secret, generated once and kept in the database.
  await db.query("INSERT IGNORE INTO settings (k, v) VALUES ('session_secret', ?)", [randomBytes(48).toString("hex")]);

  const [[productCount]] = await db.query<(RowDataPacket & { n: number })[]>("SELECT COUNT(*) AS n FROM products");
  if (productCount.n === 0) {
    const total = seedProducts.length;
    await db.query(
      `INSERT INTO products (slug, sku, name_en, name_ar, category, origin, color, finish, thickness, usage_list,
        price, unit, in_stock, featured, short_en, short_ar, image, sort) VALUES ?`,
      [
        seedProducts.map((p, i) => [
          p.slug, p.sku, p.name.en, p.name.ar, p.category, p.origin, p.color, p.finish, p.thickness,
          p.usage.join(","), p.price, p.unit, p.inStock ? 1 : 0, p.featured ? 1 : 0, p.short.en, p.short.ar,
          p.image, total - i,
        ]),
      ],
    );
  }

  const [[workCount]] = await db.query<(RowDataPacket & { n: number })[]>("SELECT COUNT(*) AS n FROM alu_works");
  if (workCount.n === 0) {
    const total = seedAluWorks.length;
    await db.query(
      `INSERT INTO alu_works (slug, category, title_en, title_ar, system_en, system_ar, image, w, h, featured, sort) VALUES ?`,
      [
        seedAluWorks.map((w, i) => [
          w.slug, w.category, w.title.en, w.title.ar, w.system.en, w.system.ar, w.image, w.w, w.h, w.featured ? 1 : 0, total - i,
        ]),
      ],
    );
  }

  // First admin account from ADMIN_EMAIL / ADMIN_PASSWORD. ADMIN_RESET=true re-applies the password
  // (for a forgotten password); remove it again after one deploy.
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD;
  if (email && password) {
    const [[adminCount]] = await db.query<(RowDataPacket & { n: number })[]>("SELECT COUNT(*) AS n FROM admins");
    const reset = process.env.ADMIN_RESET === "true";
    if (adminCount.n === 0 || reset) {
      const hash = await bcrypt.hash(password, 11);
      await db.query(
        "INSERT INTO admins (email, password_hash) VALUES (?, ?) ON DUPLICATE KEY UPDATE password_hash = VALUES(password_hash)",
        [email, hash],
      );
    }
  }
}
