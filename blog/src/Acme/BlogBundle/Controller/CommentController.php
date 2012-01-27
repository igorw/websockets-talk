<?php

namespace Acme\BlogBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Response;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Template;
use Acme\BlogBundle\Entity\Comment;
use Acme\BlogBundle\Form\CommentType;

/**
 * @Route("/blog")
 */
class CommentController extends Controller
{
    /**
     * @Route("/{id}/comments", name="blog_comment_create")
     * @Method("post")
     */
    public function createAction($id)
    {
        $em = $this->getDoctrine()->getEntityManager();

        $post = $em->getRepository('AcmeBlogBundle:Post')->find($id);

        if (!$post) {
            throw $this->createNotFoundException('Unable to find Post entity.');
        }

        $comment = new Comment();
        $comment->setPost($post);

        $request = $this->getRequest();
        $form    = $this->createForm(new CommentType(), $comment);
        $form->bindRequest($request);

        if ($form->isValid()) {
            $em = $this->getDoctrine()->getEntityManager();
            $em->persist($comment);
            $em->flush();

            $this->publishCommentCreate($comment);

            $renderedRow = $this->renderView('AcmeBlogBundle:Comment:row.html.twig', array('comment' => $comment));
            return new Response($renderedRow, 201);

        }

        return new Response('{}', 400, array('Content-Type' => 'application/json'));
    }

    private function publishCommentCreate(Comment $comment)
    {
        $context = new \ZMQContext();

        $sock = $context->getSocket(\ZMQ::SOCKET_PUB);
        $sock->connect('tcp://127.0.0.1:5555');

        $renderedRow = $this->renderView('AcmeBlogBundle:Comment:row.html.twig', array('comment' => $comment));

        $postId = $comment->getPost()->getId();
        $msg = json_encode(array(
            'type' => "post.$postId.comment.create",
            'data' => $renderedRow,
        ));
        $sock->send($msg);
    }
}
