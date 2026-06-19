<?php

class EmailSender {
    /**
     * Sends a verification email to the user.
     * Also logs the email details to a local text file for developer testing/debugging.
     *
     * @param string $email The recipient email.
     * @param string $token The verification token.
     * @return bool True if mail was sent, false otherwise.
     */
    public static function sendVerificationEmail($email, $token) {
        $frontendUrl = getenv('FRONTEND_URL') ?: 'http://localhost:5173';
        $verificationLink = $frontendUrl . '/verify-email?token=' . $token;

        $subject = "FixGo - Verify Your Email Address";
        
        $message = "Hello,\n\n";
        $message .= "Thank you for registering with FixGo! Please verify your email address to activate your account by clicking the link below:\n\n";
        $message .= $verificationLink . "\n\n";
        $message .= "If you did not create an account, no further action is required.\n\n";
        $message .= "Best regards,\n";
        $message .= "The FixGo Team";

        $headers = "From: no-reply@fixgo.com\r\n";
        $headers .= "Reply-To: no-reply@fixgo.com\r\n";
        $headers .= "X-Mailer: PHP/" . phpversion();

        // 1. Log the email to backend/email_logs.txt for local testing/development
        $logPath = __DIR__ . '/../email_logs.txt';
        $timestamp = date('Y-m-d H:i:s');
        $logEntry = "==================================================\n";
        $logEntry .= "Timestamp: $timestamp\n";
        $logEntry .= "To: $email\n";
        $logEntry .= "Subject: $subject\n";
        $logEntry .= "Link: $verificationLink\n";
        $logEntry .= "Headers:\n$headers\n";
        $logEntry .= "Message:\n$message\n";
        $logEntry .= "==================================================\n\n";

        file_put_contents($logPath, $logEntry, FILE_APPEND);

        // 2. Attempt standard PHP mail()
        // We suppress errors with @ in case mail server is not configured in php.ini
        return @mail($email, $subject, $message, $headers);
    }
}
