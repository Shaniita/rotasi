<?php
$data = json_encode([]);
$options = [
  'http' => [
    'header'  => "Content-type: application/json\r\n",
    'method'  => 'POST',
    'content' => $data
  ]
];
$context = stream_context_create($options);
$result = file_get_contents('http://192.168.1.50:3000/start-rotasi', false, $context);
echo $result;
?>
