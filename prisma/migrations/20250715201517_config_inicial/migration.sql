-- CreateEnum
CREATE TYPE "activity_type" AS ENUM ('status_change', 'payment', 'contact', 'note', 'created', 'updated');

-- CreateEnum
CREATE TYPE "currency_type" AS ENUM ('BRL', 'USD', 'EUR', 'ARS');

-- CreateEnum
CREATE TYPE "document_type" AS ENUM ('cpf', 'cnpj', 'passport', 'rg');

-- CreateEnum
CREATE TYPE "gender_type" AS ENUM ('M', 'F', 'other');

-- CreateEnum
CREATE TYPE "passenger_type" AS ENUM ('adult', 'child', 'infant');

-- CreateEnum
CREATE TYPE "payment_method" AS ENUM ('cash', 'credit_card', 'debit_card', 'bank_transfer', 'pix', 'check');

-- CreateEnum
CREATE TYPE "travel_status" AS ENUM ('orcamento', 'aguardando_pagamento', 'confirmada', 'em_andamento', 'finalizada', 'cancelada');

-- CreateEnum
CREATE TYPE "user_role" AS ENUM ('admin', 'agent', 'manager');

-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "password_hash" VARCHAR(255) NOT NULL,
    "first_name" VARCHAR(100) NOT NULL,
    "last_name" VARCHAR(100) NOT NULL,
    "phone" VARCHAR(20),
    "role" "user_role" DEFAULT 'agent',
    "is_active" BOOLEAN DEFAULT true,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "customers" (
    "id" UUID NOT NULL,
    "first_name" VARCHAR(100) NOT NULL,
    "last_name" VARCHAR(100) NOT NULL,
    "email" VARCHAR(255),
    "phone" VARCHAR(20),
    "document_type" "document_type" DEFAULT 'cpf',
    "document_number" VARCHAR(50),
    "birth_date" DATE,
    "gender" "gender_type",
    "address_street" VARCHAR(255),
    "address_number" VARCHAR(20),
    "address_complement" VARCHAR(100),
    "address_neighborhood" VARCHAR(100),
    "address_city" VARCHAR(100),
    "address_state" VARCHAR(50),
    "address_zip_code" VARCHAR(20),
    "address_country" VARCHAR(100) DEFAULT 'Brasil',
    "created_by" UUID,
    "is_active" BOOLEAN DEFAULT true,
    "notes" TEXT,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "customers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "travels" (
    "id" UUID NOT NULL,
    "customer_id" UUID NOT NULL,
    "agent_id" UUID NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "destination" VARCHAR(255) NOT NULL,
    "departure_city" VARCHAR(255),
    "departure_date" DATE NOT NULL,
    "return_date" DATE,
    "created_date" DATE DEFAULT CURRENT_DATE,
    "total_value" DECIMAL(10,2),
    "paid_value" DECIMAL(10,2) DEFAULT 0,
    "currency" "currency_type" DEFAULT 'BRL',
    "status" "travel_status" DEFAULT 'orcamento',
    "is_international" BOOLEAN DEFAULT false,
    "passenger_count" INTEGER DEFAULT 1,
    "notes" TEXT,
    "internal_notes" TEXT,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "travels_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "passengers" (
    "id" UUID NOT NULL,
    "travel_id" UUID NOT NULL,
    "first_name" VARCHAR(100) NOT NULL,
    "last_name" VARCHAR(100) NOT NULL,
    "document_type" "document_type" DEFAULT 'cpf',
    "document_number" VARCHAR(50),
    "birth_date" DATE,
    "gender" "gender_type",
    "passenger_type" "passenger_type" DEFAULT 'adult',
    "is_primary" BOOLEAN DEFAULT false,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "passengers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "activities" (
    "id" UUID NOT NULL,
    "travel_id" UUID,
    "customer_id" UUID,
    "user_id" UUID NOT NULL,
    "activity_type" "activity_type" NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "metadata" JSONB,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "activities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payments" (
    "id" UUID NOT NULL,
    "travel_id" UUID NOT NULL,
    "amount" DECIMAL(10,2) NOT NULL,
    "currency" "currency_type" DEFAULT 'BRL',
    "payment_method" "payment_method" NOT NULL,
    "payment_date" DATE NOT NULL,
    "reference_number" VARCHAR(100),
    "notes" TEXT,
    "created_by" UUID NOT NULL,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "payments_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "idx_customers_active" ON "customers"("is_active");

-- CreateIndex
CREATE INDEX "idx_customers_created_by" ON "customers"("created_by");

-- CreateIndex
CREATE INDEX "idx_customers_document" ON "customers"("document_number");

-- CreateIndex
CREATE INDEX "idx_customers_email" ON "customers"("email");

-- CreateIndex
CREATE INDEX "idx_customers_name" ON "customers"("first_name", "last_name");

-- CreateIndex
CREATE INDEX "idx_travels_agent" ON "travels"("agent_id");

-- CreateIndex
CREATE INDEX "idx_travels_currency" ON "travels"("currency");

-- CreateIndex
CREATE INDEX "idx_travels_customer" ON "travels"("customer_id");

-- CreateIndex
CREATE INDEX "idx_travels_dates" ON "travels"("departure_date", "return_date");

-- CreateIndex
CREATE INDEX "idx_travels_destination" ON "travels"("destination");

-- CreateIndex
CREATE INDEX "idx_travels_status" ON "travels"("status");

-- CreateIndex
CREATE INDEX "idx_passengers_primary" ON "passengers"("is_primary");

-- CreateIndex
CREATE INDEX "idx_passengers_travel" ON "passengers"("travel_id");

-- CreateIndex
CREATE INDEX "idx_activities_created" ON "activities"("created_at");

-- CreateIndex
CREATE INDEX "idx_activities_customer" ON "activities"("customer_id");

-- CreateIndex
CREATE INDEX "idx_activities_travel" ON "activities"("travel_id");

-- CreateIndex
CREATE INDEX "idx_activities_type" ON "activities"("activity_type");

-- CreateIndex
CREATE INDEX "idx_activities_user" ON "activities"("user_id");

-- CreateIndex
CREATE INDEX "idx_payments_date" ON "payments"("payment_date");

-- CreateIndex
CREATE INDEX "idx_payments_method" ON "payments"("payment_method");

-- CreateIndex
CREATE INDEX "idx_payments_travel" ON "payments"("travel_id");

-- AddForeignKey
ALTER TABLE "customers" ADD CONSTRAINT "customers_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "travels" ADD CONSTRAINT "travels_agent_id_fkey" FOREIGN KEY ("agent_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "travels" ADD CONSTRAINT "travels_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "customers"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "passengers" ADD CONSTRAINT "passengers_travel_id_fkey" FOREIGN KEY ("travel_id") REFERENCES "travels"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "activities" ADD CONSTRAINT "activities_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "customers"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "activities" ADD CONSTRAINT "activities_travel_id_fkey" FOREIGN KEY ("travel_id") REFERENCES "travels"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "activities" ADD CONSTRAINT "activities_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_travel_id_fkey" FOREIGN KEY ("travel_id") REFERENCES "travels"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
