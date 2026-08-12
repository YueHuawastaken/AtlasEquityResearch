-- Drop legacy Research Journal attachment relation and column.
ALTER TABLE "Attachment" DROP CONSTRAINT IF EXISTS "Attachment_researchJournalId_fkey";
ALTER TABLE "Attachment" DROP COLUMN IF EXISTS "researchJournalId";

-- Drop legacy Research Journal table.
DROP TABLE IF EXISTS "ResearchJournal";

-- Create replacement Valuation Model table.
CREATE TABLE "ValuationModel" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "authorId" TEXT,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "currentSharePrice" DECIMAL(18,4) NOT NULL,
    "revenue" DECIMAL(18,4) NOT NULL,
    "revenueGrowth" DECIMAL(10,4) NOT NULL,
    "ebitdaOrEbit" DECIMAL(18,4) NOT NULL,
    "freeCashFlow" DECIMAL(18,4) NOT NULL,
    "wacc" DECIMAL(10,4) NOT NULL,
    "terminalGrowthRate" DECIMAL(10,4) NOT NULL,
    "enterpriseValue" DECIMAL(18,4) NOT NULL,
    "equityValue" DECIMAL(18,4) NOT NULL,
    "sharesOutstanding" DECIMAL(18,4) NOT NULL,
    "fairValue" DECIMAL(18,4) NOT NULL,
    "upsideDownside" DECIMAL(10,4) NOT NULL,
    "valuationConclusion" TEXT NOT NULL,
    "status" "EntityStatus" NOT NULL DEFAULT 'draft',
    "publishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ValuationModel_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "ValuationModel_slug_key" ON "ValuationModel"("slug");

ALTER TABLE "ValuationModel" ADD CONSTRAINT "ValuationModel_companyId_fkey"
FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "ValuationModel" ADD CONSTRAINT "ValuationModel_authorId_fkey"
FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "Attachment" ADD COLUMN "valuationModelId" TEXT;

ALTER TABLE "Attachment" ADD CONSTRAINT "Attachment_valuationModelId_fkey"
FOREIGN KEY ("valuationModelId") REFERENCES "ValuationModel"("id") ON DELETE SET NULL ON UPDATE CASCADE;
