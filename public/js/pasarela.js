function pasarela(idProducto) {

    var uri = "http://localhost:8000/profile/preorder/" + idProducto;

    $.ajax({
        url: uri,
        method: 'get',
        success: function (response) {
            var data = JSON.parse(response);
            var priceTotal = data.producto.tax + data.producto.price;

            let ordenCuerpo = ` <div>
                                    <h3>Informacion del producto</h3>
                                    <p>${data.producto.category}</p>
                                    <p>${data.producto.name}</p>
                                    <p>STOCK: ${data.producto.sku}</p>
                                    <p>PRECIO: ${data.producto.price}</p>
                                    <p>IVA: ${data.producto.tax}</p>
                                    <h3>TOTAL: ${priceTotal}</h3>
                                </div>
                                <br>
                                <h3>Informacion de usuario</h3>
                                <div>
                                    <p>NOMBRE: ${data.user.nombre}</p>
                                    <p>CORREO: ${data.user.email}</p>
                                    <p>MOVIL: ${data.user.mobile}</p>
                                </div>`;

            let boton = `<a href='javascript:;' onclick="pagar(${data.producto.id});" role="button" class="btn btn-success">Confirmar</a>`;
            $(boton).appendTo('#botonDiv');
            document.getElementById('ordenDiv').innerHTML = ordenCuerpo;
            $('#pasarela').modal('show');

        },
        error: function (error) {
            console.log(error);
        }
    });

}

function pagar(idProducto) {


    var uri = "http://localhost:8000/profile/pasarela";
    var data = {
        "idProducto": { 0: idProducto },
    };
    $.ajax({
        url: uri,
        data: data,
        method: 'post',
        success: function (response) {

            var data = JSON.parse(response);
            if (data.error != null) {
                console.log(data.error);
            } else {
                data.forEach(producto => {
                    var priceTotal = producto.items[0].tax + producto.items[0].price;
                    let ordenCuerpo = ` <div>
                                            <h3>Informacion producto</h3>
                                            <p>${producto.items[0].category}</p>
                                            <p>${producto.items[0].name}</p>
                                            <p>STOCK: ${producto.items[0].sku}</p>
                                            <p>PRECIO: ${producto.items[0].price}</p>
                                            <p>IVA: ${producto.items[0].tax}</p>
                                            <h3>TOTAL: ${priceTotal}</h3>
                                        </div>
                                        <br>
                                        <h3>Informacion de usuario</h3>
                                        <div>
                                            <p>NOMBRE: ${producto.pedido.customerName}</p>
                                            <p>CORREO: ${producto.pedido.customerEmail}</p>
                                            <p>MOVIL: ${producto.pedido.customerMobile}</p>
                                        </div>
                                        <br>
                                        <p>LA ORDEN EXPIRA EL: ${producto.expira}</p>`;

                    let boton = `<a href='${producto.url}' role='button' class='btn btn-success'>Pagar</a> <button type='button' class='btn btn-secondary' data-dismiss='modal'>Close</button>`;

                    document.getElementById('ordenDiv').innerHTML = ordenCuerpo;
                    document.getElementById('botonDiv').innerHTML = boton;
                });

            }

        },
        error: function (error) {
            console.log(error);
        }
    });
}
