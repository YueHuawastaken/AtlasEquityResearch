import type { EntityStatus, Recommendation } from "@prisma/client";

const entityStatuses: EntityStatus[] = ["draft", "published", "archived"];
const recommendations: Recommendation[] = ["buy", "overweight", "hold", "underweight", "sell"];

export function normalizeEntityStatus(value: string | null | undefined): EntityStatus | undefined {
  const normalized = value?.trim().toLowerCase();
  return normalized && entityStatuses.includes(normalized as EntityStatus) ? (normalized as EntityStatus) : undefined;
}

export function normalizeRecommendation(value: string | null | undefined): Recommendation | undefined {
  const normalized = value?.trim().toLowerCase();
  return normalized && recommendations.includes(normalized as Recommendation) ? (normalized as Recommendation) : undefined;
}
