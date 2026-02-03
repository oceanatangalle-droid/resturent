-- Add status and responded_at to reservations (accept/reject)
ALTER TABLE "reservations"
  ADD COLUMN IF NOT EXISTS "status" VARCHAR(32) NOT NULL DEFAULT 'pending',
  ADD COLUMN IF NOT EXISTS "responded_at" TIMESTAMP WITH TIME ZONE;
