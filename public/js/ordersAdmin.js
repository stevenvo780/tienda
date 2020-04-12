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

                table.row.add([
                    orden.items[0].category,
                    orden.items[0].name,
                    orden.items[0].price,
                    orden.items[0].sku,
                    orden.items[0].category,
                    orden.pedido.customerEmail,
                    orden.pedido.customerName,
                ]);

            });
            table.draw();
        },
        error: function (error) {
            console.log(error);
        }
    });

};
