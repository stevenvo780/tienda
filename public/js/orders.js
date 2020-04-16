window.onload = function () {

    var uri = "http://localhost:8000/profile/orders";

    $.ajax({
        url: uri,
        method: 'get',
        success: function (response) {
            var data = JSON.parse(response);
            document.getElementById('orders').innerHTML = "";
            data.forEach(orden => {
                console.log(orden);
                if (orden.error != null) {
                    var status;
                    switch (orden.pedido.status) {
                        case "CREATED":
                            status = "En proceso";
                            break;
                        case "REJECTED":
                            status = "Fallo";
                            break;
                        case "PAYED":
                            status = "Pagado";
                            break;

                        default:
                            break;
                    }
                    let ordenHtml = `<div class='col-md-3 col-center'>
                                <div
                                    class='card'>
                                    <div class='card-body'>
                                    <h4 class='card-title'>${status}</h4>
                                    </div>

                                    <div class='card-body'id='ordenId_${orden.pedido.id}'>
                                        <h5 class='card-title'>Numero de orden: ${orden.pedido.requestId}</h5>
                                        <a href='javascript:;' onclick="informacion(${orden.pedido.id});" role='button' class='btn btn-success'>Mas informacion</a>
                                    </div>
                                </div>
                                <br>
                            </div>`;

                    $(ordenHtml).appendTo('#orders');

                    if (orden.pedido.status == "CREATED") {
                        let boton = `<hr><a href='${orden.pedido.url}' role='button' class='btn btn-success'>Volver a la compra</a>`;
                        var targeta = "ordenId_" + orden.pedido.id;
                        $(boton).appendTo('#' + targeta);
                    }
                } else {
                    console.log(orden);
                }

            });
        },
        error: function (error) {
            console.log(error);
        }
    });

};

function informacion(id) {
    var uri = "http://localhost:8000/profile/order/" + id;

    $.ajax({
        url: uri,
        method: 'get',
        success: function (response) {
            var data = JSON.parse(response);

            var status;
            switch (data.status) {
                case "CREATED":
                    status = "En proceso";
                    break;
                case "REJECTED":
                    status = "Fallo";
                    break;
                case "PAYED":
                    status = "Pagado";
                    break;

                default:
                    break;
            }
            let ordenHtml = `
                            <div class='card'>
                                    <div class='card-body'>
                                    <h4 class='card-title'>${status}</h4>
                                    </div>

                                    <div class='card-body'id='ordenId_${data.id}'>
                                        <h5 class='card-title'>Numero de orden: ${data.requestId}</h5>
                                        <div style="height: 300px; overflow: auto;" id="productosPasarela" ></div>
                                        <h2 id="totalInformacion"></h2>
                                    </div>
                                <br>
                            </div>`;
            document.getElementById('modalBody').innerHTML = ordenHtml;
            var total = 0;
            data.productos.forEach(producto => {
                var priceTotal = producto.tax + producto.price;
                total += priceTotal * producto.qty;
                var productoPrint = `<h4>Cantidad: ${producto.qty}</h4>
                                                        <p>${producto.category}</p>
                                                        <p>${producto.name}</p>
                                                        <p>SKU: ${producto.sku}</p>
                                                        <p>PRECIO: ${producto.price} $</p>
                                                        <p>IVA: ${producto.tax} $</p>
                                                        <h5>TOTAL PRODUCTO: ${priceTotal} $</h5>
                                                        <hr>`;
                $(productoPrint).appendTo('#productosPasarela');

                $('#informacion').modal('show');

            });
            totalPrint = `TOTAL: ${total} $`;
            document.getElementById('totalInformacion').innerHTML = totalPrint;

        },
        error: function (error) {
            console.log(error);
        }
    });
}