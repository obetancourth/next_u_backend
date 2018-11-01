//Inicializador del elemento Slider
$(document).ready(function(){
  setSearch()
  getParametros();
  $("#ciudad, #tipo").on('change', function(e){getBienes();});
  $("#buscar").on('click', function(e){getBienes();});
});

$("#rangoPrecio").ionRangeSlider({
  type: "double",
  grid: false,
  min: 0,
  max: 100000,
  from: 1000,
  to: 20000,
  prefix: "$",
  onFinish: function(data){
    setPrecios(data.from, data.to);
  }
})

function setSearch() {
  let busqueda = $('#checkPersonalizada')
  busqueda.on('change', (e) => {
    if (this.customSearch == false) {
      this.customSearch = true
    } else {
      this.customSearch = false
    }
    $('#personalizada').toggleClass('invisible')
  })
}


// PLantillas para ser usadas al obtener los datos
var htmlTemplate ='<div class="card horizontal"><div class="card-image"><img src="img/home.jpg">' +
          '</div><div class="card-stacked"><div class="card-content"><div><b>Direccion: </b><p>:direccion:</p>' +
          '</div><div><b>Ciudad: </b><p>:ciudad:</p></div><div><b>Telefono: </b><p>:telefono:</p></div><div>' +
          '<b>Código postal: </b><p>:codigopostal:</p></div><div><b>Precio: </b><p>:precio:</p></div><div><b>Tipo: </b><p>:tipo:</p>' +
          '</div></div><div class="card-action right-align"><a href="#">Ver más</a></div></div></div>';

var optionsTemplate = '<option value=":opt:">:opt:</option>';
// Para manejar los valores al finalizar manipular el rango de precios
var _precioIni =1000;
var _precioFin =20000;
function setPrecios(_from, _to){
  _precioIni = _from;
  _precioFin = _to;
  getBienes();
}

/*
Solo de referencia visual para ayuda con los replace
"Id" : 35,
"Direccion" : "500-6214 Tempus, Street",
"Ciudad" : "Miami",
"Telefono" : "168-671-0953",
"Codigo_Postal" : "5574",
"Tipo" : "Casa de Campo",
"Precio" : "$62,069"
*/

// Obtiene del server los datos de ciudades y de tipos
function getParametros(){
  $.ajax(
    {
      "method" :"GET",
      "url": "/bienes/parametros",
      "type":"json"
    }
  )
  .done(function(data, txt, xhr){
      if(data.ciudades && true){
        $("#tipo").show().append(
          data.tipos.map(function(tipo,i){
            return optionsTemplate.replace(/:opt:/g, tipo);
          }).join("")
        );
        $("#ciudad").show().append(
          data.ciudades.map(function(ciudad,i){
            return optionsTemplate.replace(/:opt:/g, ciudad);
          }).join("")
        );
      }
  })
  .catch(function(){
    alert("Error al cargar las ciudades y tipos");
  });

}
//Obtiene los bienes segun los establecido en el ui
function getBienes(){
  var options = {
    method:"GET",
    "url": "/bienes/getall",
    "type":"json",
  }
  // si por parametros customizados cambiar las opciones
  if ($("#checkPersonalizada").prop("checked")){
    options.method="POST";
    options.data= {
      ciudad:$("#ciudad").val(),
      tipo:$("#tipo").val(),
      precioIni:_precioIni,
      precioFin:_precioFin
    };
    options.url="bienes/get"
  }
  $.ajax(options)
  .done(function(data,txt,xhr){
    if(Array.isArray(data)){
      $(".lista").html(
        data.map(function(bien,i){
          return htmlTemplate.replace(":direccion:",bien.Direccion)
              .replace(':ciudad:',bien.Ciudad)
              .replace(':telefono:',bien.Telefono)
              .replace(':codigopostal:',bien.Codigo_Postal)
              .replace(':precio:', bien.Precio)
              .replace(':tipo:',bien.Tipo)
        }).join("")
      );
    }
  })
  .catch(function(){
    alert("Error al cargar documentos");
  });
}
