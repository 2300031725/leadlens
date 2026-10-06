CREATE TABLE `leads` (
	`id` text PRIMARY KEY NOT NULL,
	`dedup_key` text NOT NULL,
	`company` text NOT NULL,
	`website` text NOT NULL,
	`industry` text NOT NULL,
	`city` text NOT NULL,
	`country` text NOT NULL,
	`employees` integer,
	`email` text NOT NULL,
	`source` text NOT NULL,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `idx_leads_dedup_key` ON `leads` (`dedup_key`);