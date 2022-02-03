import L from 'leaflet';

//Declaramos las variables
var aId = new Array();
var aMarcadores = new Array();
var bExiste;

var BlackIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-black.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

var BlueIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

var RedIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

var YellowIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-yellow.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

var GreenIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

//Añadimos onClick en los botones
document.getElementById("btnAcceso").addEventListener("click", Acceso)
document.getElementById("btnCerrarSesion").addEventListener("click", CerrarSesion);

//Llamamos a la funcion que confirma si tenemos token (nos lleva a la pagina del tiempo sin necesidad de loguearse) en caso de no tenerlo no tendremos que loguear
Token();
function Token(){
    //Hacemos un fetch a la API del tiempo con el JWToken que tengamos 
    fetch("http://localhost:5000/api/Tiempo", {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem("JWTtoken")}`,
        }
    }).then(response => {
    //si el token es correcto
      if (response.ok) {
        $("#TrozoMapa").css("display", "block");
        ObtencionDeDatosAPI();
    //si el token es incorrecto
      }else{
        $("#TrozoLogin").css("display", "block");
      }
    })
}

//Funcion que borra el token y actualiza la pagina
function CerrarSesion(){
    localStorage.removeItem("JWTtoken");
    location.reload();
}

//Funcion para Iniciar sesion con los datos introducidos en el formulario
function Acceso() {
  fetch("http://localhost:5000/Users/authenticate", {
      method: "POST",
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify({
          "username": $("#typeUsernameX-2").val(),
          "password": $("#typePasswordX-2").val(),
      }),
      //Responde con el JSON (usuario, contraseña, token...)
  }).then(response => {
        if (response.ok) {
            return response.json();
        }
        //Añadimos al localstorage el token y ocultamos el login y mostramos el mapa y llamamos a la funcion que añade los datos
      }).then(e => {
          localStorage.setItem("JWTtoken", e.token)
          $("#TrozoLogin").css("display", "none");
          $("#TrozoMapa").css("display", "block");
          ObtencionDeDatosAPI();
      }).catch(err => {
          console.log("Usuario o contraseña incorrectos");
      });
}
//Funcion que obtiene los datos de la API del tiempo
function ObtencionDeDatosAPI() {
    fetch("http://localhost:5000/api/Tiempo", {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem("JWTtoken")}`,
        }
    }).then(response => response.json()).then(aBalizas => {
        //Creamos el mapa
        var Mapa = L.map('map').setView([43.34578351332376, -1.7965434243182008], 11);
        L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 18 }).addTo(Mapa);

        //Funcion que crea las balizas segun los datos recibidos
        CrearBalizas();
        function CrearBalizas() {
            //Creamos la balizas
            for (var i = 0; i < aBalizas.length; i++) {
                var Balizas = L.marker([aBalizas[i].gpxY, aBalizas[i].gpxX], { idMarcador: aBalizas[i].id, Provincia: aBalizas[i].provincia }).addTo(Mapa);
                Balizas.bindPopup(`${aBalizas[i].nombre}`);
                Balizas.on("click", Agregar);
                HoverPopUp(Balizas);
                //Cambiamos el color de las balizas segun su tipo
                if (aBalizas[i].tipoEstacion == "BUOY") {
                    Balizas.setIcon(RedIcon);
                } else if (aBalizas[i].tipoEstacion == "METEOROLOGICAL") {
                    Balizas.setIcon(BlueIcon);
                } else if (aBalizas[i].tipoEstacion == "GAUGING") {
                    Balizas.setIcon(YellowIcon);
                } else {
                    Balizas.setIcon(GreenIcon);
                }
                aMarcadores.push(Balizas);
            }
        }

        //Funcion que agrega una tarjeta cuando se hace clic en un marcador
        function Agregar(e) {
            var sImprimirDiv = "";

            //Cogemos el nombre de las balizas
            var sObtenerNombre = e.target.getPopup().getContent();

            //Con el nombre cogemos el id
            for (var i = 0; i < aBalizas.length; i++) {
                if (sObtenerNombre == aBalizas[i].nombre) {
                    var sObtenerID = aBalizas[i].id;
                    break;
                }
            }

            //Comprobamos que el ID seleccionado no esta ya en el array
            if (aId.length < 4) {
                for (var i = 0; i < aId.length; i++) {
                    if (aId[i] == sObtenerID) {
                        bExiste = true;
                        break;
                    }
                    else {
                        bExiste = false;
                    }
                }

                //Si no existe imprimimos una tarjeta y añadimos al array de los IDs el nuevo
                if (!bExiste) {
                    //Cambiamos el color
                    e.target.setIcon(BlackIcon);
                    aId.push(sObtenerID);
                    //Añadimos al localstorage el array
                    localStorage.IDs = JSON.stringify(aId);

                    //Imprimimos la tarjeta con sus datos
                    for (var i = 0; i < aBalizas.length; i++) {
                        if (aBalizas[i].id == sObtenerID) {
                            var sID = aBalizas[i].id;
                            sImprimirDiv += `<div class="tarjetas col" id="${sID}">
                                                    <button type="button" class="btn-close btncerrar" aria-label="Close"></button>
                                                    <h4>${aBalizas[i].nombre}</h4>
                                                    <div id="contenedorDatos">
                                                        <div class="divsDatos MostrarPrincipio" id="TemperaturaOculto">
                                                            <h3>Temperatura</h3>`;
                            if (aBalizas[i].temperatura == "Sin datos") {
                                sImprimirDiv += `<p id="DatosObtenidos">${aBalizas[i].temperatura}</p>`;
                            } else {
                                sImprimirDiv += `<p id="DatosObtenidos">${aBalizas[i].temperatura} °C</p>`;
                            }
                            sImprimirDiv += `</div>
                                                        <div class="divsDatos MostrarPrincipio" id="HumedadOculto">
                                                            <h3>Humedad</h3>`;
                            if (aBalizas[i].humedad == "Sin datos") {
                                sImprimirDiv += `<p id="DatosObtenidos">${aBalizas[i].humedad}</p>`;
                            } else {
                                sImprimirDiv += `<p id="DatosObtenidos">${aBalizas[i].humedad} %</p>`;
                            }
                            sImprimirDiv += `</div>
                                                        <div class="divsDatos" id="LluviaOculto">
                                                            <h3>Precipitación</h3>`;
                            if (aBalizas[i].precipitacion == "Sin datos") {
                                sImprimirDiv += `<p id="DatosObtenidos">${aBalizas[i].precipitacion}</p>`;
                            } else {
                                sImprimirDiv += `<p id="DatosObtenidos">${aBalizas[i].precipitacion} mm=l/m²</p>`;
                            }
                            sImprimirDiv += `</div>
                                                        <div class="divsDatos" id="VientoOculto">
                                                            <h3>Velocidad del Viento</h3>`;
                            if (aBalizas[i].viento == "Sin datos") {
                                sImprimirDiv += `<p id="DatosObtenidos">${aBalizas[i].viento}</p>`;
                            } else {
                                sImprimirDiv += `<p id="DatosObtenidos">${aBalizas[i].viento} km/h</p>`;
                            }
                            sImprimirDiv += `
                                                        </div>
                                                    </div>
                                                </div>`;
                        }
                    }
                    document.getElementById("Contenido").innerHTML += sImprimirDiv;
                }
            }
            Jquery(aBalizas);
        }

        //Imprimimos el select para el fltro
        var sImprimirSelect = `<select id="select" name="select">
                        <option value="Todos">Todos</option>
                        <option value="Bizkaia">Bizkaia</option>
                        <option value="Gipuzkoa">Gipuzkoa</option>
                        <option value="Álava">Álava</option>
                        </select>
                        `;
        document.getElementById("Provincias").innerHTML = sImprimirSelect;

        //Creamos el onChange para que el select, al seleccionar una nueva opcion ejecute lo siguiente
        $("select").on("change", function () {
            //Cogemos el valor del select
            var sProvinciaSeleccionada = document.getElementById("select").value;
            
            //Limpiamos el mapa
            aMarcadores.forEach(i => {
                Mapa.removeLayer(i);
            });

            aMarcadores = [];

            //Si seleccionamos todo creamos las balizas normalmente
            if (sProvinciaSeleccionada == "Todos") {
                CrearBalizas();
            //Si hemos seleccionamos otra opcion solo añadimos las que tengan la provincia deseada
            } else {
                for (var i = 0; i < aBalizas.length; i++) {
                    if (aBalizas[i].provincia == sProvinciaSeleccionada) {
                        let Balizas = L.marker([aBalizas[i].gpxY, aBalizas[i].gpxX], { idMarcador: aBalizas[i].id }).bindPopup(`${aBalizas[i].nombre}`).addTo(Mapa);
                        Balizas.on("click", Agregar);
                        if (aBalizas[i].tipoEstacion == "BUOY") {
                            Balizas.setIcon(RedIcon);
                        } else if (aBalizas[i].tipoEstacion == "METEOROLOGICAL") {
                            Balizas.setIcon(BlueIcon);
                        } else if (aBalizas[i].tipoEstacion == "GAUGING") {
                            Balizas.setIcon(YellowIcon);
                        } else {
                            Balizas.setIcon(GreenIcon);
                        }
                        HoverPopUp(Balizas);
                        aMarcadores.push(Balizas);
                    }
                }
            }
            //Cambiamos la baliza a color negro
            for (var i = 0; i < aId.length; i++) {
                for (var j = 0; j < aMarcadores.length; j++) {
                    if (aMarcadores[j].options.idMarcador == aId[i]) {
                        aMarcadores[j].setIcon(BlackIcon);
                    }
                }
            }
        });
        RevisarLocalStorage(aBalizas);
    })
};

//Funcion para que las balizas tengan un hover al pasar el raton por encima
function HoverPopUp(Balizas){
    Balizas.on("mouseover", function (e) {
        this.openPopup();
    });

    Balizas.on("mouseout", function (e) {
        this.closePopup();
    });
}
//Jquery para minimizar el mapa
$(document).ready(function () {
    $("svg").on("click", function () {
        $("#Provincias").slideToggle(750);
        $("#map").slideToggle(750);
        $("#colores").slideToggle(750);
    });
});

//Funcion que agrupa varios tipos de JQuery
function Jquery(aBalizas) {

    //Apareceran al cargar la pagina
    $(".MostrarPrincipio").addClass("Mostrar");

    //Eliminar el div al hacer click en la x
    $(".btn-close").click(function (e) {
        var id = e.target.closest(".tarjetas").id;

        //for para eliminar del array donde guardamos los IDs el id de la tarjeta que hemos cerrado
        for (var i = 0; i < aId.length; i++) {
            if (aId[i] == id) {
                aId.splice(i, 1);
                console.log("Borrado");
            }
        }

        //Volvemos a subir el array con el id eliminado
        localStorage.IDs = JSON.stringify(aId);

        //Cambiamos el icono negro por el original cuando se cierra la tarjeta
        for (var i = 0; i < aMarcadores.length; i++) {
            if (aMarcadores[i].options.idMarcador == id) {
                if (aBalizas[i].tipoEstacion == "BUOY") {
                    aMarcadores[i].setIcon(RedIcon);
                } else if (aBalizas[i].tipoEstacion == "METEOROLOGICAL") {
                    aMarcadores[i].setIcon(BlueIcon);
                } else if (aBalizas[i].tipoEstacion == "GAUGING") {
                    aMarcadores[i].setIcon(YellowIcon);
                } else {
                    aMarcadores[i].setIcon(GreenIcon);
                }
            }
        }
        //La clase tarjetas mas cercana a la x la elimina
        $(this).closest(".tarjetas").remove();
    })

    //Funcion para poder desplazar las tarjetas
    $(function () {
        $("#Contenido").sortable();
    });


    //Hacemos los filtros draggables
    $(function () {
        //Se crea un clone del icono y no vuelve a su posicion original
        $(".icono").draggable({ helper: "clone" });

        //Al soltar los iconos en las tarjetas se añade el parametro correspondiente
        $(".tarjetas").droppable({
            drop: function (event, ui) {
                var idFiltros = ui.draggable.attr("id").substring(1);
                console.log(idFiltros);
                //Si se arrastra la papelera borramos todo de la tarjeta
                if (idFiltros == "Papelera") {
                    $(this).find(`#TemperaturaOculto`).removeClass("Mostrar");
                    $(this).find(`#HumedadOculto`).removeClass("Mostrar");
                    $(this).find(`#LluviaOculto`).removeClass("Mostrar");
                    $(this).find(`#VientoOculto`).removeClass("Mostrar");
                }
                //Si se arrastra cualquier otro se muestra si no esta ya
                else {
                    $(this).find(`#${idFiltros}Oculto`).addClass("Mostrar");
                }
            }
        });
    });
}

//Funcion que  mira en el storage para crear tarjetas al crear la pagina
function RevisarLocalStorage(aBalizas) {
    document.getElementById("Contenido").innerHTML = "";
    var sImprimirLocalStorage = "";
    var aNombre = new Array();

    //Si no hay localstorage se crea
    if (localStorage.IDs == undefined) {
        IDs = [];
        localStorage.IDs = JSON.stringify(IDs);
        var allaves = new Array();
    } else {
        //Cogemos el array del localstorage
        var allaves = JSON.parse(localStorage.IDs);
    }

    //Cogemos el nombre de la baliza con el id guardado en el storage
    for (var i = 0; i < allaves.length; i++) {
        for (var j = 0; j < aBalizas.length; j++) {
            if (aBalizas[j].id == allaves[i]) {
                aNombre[i] = aBalizas[j].nombre;
            }
        }
    }

    //Lo añadimos al array de los ids
    for (var i = 0; i < allaves.length; i++) {
        aId.push(allaves[i]);
    }
    //Cambiamos la baliza a color negro
    for (var i = 0; i < aId.length; i++) {
        for (var j = 0; j < aMarcadores.length; j++) {
            if (aMarcadores[j].options.idMarcador == aId[i]) {
                aMarcadores[j].setIcon(BlackIcon);
            }
        }
    }

    //Creamos las tarjetas segun el storage
    for (var i = 0; i < allaves.length; i++) {
        for (var j = 0; j < aBalizas.length; j++) {
            if (aBalizas[j].id == allaves[i]) {
                sImprimirLocalStorage += `<div class="tarjetas col" id="${allaves[i]}">
                                            <button type="button" class="btn-close btncerrar" aria-label="Close"></button>
                                            <h4>${aBalizas[j].nombre}</h4>
                                            <div class="divsDatos MostrarPrincipio" id="TemperaturaOculto">
                                                <h3>Temperatura</h3>`;
                if (aBalizas[j].temperatura == "Sin datos") {
                    sImprimirLocalStorage += `<p id="DatosObtenidos">${aBalizas[j].temperatura}</p>`;
                } else {
                    sImprimirLocalStorage += `<p id="DatosObtenidos">${aBalizas[j].temperatura} °C</p>`;
                }
                sImprimirLocalStorage += `</div>
                                        <div class="divsDatos MostrarPrincipio" id="HumedadOculto">
                                            <h3>Humedad</h3>`;
                if (aBalizas[j].humedad == "Sin datos") {
                    sImprimirLocalStorage += `<p id="DatosObtenidos">${aBalizas[j].humedad}</p>`;
                } else {
                    sImprimirLocalStorage += `<p id="DatosObtenidos">${aBalizas[j].humedad} %</p>`;
                }
                sImprimirLocalStorage += `</div>
                                        <div class="divsDatos" id="LluviaOculto">
                                            <h3>Precipitación</h3>`;
                if (aBalizas[j].precipitacion == "Sin datos") {
                    sImprimirLocalStorage += `<p id="DatosObtenidos">${aBalizas[j].precipitacion}</p>`;
                } else {
                    sImprimirLocalStorage += `<p id="DatosObtenidos">${aBalizas[j].precipitacion} mm=l/m²</p>`;
                }
                sImprimirLocalStorage += ` </div>
                                        <div class="divsDatos" id="VientoOculto">
                                            <h3>Velocidad del Viento</h3>`;
                if (aBalizas[j].viento == "Sin datos") {
                    sImprimirLocalStorage += `<p id="DatosObtenidos">${aBalizas[j].viento}</p>`;
                } else {
                    sImprimirLocalStorage += `<p id="DatosObtenidos">${aBalizas[j].viento} km/h</p>`;
                }
                sImprimirLocalStorage += `</div>
                                    </div>`;
            }

        }
    }
    document.getElementById("Contenido").innerHTML += sImprimirLocalStorage;
    Jquery(aBalizas);
}

