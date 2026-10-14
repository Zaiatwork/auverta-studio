-- Auverta Studio: run once in phpMyAdmin (or via the Hostinger API) on the site database.
CREATE TABLE IF NOT EXISTS leads (
  id          INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  name        VARCHAR(120) NOT NULL,
  email       VARCHAR(190) NOT NULL,
  company     VARCHAR(160) NULL,
  service     VARCHAR(80)  NOT NULL,
  message     TEXT         NOT NULL,
  ip_hash     CHAR(64)     NOT NULL,
  user_agent  VARCHAR(255) NULL,
  mailed      TINYINT(1)   NOT NULL DEFAULT 0,
  created_at  TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  KEY idx_leads_created (created_at),
  KEY idx_leads_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- One row per attempt; used to rate limit by hashed IP.
CREATE TABLE IF NOT EXISTS rate_limits (
  id          INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  ip_hash     CHAR(64)  NOT NULL,
  created_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  KEY idx_rate_ip_time (ip_hash, created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
