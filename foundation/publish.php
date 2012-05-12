<?php

if (!isset($argv[1])) {
    echo "Usage: php publish.php message\n";
    exit;
}

$context = new ZMQContext();

$pub = $context->getSocket(ZMQ::SOCKET_PUB);
$pub->connect('tcp://127.0.0.1:5555');

// msg could be: {'type' => 'debug', 'data' => ['foo', 'bar', 'baz']}

$msg = trim($argv[1]);
$pub->send($msg);
