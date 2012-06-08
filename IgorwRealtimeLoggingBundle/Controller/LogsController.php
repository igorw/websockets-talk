<?php

namespace Igorw\RealtimeLoggingBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;

class LogsController extends Controller
{
    public function indexAction()
    {
        return $this->render('IgorwRealtimeLoggingBundle:Logs:index.html.twig');
    }
}
