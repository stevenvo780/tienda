window.onload = function () {

    var uri = "http://localhost:8000/profile/orders";

    $.ajax({
        url: uri,
        method: 'get',
        success: function (response) {
            var data = JSON.parse(response);
            console.log(data);
            document.getElementById('orders').innerHTML = ""; 
            data.forEach(orden => {
                console.log(orden);
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
                                        <h4 class='card-title'>${orden.items[0].category}</h4>
                                        <h3 class='card-text'>${orden.items[0].name}</h3>
                                        <h1>${orden.items[0].price}</h1>
                                        <p>${orden.items[0].sku}</p>           
                                    </div>
                                </div>
                                <br>
                            </div>`;

                $(ordenHtml).appendTo('#orders');

                if (orden.pedido.status == "CREATED") {
                    let boton = `<a href='${orden.pedido.url}' role='button' class='btn btn-success'>Volver a la compra</a>`;
                    var targeta = "ordenId_" + orden.pedido.id;
                    $(boton).appendTo('#' + targeta);
                }

            });
        },
        error: function (error) {
            console.log(error);
        }
    });

};
