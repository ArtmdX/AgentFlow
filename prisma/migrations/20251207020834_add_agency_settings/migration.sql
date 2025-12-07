-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('info', 'warning', 'success', 'error');

-- CreateEnum
CREATE TYPE "NotificationPriority" AS ENUM ('low', 'normal', 'high', 'urgent');

-- CreateEnum
CREATE TYPE "EmailStatus" AS ENUM ('pending', 'sent', 'failed', 'cancelled');

-- CreateEnum
CREATE TYPE "QueueStatus" AS ENUM ('pending', 'processing', 'completed', 'failed', 'cancelled');

-- CreateTable
CREATE TABLE "notifications" (
    "id" UUID NOT NULL,
    "type" "NotificationType" NOT NULL DEFAULT 'info',
    "priority" "NotificationPriority" NOT NULL DEFAULT 'normal',
    "title" VARCHAR(255) NOT NULL,
    "message" TEXT NOT NULL,
    "action_url" VARCHAR(500),
    "is_read" BOOLEAN NOT NULL DEFAULT false,
    "read_at" TIMESTAMP(6),
    "user_id" UUID NOT NULL,
    "related_entity" VARCHAR(50),
    "related_entity_id" UUID,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notification_preferences" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "in_app_enabled" BOOLEAN NOT NULL DEFAULT true,
    "travel_created" BOOLEAN NOT NULL DEFAULT true,
    "travel_status_changed" BOOLEAN NOT NULL DEFAULT true,
    "payment_received" BOOLEAN NOT NULL DEFAULT true,
    "travel_upcoming" BOOLEAN NOT NULL DEFAULT true,
    "payment_due_soon" BOOLEAN NOT NULL DEFAULT true,
    "payment_overdue" BOOLEAN NOT NULL DEFAULT true,
    "documents_pending" BOOLEAN NOT NULL DEFAULT true,
    "email_enabled" BOOLEAN NOT NULL DEFAULT true,
    "email_travel_created" BOOLEAN NOT NULL DEFAULT true,
    "email_payment_received" BOOLEAN NOT NULL DEFAULT true,
    "email_travel_upcoming" BOOLEAN NOT NULL DEFAULT true,
    "email_payment_due_soon" BOOLEAN NOT NULL DEFAULT true,
    "email_payment_overdue" BOOLEAN NOT NULL DEFAULT true,
    "email_documents_pending" BOOLEAN NOT NULL DEFAULT false,
    "digest_mode" BOOLEAN NOT NULL DEFAULT false,
    "digest_time" VARCHAR(5) NOT NULL DEFAULT '08:00',
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "notification_preferences_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "email_logs" (
    "id" UUID NOT NULL,
    "template_type" VARCHAR(100) NOT NULL,
    "subject" VARCHAR(255) NOT NULL,
    "to" VARCHAR(255) NOT NULL,
    "cc" VARCHAR(255),
    "bcc" VARCHAR(255),
    "from" VARCHAR(255) NOT NULL,
    "status" "EmailStatus" NOT NULL DEFAULT 'pending',
    "sent_at" TIMESTAMP(6),
    "failed_at" TIMESTAMP(6),
    "error_message" TEXT,
    "user_id" UUID,
    "related_entity" VARCHAR(50),
    "related_entity_id" UUID,
    "resend_id" VARCHAR(100),
    "resend_status" VARCHAR(50),
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "email_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "email_templates" (
    "id" UUID NOT NULL,
    "type" VARCHAR(100) NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "subject" VARCHAR(255) NOT NULL,
    "html_content" TEXT NOT NULL,
    "text_content" TEXT,
    "available_vars" JSONB NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "version" INTEGER NOT NULL DEFAULT 1,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "email_templates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "email_queue" (
    "id" UUID NOT NULL,
    "template_type" VARCHAR(100) NOT NULL,
    "to" VARCHAR(255) NOT NULL,
    "subject" VARCHAR(255) NOT NULL,
    "html_content" TEXT NOT NULL,
    "text_content" TEXT,
    "status" "QueueStatus" NOT NULL DEFAULT 'pending',
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "max_attempts" INTEGER NOT NULL DEFAULT 3,
    "next_attempt_at" TIMESTAMP(6),
    "user_id" UUID,
    "related_entity" VARCHAR(50),
    "related_entity_id" UUID,
    "variables" JSONB,
    "processed_at" TIMESTAMP(6),
    "error_message" TEXT,
    "email_log_id" UUID,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "email_queue_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "agency_settings" (
    "id" UUID NOT NULL,
    "agency_name" VARCHAR(255) NOT NULL DEFAULT 'AgentFlow',
    "logo_url" VARCHAR(500),
    "phone" VARCHAR(20),
    "email" VARCHAR(255),
    "website" VARCHAR(255),
    "address_street" VARCHAR(255),
    "address_number" VARCHAR(20),
    "address_complement" VARCHAR(100),
    "address_neighborhood" VARCHAR(100),
    "address_city" VARCHAR(100),
    "address_state" VARCHAR(50),
    "address_zip_code" VARCHAR(20),
    "address_country" VARCHAR(100) DEFAULT 'Brasil',
    "smtp_host" VARCHAR(255),
    "smtp_port" INTEGER DEFAULT 587,
    "smtp_user" VARCHAR(255),
    "smtp_password" VARCHAR(255),
    "smtp_secure" BOOLEAN DEFAULT false,
    "smtp_from_email" VARCHAR(255),
    "smtp_from_name" VARCHAR(255),
    "default_currency" "currency_type" DEFAULT 'BRL',
    "interest_rate" DECIMAL(5,2) DEFAULT 0,
    "fine_rate" DECIMAL(5,2) DEFAULT 0,
    "exchange_rates" JSONB,
    "terms_of_service" TEXT,
    "privacy_policy" TEXT,
    "notifications_enabled" BOOLEAN DEFAULT true,
    "email_notifications_enabled" BOOLEAN DEFAULT true,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "agency_settings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "idx_notifications_user_read_created" ON "notifications"("user_id", "is_read", "created_at");

-- CreateIndex
CREATE INDEX "idx_notifications_user_created" ON "notifications"("user_id", "created_at");

-- CreateIndex
CREATE UNIQUE INDEX "notification_preferences_user_id_key" ON "notification_preferences"("user_id");

-- CreateIndex
CREATE INDEX "idx_email_logs_status_created" ON "email_logs"("status", "created_at");

-- CreateIndex
CREATE INDEX "idx_email_logs_user" ON "email_logs"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "email_templates_type_key" ON "email_templates"("type");

-- CreateIndex
CREATE INDEX "idx_email_templates_type_active" ON "email_templates"("type", "is_active");

-- CreateIndex
CREATE UNIQUE INDEX "email_queue_email_log_id_key" ON "email_queue"("email_log_id");

-- CreateIndex
CREATE INDEX "idx_email_queue_status_next" ON "email_queue"("status", "next_attempt_at");

-- CreateIndex
CREATE INDEX "idx_email_queue_created" ON "email_queue"("created_at");

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notification_preferences" ADD CONSTRAINT "notification_preferences_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
