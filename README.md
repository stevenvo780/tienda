# PLACETOPLAY
Prueba para placetopay

Credenciales de administrador 

- email: tienda@tienda.com
- password: admin85204561583#

despliegue:

 - $ bin/deploy.sh

El despliegue requiere de las configuraciones de APACHE recomendadas para symfony

- https://symfony.com/doc/current/setup/web_server_configuration.html


PUNTOS:

- 1° "Una donde el cliente proporcione los datos necesarios para generar una nueva
orden"  -> En el registro del usuario se captan los datos del usuario

- 2° "Una donde se presente un resumen de la orden y se permita proceder a pagar"-> Al dar al boton comprar de un articulo se hace un resumen de la orden antes de generarla

- 3° "Una donde el cliente pueda ver el estado de su orden, si está pagada muestre el
mensaje de que está pagada, de lo contrario, un botón que permita reintentarlo
debe estar presente" -> En la vista de pedidos de el usuario se pueden ver todas sus ordenes y su estado

- 4° "Una donde se pueda ver el listado de todas las órdenes que tiene la tienda"-> En la vista de pedidos de administrador se pueden ver todas las ordenes
