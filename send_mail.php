<?php
/**
 * The Polaris Homestay - Contact Form Handler (Hostinger Optimized)
 */

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // 1. Configuration - UPDATE YOUR EMAIL HERE
    $to = "thepolariskochi@gmail.com"; 
    $subject = "New Stay Inquiry: " . htmlspecialchars($_POST['name']);

    // 2. Sanitize and Collect Data
    $name    = filter_var($_POST['name'], FILTER_SANITIZE_STRING);
    $email   = filter_var($_POST['email'], FILTER_SANITIZE_EMAIL);
    $phone   = filter_var($_POST['phone'], FILTER_SANITIZE_STRING);
    $message = filter_var($_POST['message'], FILTER_SANITIZE_STRING);

    // 3. Email Body Construction
    $body = "--- New Inquiry Details ---\n\n";
    $body .= "Name: $name\n";
    $body .= "Email: $email\n";
    $body .= "Phone: $phone\n\n";
    $body .= "Message:\n$message\n\n";
    $body .= "---------------------------\n";
    $body .= "Sent from thepolariskochi.com Contact Form";

    // 4. Headers
    $headers = "From: webmaster@thepolariskochi.com" . "\r\n"; // Often required by Hostinger to be a domain-based email
    $headers .= "Reply-To: $email" . "\r\n";
    $headers .= "X-Mailer: PHP/" . phpversion();

    // 5. Send Mail
    if (mail($to, $subject, $body, $headers)) {
        // Success: Redirect back to index with success flag
        header("Location: index.html?status=success#contact");
    } else {
        // Error: Redirect back with error flag
        header("Location: index.html?status=error#contact");
    }
} else {
    // If accessed directly, redirect to home
    header("Location: index.html");
}
exit();
?>
