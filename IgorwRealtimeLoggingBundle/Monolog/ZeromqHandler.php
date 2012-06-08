<?php

namespace Igorw\RealtimeLoggingBundle\Monolog;

use Monolog\Handler\AbstractProcessingHandler;

class ZeromqHandler extends AbstractProcessingHandler
{
    protected $host;
    protected $socket;

    public function __construct($host)
    {
        $this->host = $host;
    }

    private function connectSocket()
    {
        if ($this->socket) {
            return;
        }

        $context = new \ZMQContext();
        $this->socket = $context->getSocket(\ZMQ::SOCKET_PUB);
        $this->socket->connect($this->host);
    }

    /**
     * {@inheritdoc}
     */
    protected function write(array $record)
    {
        $this->connectSocket();

        $this->socket->send((string) $record['formatted']);
    }
}
