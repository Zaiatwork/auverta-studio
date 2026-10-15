<?php
declare(strict_types=1);

// Shared helpers for every endpoint in this folder. Defines functions only: no output, no side
// effects on include. Direct requests are denied by public/.htaccess (files starting with "_").
// A new endpoint is: require __DIR__ . '/_lib.php'; $cfg = api_boot(); ...; respond(200, [...]).

/** Sends a JSON reply and stops. Shape: { ok: true, ...data } or { ok: false, error }. */
function respond(int $code, array $body): never
{
    http_response_code($code);
    echo json_encode($body, JSON_UNESCAPED_UNICODE);
    exit;
}

/**
 * Common preflight: JSON headers, POST only, config, same-origin, JSON body.
 * Returns [config, decoded body].
 */
function api_boot(): array
{
    header('Content-Type: application/json; charset=utf-8');
    header('Cache-Control: no-store');
    header('X-Content-Type-Options: nosniff');

    if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
        header('Allow: POST');
        respond(405, ['ok' => false, 'error' => 'Method not allowed.']);
    }

    // Hostinger uploads only reach public_html, so config sits in a deny-all folder there (not .private: Hostinger already uses that name).
    $configPath = dirname(__DIR__) . '/.auverta/config.php';
    if (!is_file($configPath)) {
        error_log('api: config missing');
        respond(500, ['ok' => false, 'error' => 'Server not configured.']);
    }
    $cfg = require $configPath;

    // Same-origin only (blocks cross-site form posts).
    $origin = $_SERVER['HTTP_ORIGIN'] ?? '';
    if ($origin === '' || !in_array($origin, $cfg['allowed_origins'], true)) {
        respond(403, ['ok' => false, 'error' => 'Forbidden.']);
    }

    if (!str_starts_with($_SERVER['CONTENT_TYPE'] ?? '', 'application/json')) {
        respond(415, ['ok' => false, 'error' => 'Unsupported media type.']);
    }
    $raw = file_get_contents('php://input', false, null, 0, 20000);
    $in = json_decode($raw ?: '', true);
    if (!is_array($in)) {
        respond(400, ['ok' => false, 'error' => 'Invalid request.']);
    }

    return [$cfg, $in];
}

/** Trims, strips control characters and caps the length of a visitor-supplied string. */
function clean(mixed $v, int $max): string
{
    $s = is_string($v) ? trim($v) : '';
    $s = preg_replace('/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/u', '', $s) ?? '';
    return mb_substr($s, 0, $max);
}

function db(array $cfg): PDO
{
    return new PDO(
        "mysql:host={$cfg['db_host']};dbname={$cfg['db_name']};charset=utf8mb4",
        $cfg['db_user'],
        $cfg['db_pass'],
        [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION, PDO::ATTR_EMULATE_PREPARES => false]
    );
}

/** Salted hash of the caller's IP: enough to rate limit, nothing personal stored. */
function ip_hash(array $cfg): string
{
    return hash('sha256', $cfg['ip_salt'] . ($_SERVER['REMOTE_ADDR'] ?? ''));
}

/** Allows at most $max calls per hour per visitor; replies 429 and stops when exceeded. */
function rate_limit(PDO $pdo, string $ipHash, int $max = 5): void
{
    $q = $pdo->prepare('SELECT COUNT(*) FROM rate_limits WHERE ip_hash = ? AND created_at > (NOW() - INTERVAL 1 HOUR)');
    $q->execute([$ipHash]);
    if ((int) $q->fetchColumn() >= $max) {
        respond(429, ['ok' => false, 'error' => 'Too many requests. Please try again later.']);
    }
    $pdo->prepare('INSERT INTO rate_limits (ip_hash) VALUES (?)')->execute([$ipHash]);
    $pdo->exec('DELETE FROM rate_limits WHERE created_at < (NOW() - INTERVAL 1 DAY)');
}
