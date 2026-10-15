<?php
declare(strict_types=1);

// Contact form endpoint. Static site + PHP: validates, rate limits, stores, emails.
require __DIR__ . '/_lib.php';

[$cfg, $in] = api_boot();

// Honeypot and time trap: bots fill the hidden field or submit instantly.
$elapsed = (int) ($in['elapsed'] ?? 0);
if (($in['website'] ?? '') !== '' || $elapsed < 2500) {
    respond(200, ['ok' => true]); // pretend success, store nothing
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

$ipHash = ip_hash($cfg);

try {
    $pdo = db($cfg);
    rate_limit($pdo, $ipHash);

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
