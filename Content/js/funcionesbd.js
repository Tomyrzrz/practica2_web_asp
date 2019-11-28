$(document).ready(function () {

    $('#btn_registro').click(function () {
        var nombre = $('#name_user').val();
        var email = $('#email_user').val();
        var pass = $('#password_user1').val();
        var id = $('#name_user').val() + Date.now();
        var usuario = {
            name_user: nombre,
            email_user: email,
            password_user: pass,
            id_user: id
        }
        registroBD(usuario);
    });
    
    function registroBD(user) {
        firebase.database().ref('Users/' + user.id_user).set(user);
        limpiar();
    }

    $(document).on('click', '.delete-person', function () {
        console.log("Eliminando en proceso.....");
        var personid = $(this).attr('id');
        firebase.database().ref('Users/' + personid).remove();
    });

    $(document).on('click', '.update-person', function () {
        var idd = $(this).parent().parent().find(".person-id").text();
        $('#id_user').val(idd);

        var nombre = $(this).parent().parent().find(".person-name").text();
        $('#edit_name_user').val(nombre);

        var emiall = $(this).parent().parent().find(".person-email").text();
        $('#edit_email_user').val(emiall);

        var passss = $(this).parent().parent().find(".person-passw").text();
        $('#edit_password_user1').val(passss);
        $('#edit_password_user2').val(passss);
    });

    $('#edit_button').click(function () {
        var usuario = {
            name_user: $('#edit_name_user').val(),
            email_user: $('#edit_email_user').val(),
            password_user: $('#edit_password_user1').val(),
            id_user: $('#id_user').val()
        }
        registroBD(usuario);
    });

});

//Creacion de la funcion de Registrar
function registrar() {
    let nombre = document.getElementById('name_user').value;
    let email = document.getElementById('email_user').value;
    let password1 = document.getElementById('password_user1').value;
    let password2 = document.getElementById('password_user2').value;

    if (password1 === password2) {
        firebase.auth().createUserWithEmailAndPassword(email, password1)
            .catch(function (error) {
                var errorCode = error.code;
                var errorMessage = error.message;
                console.log(errorCode + ": " + errorMessage);
            })
        observador();
    }

}

function iniciarSesion() {
    let email = document.getElementById('email_userl').value;
    let password = document.getElementById('password_userl').value;

    if (email == "" || password == "") {
        document.getElementById('message').innerHTML = "Debes llenar ambos campos";
    } else {
        firebase.auth().signInWithEmailAndPassword(email, password)
            .catch(function (error) {
                let message = error.message;
                let code = error.code;
                document.getElementById('message').innerHTML = code + ": " + message;
            })
        observador();
        //Tarea
        // Diseñar una vista para administrar los usuarios
        // Limpiar los campos del login
    }

}

function observador() {
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            var email = user.email;
            var id = user.uid;
            console.log(email + id);
            document.getElementById('logout').style.display = 'inline';
            document.getElementById('nombre_user').style.display = 'inline';
            document.getElementById('nombre_user').innerHTML = "Welcome: " + email;
        } 
    });
}




function limpiar() {
    document.getElementById("email_user").value = "";
    document.getElementById('password_user2').value ="";
    document.getElementById('password_user1').value ="";
    document.getElementById('name_user').value = "";
    alert("Registro correcta!");
}


function salir() {
    firebase.auth().signOut()
        .then(function () {
            document.getElementById('logout').style.display = 'none';
            document.getElementById('nombre_user').style.display = 'none';
            console.log("Saliste");
        })
        .catch(function (error) {
            console.log("Error:" + error);
        })
}

var databaseref = firebase.database().ref('Users');

databaseref.on('value', function (snapshot) {
    var codigoHTML = '<table class="table table-dark"> <thead> <tr>';
    codigoHTML += '<th scope="col"> ID</th>';
    codigoHTML += '<th scope="col"> NAME</th>';
    codigoHTML += '<th scope="col"> EMAIL</th>';
    codigoHTML += '<th scope="col">PASSWORD</th>';
    codigoHTML += '</tr> </thead> <tbody>';
    snapshot.forEach(function (childsnapshot) {
        var usuario = childsnapshot.val();
        codigoHTML += '<tr>';
        codigoHTML += '<td><span class="person-id">' + usuario.id_user + '</span></td>';
        codigoHTML += '<td><span class="person-name">' + usuario.name_user + '</span></td>';
        codigoHTML += '<td><span class="person-email">' + usuario.email_user + '</span></td>';
        codigoHTML += '<td><span class="person-passw">' + usuario.password_user + '</span></td>';
        codigoHTML += '<td><button type="button" class="btn btn-danger delete-person" id="' + usuario.id_user + '"> Delete </button></td>';
        codigoHTML += '<td><button type="button" class="btn btn-info update-person" id="' + usuario.id_user + '" data-toggle="modal" data-target="#editUser" data-idperson="' + usuario.id_user + '" data-nombreperson="' + usuario.name_user + '" data-emailperson="' + usuario.email_user + '" data-passwperson="'+usuario.password_user+'"> Update </button> </td> ';
        codigoHTML += '</tr>';
    });
    codigoHTML += '</tbody></table>';
    $('#datosbd').html(codigoHTML);
});
