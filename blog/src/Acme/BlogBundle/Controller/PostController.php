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

        $entities = $em->getRepository('AcmeBlogBundle:Post')->findAll();

        return array('entities' => $entities);
    }

    /**
     * Finds and displays a Post entity.
     *
     * @Route("/{id}/show", name="blog_show")
     * @Template()
     */
    public function showAction($id)
    {
        $em = $this->getDoctrine()->getEntityManager();

        $entity = $em->getRepository('AcmeBlogBundle:Post')->find($id);

        if (!$entity) {
            throw $this->createNotFoundException('Unable to find Post entity.');
        }

        $deleteForm = $this->createDeleteForm($id);

        $commentForm = $this->createForm(new CommentType());

        return array(
            'entity'      => $entity,
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
        $entity = new Post();
        $form   = $this->createForm(new PostType(), $entity);

        return array(
            'entity' => $entity,
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
        $entity  = new Post();
        $request = $this->getRequest();
        $form    = $this->createForm(new PostType(), $entity);
        $form->bindRequest($request);

        if ($form->isValid()) {
            $em = $this->getDoctrine()->getEntityManager();
            $em->persist($entity);
            $em->flush();

            return $this->redirect($this->generateUrl('blog_show', array('id' => $entity->getId())));
            
        }

        return array(
            'entity' => $entity,
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

        $entity = $em->getRepository('AcmeBlogBundle:Post')->find($id);

        if (!$entity) {
            throw $this->createNotFoundException('Unable to find Post entity.');
        }

        $editForm = $this->createForm(new PostType(), $entity);
        $deleteForm = $this->createDeleteForm($id);

        return array(
            'entity'      => $entity,
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

        $entity = $em->getRepository('AcmeBlogBundle:Post')->find($id);

        if (!$entity) {
            throw $this->createNotFoundException('Unable to find Post entity.');
        }

        $editForm   = $this->createForm(new PostType(), $entity);
        $deleteForm = $this->createDeleteForm($id);

        $request = $this->getRequest();

        $editForm->bindRequest($request);

        if ($editForm->isValid()) {
            $em->persist($entity);
            $em->flush();

            return $this->redirect($this->generateUrl('blog_edit', array('id' => $id)));
        }

        return array(
            'entity'      => $entity,
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
            $entity = $em->getRepository('AcmeBlogBundle:Post')->find($id);

            if (!$entity) {
                throw $this->createNotFoundException('Unable to find Post entity.');
            }

            $em->remove($entity);
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
