const items = [];

function añadirProducto(idProducto) {
    var uri = "http://localhost:8000/profile/producto/list/" + idProducto;

    $.ajax({
        url: uri,
        method: 'get',
        success: function (response) {
            var data = JSON.parse(response);
            var count = 0;
            items.forEach(item => {
                if (item.item.id == data.id) {
                    count++;
                    item.count++;
                }
            });
            if (count == 0) {
                items.push({
                    'count': 1,
                    'item': data
                });
            }
            cargarCarrito();
        },
        error: function (error) {
            console.log(error);
        }
    });
}

function sacarProducto(idProducto) {

    for (let i = 0; i < items.length; i++) {
        const item = items[i];

        if (item && item.item.id == idProducto) {
            if (item.count > 1) {
                item.count--;
            } else {
                delete items[i];
            }
        }
    }

    cargarCarrito();
}

function cargarCarrito() {
    var total = 0;
    var itemRender = "";
    items.forEach(item => {
        var priceTotal = (item.item.tax + item.item.price) * item.count;

        itemRender += `<div id="${item.item.id}" class="col-sm-3">
                            <p>X ${item.count}</p>
                            <p>${item.item.category}</p>
                            <p>${item.item.name}</p>
                            <p>PRECIO: ${priceTotal}</p>
                            <h3> <a href='javascript:;' onclick="sacarProducto(${item.item.id});" role="button" class="btn btn-danger">X</a> </h3> 
                        </div>`;
        total += priceTotal;
    });

    document.getElementById('carrito').innerHTML = itemRender;
    document.getElementById('total').innerHTML = total;
}

function pasarela() {

    var uri = "http://localhost:8000/profile/preorder";
    
    const productos = [];
    items.forEach(item => {
        productos.push({
            'count': item.count,
            'itemId': item.item.id,
        });
    });
    if (productos.length < 1) {
        return null;
    }
    var data = {
        "productos": productos,
    };
    $.ajax({
        url: uri,
        data: data,
        method: 'post',
        success: function (response) {
            var data = JSON.parse(response);
            var total = 0;
            var ordenCuerpo = `<div>
                                    <p>NOMBRE: ${data.user.nombre}</p>
                                    <p>CORREO: ${data.user.email}</p>
                                    <p>MOVIL: ${data.user.mobile}</p>
                                </div>
                                <div style="height: 300px; overflow: auto;" id="productosPasarela" ></div>
                                <br>
                                <h2 id="totalPasarela"></h2>`;
            document.getElementById('ordenDiv').innerHTML = ordenCuerpo;
            data.productos.forEach(producto => {
                var priceTotal = producto.item.tax + producto.item.price;
                total += priceTotal * producto.cantidad;
                var productoPrint = `<h4>Cantidad: ${producto.cantidad}</h4>
                                    <p>${producto.item.category}</p>
                                    <p>${producto.item.name}</p>
                                    <p>SKU: ${producto.item.sku}</p>
                                    <p>PRECIO: ${producto.item.price} $</p>
                                    <p>IVA: ${producto.item.tax} $</p>
                                    <h5>TOTAL PRODUCTO: ${priceTotal} $</h5>
                                    <hr>`;
                $(productoPrint).appendTo('#productosPasarela');

            });
            totalPrint = `TOTAL: ${total} $`;
            var boton = `<a href='javascript:;' onclick="pagar();" role="button" class="btn btn-success">Confirmar</a> <button type='button' class='btn btn-secondary' data-dismiss='modal'>Close</button>`;
            document.getElementById('botonDiv').innerHTML = boton;
            document.getElementById('totalPasarela').innerHTML = totalPrint;
            $('#pasarela').modal('show');

        },
        error: function (error) {
            console.log(error);
        }
    });

}

function pagar() {

    var uri = "http://localhost:8000/profile/pasarela";
    const productos = [];
    items.forEach(item => {
        productos.push({
            'count': item.count,
            'itemId': item.item.id,
        });
    });
    var data = {
        "productos": productos,
    };
    $.ajax({
        url: uri,
        data: data,
        method: 'post',
        success: function (response) {

            var data = JSON.parse(response);
            if (data.error !== "") {
                console.log(data.error);
            } else {
                let expira = `<br> <p>LA ORDEN EXPIRA EL: ${data.expira}</p>`;
                let boton = `<a href='${data.url}' role='button' class='btn btn-success'>Pagar</a> <button type='button' class='btn btn-secondary' data-dismiss='modal'>Close</button>`;

                $(expira).appendTo('#ordenDiv');
                document.getElementById('botonDiv').innerHTML = boton;
            }
        },
        error: function (error) {
            console.log(error);
        }
    });
}
