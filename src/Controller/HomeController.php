<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Routing\Annotation\Route;
use App\Entity\Producto;
use Doctrine\ORM\EntityManagerInterface;

class HomeController extends AbstractController
{
    public function index()
    {
        return $this->render('home/index.html.twig', [
            'controller_name' => 'HomeController'
        ]);
    }

    public function productos(EntityManagerInterface $em)
    {
        $productos = $em->getRepository(Producto::class)->findAll();

        return $this->render('home/productos.html.twig', [
            'productos' => $productos
        ]);
    }
}
