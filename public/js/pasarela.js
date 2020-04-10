function pasarela() {
    $('#pasarela').modal('show');

    var uri = "http://localhost:8000/profile/pasarela";
    var data = {
        "login": "6dd490faf9cb87a9862245da41170ff2",
        "tranKey": "024h1IlD",
    };


    $.ajax({
        url: uri,
        data: data,
        method: 'post',
        success: function (response) {
            console.log(response);
            var texto = "" + response;
            
            if (texto.substring(0, 5) == "https") {
                var win = window.open(response, '_blank');
                win.focus();
            }


        },
        error: function (error) {
            console.log(error);
        }
    });
}
