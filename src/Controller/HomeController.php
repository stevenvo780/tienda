<?php

namespace App\Controller;

use App\Entity\Pedido;
use App\Entity\Producto;
use DateTime;
use Dnetix\Redirection\PlacetoPay;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;

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
            'login' => '6dd490faf9cb87a9862245da41170ff2',
            'tranKey' => '024h1IlD',
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
            'expiration' => date('c', strtotime('+1 days')),
            'returnUrl' => 'http://localhost:8000/profile/productos',
            'ipAddress' => '127.0.0.1',
            'userAgent' => 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/52.0.2743.116 Safari/537.36',
        ];

        try {

            $response = $placetopay->request($request);
            dump($response);
            $userLogueado = $this->getUser();
            $pedido = new Pedido();
            $hoy = date("Y-m-d H:i:s");
            $hoy = new DateTime($hoy);

            $pedido->setCustomerName($userLogueado->getNombre());
            $pedido->setCustomerEmail($userLogueado->getEmail());
            $pedido->setCustomerMobile($userLogueado->getMobile());
            $pedido->setCustomerMobile($userLogueado->getMobile());
            $pedido->setrequestId($response->requestId());
            $pedido->setUrl($response->requestId());

            //poner los 3 tipos indicados en el examen
            if ($response->status()->status() == "OK") {
                $pedido->setStatus("CREATED");
            } elseif ($response->status()->status() == "FAILED") {
                $pedido->setStatus("FAILED");
            }

            $pedido->setCreatedAt($hoy);
            $pedido->setUpdatedAt($hoy);

            if ($response->isSuccessful()) {

                $url = "" . $response->processUrl();
                $pedido->setUrl($url);

                try {
                    $em->persist($pedido);
                    $em->flush();
                } catch (\Throwable $th) {
                    dump($th);
                }
                return new Response($url);

            } else {
                try {
                    $em->persist($pedido);
                    $em->flush();
                } catch (\Throwable $th) {
                    dump($th);
                }
                return new Response($response->status()->message());
            }

        } catch (Exception $e) {
            //return new Response($e->getMessage());
            dump($e->getMessage());
        }

        return new Response(0);
    }

    public function orders(EntityManagerInterface $em)
    {
        $userLogueado = $this->getUser();
        $pedidos = $em->getRepository(Pedido::class)->findBy(['customerEmail' => $userLogueado->getEmail()]);
        $placetopay = new PlacetoPay([
            'login' => '6dd490faf9cb87a9862245da41170ff2',
            'tranKey' => '024h1IlD',
            'url' => 'https://test.placetopay.com/redirection/',
            'rest' => [
                'timeout' => 10,
                'connect_timeout' => 10,
            ],
        ]);
        $orders = [];
        foreach ($pedidos as $key => $pedido) {
            try {
                $response = $placetopay->query($pedido->getRequestId());
                dump($response);
                if ($response->isSuccessful()) {

                    if ($response->status()->isApproved()) {
                        $statusNew = "PAYED";
                        $pedido->setStatus($statusNew);
                    } else {
                        if ($response->status()->status() == "REJECTED") {
                            $statusNew = "REJECTED";
                            $pedido->setStatus($statusNew);
                        }
                    }

                    try {
                        $em->persist($pedido);
                        $em->flush();
                        array_push($orders, $pedido);
                    } catch (\Throwable $th) {
                        dump($th);
                    }

                } else {
                    dump($response->status()->message());
                }
            } catch (Exception $e) {
                dump($e->getMessage());
            }

        }
        dump($orders);
        return $this->render('home/orders.html.twig', [
            'orders' => $orders,
        ]);
    }

}
