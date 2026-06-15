<?php
header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit;
}

// Получаем данные
$name = trim($_POST['name'] ?? '');
$phone = trim($_POST['phone'] ?? '');
$service = trim($_POST['service'] ?? '');
$address = trim($_POST['address'] ?? '');
$message = trim($_POST['message'] ?? '');

// Валидация
if (empty($name) || empty($phone)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Заповніть обов\'язкові поля']);
    exit;
}

// Email получателя
$to = 'timursemenuta@gmail.com';
$subject = 'Заявка з сайту від ' . $name;

// Формируем тело письма
$body = "Нова заявка з сайту:\n\n";
$body .= "Ім'я: $name\n";
$body .= "Телефон: $phone\n";
$body .= "Послуга/Техніка: $service\n";
$body .= "Адреса об'єкта: $address\n";
$body .= "Коментар: $message\n";
$body .= "\n---\n";
$body .= "Дата: " . date('d.m.Y H:i:s') . "\n";

// Заголовки
$headers = "From: noreply@specteh.com\r\n";
$headers .= "Reply-To: $to\r\n";
$headers .= "Content-Type: text/plain; charset=UTF-8\r\n";

// Отправляем
$sent = mail($to, $subject, $body, $headers);

if ($sent) {
    echo json_encode(['success' => true, 'message' => 'Заявку надіслано!']);
} else {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Помилка відправки']);
}
?>
