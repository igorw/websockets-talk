<?php

namespace Acme\BlogBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Template;
use Acme\BlogBundle\Entity\Post;
use Acme\BlogBundle\Form\CommentType;
use Acme\BlogBundle\Form\PostType;

/**
 * Post controller.
 *
 * @Route("/blog")
 */
class PostController extends Controller
{
    /**
     * Lists all Post entities.
     *
     * @Route("/", name="blog")
     * @Template()
     */
    public function indexAction()
    {
        $em = $this->getDoctrine()->getEntityManager();

        $posts = $em->getRepository('AcmeBlogBundle:Post')->findBy(array(), array('createdAt' => 'desc'));

        return array('posts' => $posts);
    }

    /**
     * Finds and displays a Post entity.
     *
     * @Route("/{id}", name="blog_show", requirements={"id"="\d+"})
     * @Template()
     */
    public function showAction($id)
    {
        $em = $this->getDoctrine()->getEntityManager();

        $post = $em->getRepository('AcmeBlogBundle:Post')->find($id);

        if (!$post) {
            throw $this->createNotFoundException('Unable to find Post entity.');
        }

        $deleteForm = $this->createDeleteForm($id);

        $commentForm = $this->createForm(new CommentType());

        return array(
            'post'        => $post,
            'delete_form' => $deleteForm->createView(),
            'comment_form' => $commentForm->createView(),
        );
    }

    /**
     * Displays a form to create a new Post entity.
     *
     * @Route("/new", name="blog_new")
     * @Template()
     */
    public function newAction()
    {
        $post = new Post();
        $form   = $this->createForm(new PostType(), $post);

        return array(
            'post'   => $post,
            'form'   => $form->createView()
        );
    }

    /**
     * Creates a new Post entity.
     *
     * @Route("/create", name="blog_create")
     * @Method("post")
     * @Template("AcmeBlogBundle:Post:new.html.twig")
     */
    public function createAction()
    {
        $post  = new Post();
        $request = $this->getRequest();
        $form    = $this->createForm(new PostType(), $post);
        $form->bindRequest($request);

        if ($form->isValid()) {
            $em = $this->getDoctrine()->getEntityManager();
            $em->persist($post);
            $em->flush();

            return $this->redirect($this->generateUrl('blog_show', array('id' => $post->getId())));

        }

        return array(
            'post'   => $post,
            'form'   => $form->createView()
        );
    }

    /**
     * Displays a form to edit an existing Post entity.
     *
     * @Route("/{id}/edit", name="blog_edit")
     * @Template()
     */
    public function editAction($id)
    {
        $em = $this->getDoctrine()->getEntityManager();

        $post = $em->getRepository('AcmeBlogBundle:Post')->find($id);

        if (!$post) {
            throw $this->createNotFoundException('Unable to find Post entity.');
        }

        $editForm = $this->createForm(new PostType(), $post);
        $deleteForm = $this->createDeleteForm($id);

        return array(
            'post'        => $post,
            'edit_form'   => $editForm->createView(),
            'delete_form' => $deleteForm->createView(),
        );
    }

    /**
     * Edits an existing Post entity.
     *
     * @Route("/{id}/update", name="blog_update")
     * @Method("post")
     * @Template("AcmeBlogBundle:Post:edit.html.twig")
     */
    public function updateAction($id)
    {
        $em = $this->getDoctrine()->getEntityManager();

        $post = $em->getRepository('AcmeBlogBundle:Post')->find($id);

        if (!$post) {
            throw $this->createNotFoundException('Unable to find Post entity.');
        }

        $editForm   = $this->createForm(new PostType(), $post);
        $deleteForm = $this->createDeleteForm($id);

        $request = $this->getRequest();

        $editForm->bindRequest($request);

        if ($editForm->isValid()) {
            $em->persist($post);
            $em->flush();

            return $this->redirect($this->generateUrl('blog_show', array('id' => $id)));
        }

        return array(
            'post'        => $post,
            'edit_form'   => $editForm->createView(),
            'delete_form' => $deleteForm->createView(),
        );
    }

    /**
     * Deletes a Post entity.
     *
     * @Route("/{id}/delete", name="blog_delete")
     * @Method("post")
     */
    public function deleteAction($id)
    {
        $form = $this->createDeleteForm($id);
        $request = $this->getRequest();

        $form->bindRequest($request);

        if ($form->isValid()) {
            $em = $this->getDoctrine()->getEntityManager();
            $post = $em->getRepository('AcmeBlogBundle:Post')->find($id);

            if (!$post) {
                throw $this->createNotFoundException('Unable to find Post entity.');
            }

            $em->remove($post);
            $em->flush();
        }

        return $this->redirect($this->generateUrl('blog'));
    }

    private function createDeleteForm($id)
    {
        return $this->createFormBuilder(array('id' => $id))
            ->add('id', 'hidden')
            ->getForm()
        ;
    }
}
