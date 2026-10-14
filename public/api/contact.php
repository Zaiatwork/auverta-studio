<?php
declare(strict_types=1);

// Contact form endpoint. Static site + PHP: validates, rate limits, stores, emails.
header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');
header('X-Content-Type-Options: nosniff');

function respond(int $code, array $body): never
{
    http_response_code($code);
    echo json_encode($body, JSON_UNESCAPED_UNICODE);
    exit;
}

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    header('Allow: POST');
    respond(405, ['ok' => false, 'error' => 'Method not allowed.']);
}

$configPath = dirname(__DIR__, 2) . '/private/config.php';
if (!is_file($configPath)) {
    error_log('contact.php: config missing');
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

// Honeypot and time trap: bots fill the hidden field or submit instantly.
$elapsed = (int) ($in['elapsed'] ?? 0);
if (($in['website'] ?? '') !== '' || $elapsed < 2500) {
    respond(200, ['ok' => true]); // pretend success, store nothing
}

function clean(mixed $v, int $max): string
{
    $s = is_string($v) ? trim($v) : '';
    $s = preg_replace('/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/u', '', $s) ?? '';
    return mb_substr($s, 0, $max);
}

$name = clean($in['name'] ?? '', 120);
$email = clean($in['email'] ?? '', 190);
$company = clean($in['company'] ?? '', 160);
$service = clean($in['service'] ?? '', 80);
$message = clean($in['message'] ?? '', 4000);

if ($name === '' || $message === '' || mb_strlen($message) < 10
    || !filter_var($email, FILTER_VALIDATE_EMAIL)
    || preg_match('/[\r\n]/', $name . $email . $company . $service)) {
    respond(422, ['ok' => false, 'error' => 'Please check your details and try again.']);
}

$ipHash = hash('sha256', $cfg['ip_salt'] . ($_SERVER['REMOTE_ADDR'] ?? ''));

try {
    $pdo = new PDO(
        "mysql:host={$cfg['db_host']};dbname={$cfg['db_name']};charset=utf8mb4",
        $cfg['db_user'],
        $cfg['db_pass'],
        [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION, PDO::ATTR_EMULATE_PREPARES => false]
    );

    // Max 5 attempts per hour per visitor.
    $q = $pdo->prepare('SELECT COUNT(*) FROM rate_limits WHERE ip_hash = ? AND created_at > (NOW() - INTERVAL 1 HOUR)');
    $q->execute([$ipHash]);
    if ((int) $q->fetchColumn() >= 5) {
        respond(429, ['ok' => false, 'error' => 'Too many requests. Please try again later.']);
    }
    $pdo->prepare('INSERT INTO rate_limits (ip_hash) VALUES (?)')->execute([$ipHash]);
    $pdo->exec('DELETE FROM rate_limits WHERE created_at < (NOW() - INTERVAL 1 DAY)');

    $ins = $pdo->prepare(
        'INSERT INTO leads (name, email, company, service, message, ip_hash, user_agent) VALUES (?,?,?,?,?,?,?)'
    );
    $ins->execute([
        $name, $email, $company ?: null, $service, $message, $ipHash,
        mb_substr($_SERVER['HTTP_USER_AGENT'] ?? '', 0, 255) ?: null,
    ]);
    $id = (int) $pdo->lastInsertId();
} catch (Throwable $e) {
    error_log('contact.php db: ' . $e->getMessage());
    respond(500, ['ok' => false, 'error' => 'Something went wrong. Please email us directly.']);
}

// Notification email. Visitor input only appears in the body, never in headers
// except Reply-To, which is validated and newline-free.
$body = "New enquiry #$id\n\nName: $name\nEmail: $email\nCompany: $company\nInterested in: $service\n\n$message\n";
$headers = [
    'From' => $cfg['mail_from'],
    'Reply-To' => $email,
    'Content-Type' => 'text/plain; charset=UTF-8',
];
$mailed = @mail($cfg['mail_to'], '=?UTF-8?B?' . base64_encode("New enquiry: $name") . '?=', $body, $headers);
if ($mailed) {
    $pdo->prepare('UPDATE leads SET mailed = 1 WHERE id = ?')->execute([$id]);
}

respond(200, ['ok' => true]);
