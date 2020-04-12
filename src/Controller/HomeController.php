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
use Symfony\Component\Serializer\Encoder\JsonEncoder;
use Symfony\Component\Serializer\Encoder\XmlEncoder;
use Symfony\Component\Serializer\Normalizer\ObjectNormalizer;
use Symfony\Component\Serializer\Serializer;

class HomeController extends AbstractController
{
    public function index()
    {
        if ($this->getUser()) {
            $rol = $this->getUser()->getRoles();
            if ($rol[0] == "ROLE_ADMIN") {
                return $this->redirectToRoute('producto_index');
            } elseif ($rol[0] == "ROLE_USER") {
                return $this->render('home/index.html.twig', [
                    'controller_name' => 'HomeController',
                ]);
            }
        }

        return $this->redirectToRoute('app_logout');
    }

    public function productos(EntityManagerInterface $em)
    {
        $productos = $em->getRepository(Producto::class)->findAll();

        return $this->render('home/productos.html.twig', [
            'productos' => $productos,
        ]);
    }

    public function pedidos()
    {
        return $this->render('home/orders.html.twig');
    }

    public function pedidosAdmin()
    {
        return $this->render('admin/orders.html.twig');
    }

    public function pasarela(EntityManagerInterface $em, Request $request)
    {
        $pedido = new Pedido();
        $data = [];
        $json = $request->request->all();
        $userLogueado = $this->getUser();
        $placetopay = new PlacetoPay([
            'login' => '6dd490faf9cb87a9862245da41170ff2',
            'tranKey' => '024h1IlD',
            'url' => 'https://test.placetopay.com/redirection/',
            'rest' => [
                'timeout' => 10,
                'connect_timeout' => 10,
            ],
        ]);

        $reference = 'REF_' . time();

        $items = [];
        $itemsId = [];
        $precioFinal = 0;
        foreach ($json['idProducto'] as $idProducto) {
            $producto = $em->getRepository(Producto::class)->find($idProducto);
            array_push($items, [
                "sku" => $producto->getSku(),
                "name" => $producto->getName(),
                "category" => $producto->getCategory(),
                "qty" => $producto->getQty(),
                "price" => $producto->getPrice(),
                "tax" => $producto->getTax(),
            ]);
            array_push($itemsId, $producto->getId());
            $precioFinal += $producto->getPrice();
        }

        $pedido->setProductos($itemsId);

        $request = [
            'payment' => [
                'reference' => $reference,
                "name" => $userLogueado->getNombre(),
                "surname" => "Yost",
                "email" => $userLogueado->getEmail(),
                'description' => 'Testing payment',
                "mobile" => $userLogueado->getMobile(),
                'amount' => [
                    'currency' => 'COP',
                    'total' => $precioFinal,
                ],
            ],
            "buyer" => [
                "name" => $userLogueado->getNombre(),
                "email" => $userLogueado->getEmail(),
                "mobile" => $userLogueado->getMobile(),
            ],
            "items" => $items,
            'expiration' => date('c', strtotime('+1 days')),
            'returnUrl' => 'http://localhost:8000/profile/pedidos',
            'ipAddress' => '127.0.0.1',
            'userAgent' => 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/52.0.2743.116 Safari/537.36',
        ];

        $error = "";
        $url = "";
        try {

            $response = $placetopay->request($request);

            $hoy = date("Y-m-d H:i:s");
            $hoy = new DateTime($hoy);

            $pedido->setCustomerName($userLogueado->getNombre());
            $pedido->setCustomerEmail($userLogueado->getEmail());
            $pedido->setCustomerMobile($userLogueado->getMobile());
            $pedido->setrequestId($response->requestId());
            $pedido->setUrl($response->requestId());

            //añadir productos

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

            } else {
                $error = $response->status()->message();
            }

        } catch (Exception $e) {
            $error = $e->getMessage();
        }

        try {
            $em->persist($pedido);
            $em->flush();

        } catch (\Throwable $th) {
            $error = "ERROR AL GUARDAR EL PEDIDO";
        }

        array_push($data, [
            'url' => $url,
            'error' => $error,
            'pedido' => $pedido,
            'items' => $items,
        ]);

        $encoders = [new XmlEncoder(), new JsonEncoder()];
        $normalizers = [new ObjectNormalizer()];
        $serializer = new Serializer($normalizers, $encoders);

        return new Response($serializer->serialize($data, 'json'));

        return new Response(0);
    }

    public function orders(EntityManagerInterface $em)
    {
        $orders;

        if ($this->getUser()) {
            $rol = $this->getUser()->getRoles();
            if ($rol[0] == "ROLE_ADMIN") {
                $userLogueado = $this->getUser();
                $pedidos = $em->getRepository(Pedido::class)->findAll();
                $orders = $this->statusOrders($pedidos);
                dump($this->getUser());
            } elseif ($rol[0] == "ROLE_USER") {
                $userLogueado = $this->getUser();
                $pedidos = $em->getRepository(Pedido::class)->findBy(['customerEmail' => $userLogueado->getEmail()]);
                $orders = $this->statusOrders($pedidos);
            }
        }

        $encoders = [new XmlEncoder(), new JsonEncoder()];
        $normalizers = [new ObjectNormalizer()];
        $serializer = new Serializer($normalizers, $encoders);

        return new Response($serializer->serialize($orders, 'json'));
    }

    private function statusOrders($pedidos)
    {
        $em = $this->getDoctrine()->getManager();
        $placetopay = new PlacetoPay([
            'login' => '6dd490faf9cb87a9862245da41170ff2',
            'tranKey' => '024h1IlD',
            'url' => 'https://test.placetopay.com/redirection/',
            'rest' => [
                'timeout' => 40,
                'connect_timeout' => 40,
            ],
        ]);
        $orders = [];
        foreach ($pedidos as $key => $pedido) {
            try {
                $response = $placetopay->query($pedido->getRequestId());

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
                        $productos = $pedido->getProductos();
                        $items = [];
                        foreach ($productos as $key => $productoId) {
                            $producto = $em->getRepository(Producto::class)->find($productoId);
                            array_push($items, $producto);

                        }
                        array_push($orders, ['pedido' => $pedido, 'items' => $items]);
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
        return $orders;
    }

}
