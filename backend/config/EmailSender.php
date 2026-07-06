<?php

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require_once __DIR__ . '/../vendor/autoload.php';

class EmailSender {
    /**
     * Sends a verification email to the user.
     *
     * @param string $email The recipient email.
     * @param string $token The verification token.
     * @return bool True if mail was sent, false otherwise.
     */
    public static function sendVerificationEmail($email, $token) {
        $frontendUrl = getenv('FRONTEND_URL') ?: 'http://localhost:5173';
        $verificationLink = $frontendUrl . '/verify-email?token=' . $token;

        $subject = "FixGo - Verify Your Email Address";
        
        $message = "Hello,<br><br>";
        $message .= "Thank you for registering with FixGo! Please verify your email address to activate your account by clicking the link below:<br><br>";
        $message .= "<a href='{$verificationLink}'>{$verificationLink}</a><br><br>";
        $message .= "If you did not create an account, no further action is required.<br><br>";
        $message .= "Best regards,<br>";
        $message .= "The FixGo Team";

        $mail = new PHPMailer(true);
        try {
            // Server settings
            $mail->isSMTP();
            $mail->Host       = getenv('SMTP_HOST') ?: 'smtp.gmail.com';
            $mail->SMTPAuth   = true;
            $mail->Username   = getenv('SMTP_USER');
            $mail->Password   = getenv('SMTP_PASS');
            $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
            $mail->Port       = getenv('SMTP_PORT') ?: 587;

            // Recipients
            $mail->setFrom(getenv('SMTP_USER') ?: 'no-reply@fixgo.com', 'FixGo Team');
            $mail->addAddress($email);

            // Content
            $mail->isHTML(true);
            $mail->Subject = $subject;
            $mail->Body    = $message;
            $mail->AltBody = strip_tags(str_replace(['<br>', '<br><br>'], ["\n", "\n\n"], $message));

            $mail->send();
            return true;
        } catch (Exception $e) {
            error_log("SMTP Send Error: {$mail->ErrorInfo}");
            return false;
        }
    }
}
