-- CreateEnum
CREATE TYPE "EntityStatus" AS ENUM ('draft', 'published', 'archived');

-- CreateEnum
CREATE TYPE "Recommendation" AS ENUM ('buy', 'overweight', 'hold', 'underweight', 'sell');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'viewer',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Company" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "ticker" TEXT NOT NULL,
    "exchange" TEXT NOT NULL,
    "sector" TEXT NOT NULL,
    "industry" TEXT NOT NULL,
    "description" TEXT,
    "status" "EntityStatus" NOT NULL DEFAULT 'draft',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Company_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WatchlistItem" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WatchlistItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InvestmentMemo" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "authorId" TEXT,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "recommendation" "Recommendation" NOT NULL,
    "targetPrice" DECIMAL(18,4) NOT NULL,
    "currentPrice" DECIMAL(18,4) NOT NULL,
    "expectedReturn" DECIMAL(10,4) NOT NULL,
    "investmentHorizon" TEXT NOT NULL,
    "convictionLevel" INTEGER NOT NULL,
    "executiveSummary" TEXT NOT NULL,
    "thesis" TEXT NOT NULL,
    "status" "EntityStatus" NOT NULL DEFAULT 'draft',
    "publishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "InvestmentMemo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "IndustryReport" (
    "id" TEXT NOT NULL,
    "companyId" TEXT,
    "authorId" TEXT,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "executiveSummary" TEXT NOT NULL,
    "overview" TEXT NOT NULL,
    "marketSize" TEXT NOT NULL,
    "tam" TEXT NOT NULL,
    "sam" TEXT NOT NULL,
    "som" TEXT NOT NULL,
    "growth" TEXT NOT NULL,
    "porterFiveForces" TEXT NOT NULL,
    "valueChain" TEXT NOT NULL,
    "competitors" TEXT NOT NULL,
    "supplyChain" TEXT NOT NULL,
    "demandDrivers" TEXT NOT NULL,
    "technologyTrends" TEXT NOT NULL,
    "regulation" TEXT NOT NULL,
    "risks" TEXT NOT NULL,
    "investmentImplications" TEXT NOT NULL,
    "status" "EntityStatus" NOT NULL DEFAULT 'draft',
    "publishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "IndustryReport_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MarketOutlook" (
    "id" TEXT NOT NULL,
    "companyId" TEXT,
    "authorId" TEXT,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "month" TEXT NOT NULL,
    "executiveSummary" TEXT NOT NULL,
    "federalReserve" TEXT NOT NULL,
    "interestRates" TEXT NOT NULL,
    "inflation" TEXT NOT NULL,
    "gdp" TEXT NOT NULL,
    "employment" TEXT NOT NULL,
    "geopolitics" TEXT NOT NULL,
    "currencies" TEXT NOT NULL,
    "commodities" TEXT NOT NULL,
    "technology" TEXT NOT NULL,
    "ai" TEXT NOT NULL,
    "semiconductors" TEXT NOT NULL,
    "healthcare" TEXT NOT NULL,
    "consumer" TEXT NOT NULL,
    "financials" TEXT NOT NULL,
    "marketValuation" TEXT NOT NULL,
    "sectorOutlook" TEXT NOT NULL,
    "portfolioPositioning" TEXT NOT NULL,
    "conclusion" TEXT NOT NULL,
    "status" "EntityStatus" NOT NULL DEFAULT 'draft',
    "publishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MarketOutlook_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ResearchJournal" (
    "id" TEXT NOT NULL,
    "companyId" TEXT,
    "authorId" TEXT,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "prompt" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "reflections" TEXT NOT NULL,
    "status" "EntityStatus" NOT NULL DEFAULT 'draft',
    "publishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ResearchJournal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tag" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "color" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Tag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MemoTag" (
    "id" TEXT NOT NULL,
    "memoId" TEXT NOT NULL,
    "tagId" TEXT NOT NULL,

    CONSTRAINT "MemoTag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Attachment" (
    "id" TEXT NOT NULL,
    "companyId" TEXT,
    "memoId" TEXT,
    "industryReportId" TEXT,
    "marketOutlookId" TEXT,
    "researchJournalId" TEXT,
    "fileName" TEXT NOT NULL,
    "fileType" TEXT NOT NULL,
    "fileSize" INTEGER NOT NULL,
    "url" TEXT NOT NULL,
    "publicId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Attachment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NewsletterSubscriber" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "NewsletterSubscriber_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContactMessage" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'new',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ContactMessage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Company_ticker_key" ON "Company"("ticker");

-- CreateIndex
CREATE UNIQUE INDEX "WatchlistItem_userId_companyId_key" ON "WatchlistItem"("userId", "companyId");

-- CreateIndex
CREATE UNIQUE INDEX "InvestmentMemo_slug_key" ON "InvestmentMemo"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "IndustryReport_slug_key" ON "IndustryReport"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "MarketOutlook_slug_key" ON "MarketOutlook"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "ResearchJournal_slug_key" ON "ResearchJournal"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Tag_name_key" ON "Tag"("name");

-- CreateIndex
CREATE UNIQUE INDEX "MemoTag_memoId_tagId_key" ON "MemoTag"("memoId", "tagId");

-- CreateIndex
CREATE UNIQUE INDEX "NewsletterSubscriber_email_key" ON "NewsletterSubscriber"("email");

-- AddForeignKey
ALTER TABLE "WatchlistItem" ADD CONSTRAINT "WatchlistItem_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WatchlistItem" ADD CONSTRAINT "WatchlistItem_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InvestmentMemo" ADD CONSTRAINT "InvestmentMemo_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InvestmentMemo" ADD CONSTRAINT "InvestmentMemo_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IndustryReport" ADD CONSTRAINT "IndustryReport_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IndustryReport" ADD CONSTRAINT "IndustryReport_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MarketOutlook" ADD CONSTRAINT "MarketOutlook_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MarketOutlook" ADD CONSTRAINT "MarketOutlook_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ResearchJournal" ADD CONSTRAINT "ResearchJournal_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ResearchJournal" ADD CONSTRAINT "ResearchJournal_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MemoTag" ADD CONSTRAINT "MemoTag_memoId_fkey" FOREIGN KEY ("memoId") REFERENCES "InvestmentMemo"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MemoTag" ADD CONSTRAINT "MemoTag_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "Tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Attachment" ADD CONSTRAINT "Attachment_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Attachment" ADD CONSTRAINT "Attachment_memoId_fkey" FOREIGN KEY ("memoId") REFERENCES "InvestmentMemo"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Attachment" ADD CONSTRAINT "Attachment_industryReportId_fkey" FOREIGN KEY ("industryReportId") REFERENCES "IndustryReport"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Attachment" ADD CONSTRAINT "Attachment_marketOutlookId_fkey" FOREIGN KEY ("marketOutlookId") REFERENCES "MarketOutlook"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Attachment" ADD CONSTRAINT "Attachment_researchJournalId_fkey" FOREIGN KEY ("researchJournalId") REFERENCES "ResearchJournal"("id") ON DELETE SET NULL ON UPDATE CASCADE;
