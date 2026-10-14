<?php
// Copy to public_html/.private/config.php on the server (that folder has a deny-all .htaccess).
// Never commit the real file.
return [
    'db_host' => '127.0.0.1',
    'db_name' => 'CHANGE_ME',
    'db_user' => 'CHANGE_ME',
    'db_pass' => 'CHANGE_ME',
    'mail_to' => 'info@auverta.studio',
    'mail_from' => 'no-reply@auverta.studio',
    'allowed_origins' => ['https://auverta.studio', 'https://www.auverta.studio'],
    'ip_salt' => 'CHANGE_ME_RANDOM_64_CHARS',
];
