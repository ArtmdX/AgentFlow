/*
  Warnings:

  - A unique constraint covering the columns `[document_number]` on the table `customers` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[email]` on the table `customers` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateTable
CREATE TABLE "password_reset_tokens" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "token" VARCHAR(255) NOT NULL,
    "expires_at" TIMESTAMP(6) NOT NULL,
    "used_at" TIMESTAMP(6),
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "password_reset_tokens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cities" (
    "id" UUID NOT NULL,
    "iata_code" VARCHAR(3) NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "state" VARCHAR(100) NOT NULL,
    "state_code" VARCHAR(2) NOT NULL,
    "country" VARCHAR(100) NOT NULL DEFAULT 'Brasil',

    CONSTRAINT "cities_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "password_reset_tokens_token_key" ON "password_reset_tokens"("token");

-- CreateIndex
CREATE INDEX "idx_password_reset_user" ON "password_reset_tokens"("user_id");

-- CreateIndex
CREATE INDEX "idx_password_reset_token" ON "password_reset_tokens"("token");

-- CreateIndex
CREATE INDEX "idx_password_reset_expires" ON "password_reset_tokens"("expires_at");

-- CreateIndex
CREATE UNIQUE INDEX "cities_iata_code_key" ON "cities"("iata_code");

-- CreateIndex
CREATE INDEX "idx_cities_iata" ON "cities"("iata_code");

-- CreateIndex
CREATE INDEX "idx_cities_name" ON "cities"("name");

-- CreateIndex
CREATE INDEX "idx_cities_state" ON "cities"("state_code");

-- CreateIndex
CREATE UNIQUE INDEX "customers_document_number_key" ON "customers"("document_number");

-- CreateIndex
CREATE UNIQUE INDEX "customers_email_key" ON "customers"("email");

-- AddForeignKey
ALTER TABLE "password_reset_tokens" ADD CONSTRAINT "password_reset_tokens_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
