CREATE TABLE "site_access_keys" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "site_access_keys_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"access_key" varchar(255) NOT NULL,
	"title" varchar(100),
	"status" varchar(50) DEFAULT 'active' NOT NULL,
	"created_by" varchar(255),
	"expires_at" timestamp with time zone,
	"created_at" timestamp with time zone,
	"used_count" integer DEFAULT 0 NOT NULL,
	CONSTRAINT "site_access_keys_access_key_unique" UNIQUE("access_key")
);
