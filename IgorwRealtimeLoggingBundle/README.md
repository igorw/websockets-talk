# IgorwRealtimeLoggingBundle

Send Symfony2 logs to a broadcast server using ZeroMQ.

Example config:

    parameters:
        igorw_realtime_logging.handler.host: "tcp://127.0.0.1:5555"


    monolog:
        handlers:
            zeromq:
                type: service
                id: igorw_realtime_logging.handler
