window.onload = function () {
    var table = $('#productos').DataTable({
        "language": {
            "decimal": "",
            "emptyTable": "Cargando ...",
            "info": "Mostrando _START_ a _END_ de _TOTAL_ Entradas",
            "infoEmpty": "Mostrando 0 to 0 of 0 Entradas",
            "infoFiltered": "(Filtrado de _MAX_ total entradas)",
            "infoPostFix": "",
            "thousands": ",",
            "lengthMenu": "Mostrar _MENU_ Entradas",
            "loadingRecords": "Cargando...",
            "processing": "Procesando...",
            "search": "Buscar:",
            "zeroRecords": "Sin resultados encontrados",
            "paginate": {
                "first": "Primero",
                "last": "Ultimo",
                "next": "Siguiente",
                "previous": "Anterior"
            }
        },
        "responsive": true,
        "order": [[1, 'desc']],
        "destroy": true,
    });
    var uri = "http://localhost:8000/profile/orders";

    $.ajax({
        url: uri,
        method: 'get',
        success: function (response) {
            var data = JSON.parse(response);
            table = $('#productos').DataTable({
                "language": {
                    "decimal": "",
                    "emptyTable": "No hay información",
                    "info": "Mostrando _START_ a _END_ de _TOTAL_ Entradas",
                    "infoEmpty": "Mostrando 0 to 0 of 0 Entradas",
                    "infoFiltered": "(Filtrado de _MAX_ total entradas)",
                    "infoPostFix": "",
                    "thousands": ",",
                    "lengthMenu": "Mostrar _MENU_ Entradas",
                    "loadingRecords": "Cargando...",
                    "processing": "Procesando...",
                    "search": "Buscar:",
                    "zeroRecords": "Sin resultados encontrados",
                    "paginate": {
                        "first": "Primero",
                        "last": "Ultimo",
                        "next": "Siguiente",
                        "previous": "Anterior"
                    }
                },
                "responsive": true,
                "destroy": true,
            });
            data.forEach(orden => {
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
                var boton = ` <a href='javascript:;' onclick="informacion(${orden.pedido.id});" role='button' class='btn btn-success'>Mas informacion</a>`;
                table.row.add([
                    orden.pedido.requestId,
                    orden.pedido.customerName,
                    orden.pedido.customerEmail,
                    boton
                ]);

            });
            table.draw();
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
