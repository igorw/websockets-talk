<?php

namespace Acme\BlogBundle\Form;

use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilder;

class CommentType extends AbstractType
{
    public function buildForm(FormBuilder $builder, array $options)
    {
        $builder
            ->add('name')
            ->add('email', 'email')
            ->add('body', 'textarea')
        ;
    }

    public function getName()
    {
        return 'acme_blogbundle_commenttype';
    }
}
