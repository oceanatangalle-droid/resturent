-- Contact Us form submissions (shown in Admin > Contact messages)
CREATE TABLE IF NOT EXISTS "contact_submissions" (
  "id" SERIAL PRIMARY KEY,
  "name" VARCHAR(255) NOT NULL,
  "email" VARCHAR(255) NOT NULL,
  "phone" VARCHAR(64) NOT NULL DEFAULT '',
  "message" TEXT NOT NULL DEFAULT '',
  "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);
