<?php

namespace App\Form;

use App\Entity\Producto;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\Extension\Core\Type\NumberType;

class ProductoType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder
            ->add('sku', TextType::class, array('attr'  => array('class' => 'form-control')))
            ->add('name', TextType::class, array('attr'  => array('class' => 'form-control')))
            ->add('category', TextType::class,  array('attr'  => array('class' => 'form-control')))
            ->add('qty', TextType::class, array('attr'  => array('class' => 'form-control')))
            ->add('price', NumberType::class, array('attr'  => array('class' => 'form-control')))
            ->add('tax', TextType::class, array('attr'  => array('class' => 'form-control')))
            ->add('description', TextType::class, array('attr'  => array('class' => 'form-control')))
        ;
    }

    public function configureOptions(OptionsResolver $resolver)
    {
        $resolver->setDefaults([
            'data_class' => Producto::class,
        ]);
    }
}
