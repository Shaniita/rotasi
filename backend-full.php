<?php
if ($_SERVER['REQUEST_METHOD'] == 'POST') {

    $today = date('Y-m-d');

    $startDate = date('Y-m-d', strtotime('-2 days'));

    $payload = json_encode([
        "startDate" => $startDate,
        "endDate" => $today,
        "dept" => "null",
        "divisi" => "null"
    ]);

    $options = [
        'http' => [
            'header'  => "Content-type: application/json\r\n",
            'method'  => 'POST',
            'content' => $payload
        ]
    ];

    $context = stream_context_create($options);
    $result = file_get_contents('http://192.168.1.50:3000/start-rotasi', false, $context);

    if ($result === FALSE) {
        echo json_encode(["success" => false, "message" => "Gagal menghubungi API rotasi"]);
    } else {
        echo $result;
    }

} else {
    echo json_encode(["success" => false, "message" => "Method tidak diizinkan"]);
}
?>
