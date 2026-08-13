ALTER TABLE "ValuationModel"
ALTER COLUMN "sharesOutstanding" TYPE DECIMAL(18,0)
USING ROUND("sharesOutstanding");