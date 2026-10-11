CREATE TYPE "public"."currency_enum" AS ENUM('MXN');--> statement-breakpoint
ALTER TABLE "transactions" DROP CONSTRAINT "transactions_amount_positive";--> statement-breakpoint
ALTER TABLE "transactions" ADD COLUMN "amount_cents" bigint NOT NULL;--> statement-breakpoint
ALTER TABLE "transactions" ADD COLUMN "currency" "currency_enum" DEFAULT 'MXN' NOT NULL;--> statement-breakpoint
ALTER TABLE "transactions" DROP COLUMN "amount";--> statement-breakpoint
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_amount_cents_positive" CHECK ("transactions"."amount_cents" > 0);