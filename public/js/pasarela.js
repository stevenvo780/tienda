function pasarela(idProducto) {
    

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
            console.log(data);
            if (data.error != null) {
                console.log(data.error);
            } else {
                data.forEach(producto => {
                    var productos = producto.items.productos;
                    console.log(productos);

                    let ordenCuerpo = ` <p class='card-title'>${producto.items[0].category}</p>
                                        <p class='card-text'>${producto.items[0].name}</p>
                                        <p>STOCK: ${producto.items[0].sku}</p>
                                        <h3>TOTAL: ${producto.items[0].price}</h3>`;

                    let boton = `<a href='${producto.url}' role="button" class="btn btn-success">Pagar</a>`;
                    $(boton).appendTo('#botonDiv');
                     document.getElementById('ordenDiv').innerHTML = ordenCuerpo; 
                });
                $('#pasarela').modal('show');
            }
            //var texto = "" + response;
            /*
            if (texto.substring(0, 5) == "https") {
                var win = window.open(response, '_blank');
                win.focus();
            }
            */

        },
        error: function (error) {
            console.log(error);
        }
    });
}
