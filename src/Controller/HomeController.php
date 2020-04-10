<?php

namespace App\Controller;

use App\Entity\Producto;
use Dnetix\Redirection\PlacetoPay;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Symfony\Component\Serializer\Encoder\JsonEncoder;
use Symfony\Component\Serializer\Encoder\XmlEncoder;
use Symfony\Component\Serializer\Normalizer\ObjectNormalizer;
use Symfony\Component\Serializer\Serializer;

class HomeController extends AbstractController
{
    public function index()
    {
        return $this->render('home/index.html.twig', [
            'controller_name' => 'HomeController',
        ]);
    }

    public function productos(EntityManagerInterface $em)
    {
        $productos = $em->getRepository(Producto::class)->findAll();

        return $this->render('home/productos.html.twig', [
            'productos' => $productos,
        ]);
    }

    public function pasarela(EntityManagerInterface $em, Request $request)
    {
        $json = $request->request->all();
        
        $placetopay = new PlacetoPay([
            'login' => $json['login'],
            'tranKey' => $json['tranKey'],
            'url' => 'https://test.placetopay.com/redirection/',
            'rest' => [
                'timeout' => 10,
                'connect_timeout' => 10,
            ],
        ]);
        
        $reference = 'TEST_' . time();
        $request = [
            'payment' => [
                'reference' => $reference,
                'description' => 'Testing payment',
                'amount' => [
                    'currency' => 'USD',
                    'total' => 120,
                ],
            ],
            'expiration' => date('c', strtotime('+2 days')),
            'returnUrl' => 'http://localhost:8000/profile/productos',
            'ipAddress' => '127.0.0.1',
            'userAgent' => 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/52.0.2743.116 Safari/537.36',
        ];

        try {
            
            $response = $placetopay->request($request);
            
            if ($response->isSuccessful()) {
                
                $response->processUrl();
                
                $url = "" . $response->processUrl();
                dump($url);
                
                return new Response($url);
            } else {
                
                return new Response($response->status()->message());
                
                
            }
            dump($response);
        } catch (Exception $e) {
            dump($e->getMessage());
        }
        

        
        return new Response(0);
    }
}
