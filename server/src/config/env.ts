import { config } from "dotenv";

config();

function parseCsv(value: string | undefined) {
  if (!value) return [];
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function requiredNumber(value: string | undefined, fallback: number) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

export const env = {
  PORT: requiredNumber(process.env.PORT, 4000),
  NODE_ENV: process.env.NODE_ENV ?? "development",
  CORS_ALLOWED_ORIGINS: parseCsv(process.env.CORS_ALLOWED_ORIGINS),
  CODESPACE_NAME: process.env.CODESPACE_NAME ?? "",
  GITHUB_CODESPACES_PORT_FORWARDING_DOMAIN: process.env.GITHUB_CODESPACES_PORT_FORWARDING_DOMAIN ?? "",
  JWT_SECRET: process.env.JWT_SECRET ?? "development-secret",
  DATABASE_URL: process.env.DATABASE_URL ?? "postgresql://postgres:postgres@localhost:5432/atlas_equity_research",
  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME ?? "",
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY ?? "",
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET ?? "",
  CLOUDINARY_FOLDER: process.env.CLOUDINARY_FOLDER ?? "atlas-equity-research"
};

