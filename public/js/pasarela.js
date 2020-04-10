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
            //var data = JSON.parse(response);
            console.log(response);
            var win = window.open(response, '_blank');
            // Cambiar el foco al nuevo tab (punto opcional)
            win.focus();

        },
        error: function (error) {
            alert("error en pasarela");
        }
    });
}
