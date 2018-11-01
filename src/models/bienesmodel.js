let fs = require('fs'),
  path = require('path');

let data      = [],
    ciudades  = [],
    tipos     = []

const dataFile = path.join(__dirname,"data.json"),
  init = ()=>{
  // si ya habiamos inicializado no lo volvemos a cargar
  if(data.length>0) return;
  // si es primera vez se lee el archivo y se procesa para poder ser usado.
  fs.readFile(dataFile, 'utf-8', (err, jsonString) => {
    if (err) {
      console.log(err);
      process.exit(1);
    } else {
      data = JSON.parse(jsonString);
      // Ordenando por Ciudad para sacar las ciudades en un arreglo
      let sortData = data.sort((bien, bien2)=>{
        if (bien.Ciudad === bien2.Ciudad ) return 0;
        if (bien.Ciudad > bien2.Ciudad ) return 1;
        if (bien.Ciudad < bien2.Ciudad ) return -1;
      });
      let anterior = '';
      ciudades = sortData.filter((bien, i)=>{
          if(bien.Ciudad === anterior) return false;
          anterior = bien.Ciudad;
          return true;
      }).map((bien, i)=>{
        return bien.Ciudad;
      });
      // Sacando los Tipos Distintos
      sortData = data.sort((bien, bien2)=>{
        if (bien.Tipo === bien2.Tipo ) return 0;
        if (bien.Tipo > bien2.Tipo ) return 1;
        if (bien.Tipo < bien2.Tipo ) return -1;
      });
      anterior = '';
      tipos = sortData.filter((bien, i)=>{
          if(bien.Tipo === anterior) return false;
          anterior = bien.Tipo;
          return true;
      }).map((bien, i)=>{
        return bien.Tipo;
      });

      //Agregando un precio comparable con numero extrayendo el simbolo $
      // y cambiando la coma por punto para convertirlo a un flotante
      data = data.map((bien, i)=>{
        let _prcfloat = parseFloat(bien.Precio.substring(1).replace(",","."));
        let _bien = {...bien, "PrecioDecimal" : _prcfloat};
        return _bien;
      });
    }
  });
};
init();

module.exports = {
    obtenerBienes :(ciudad="", tipo="", precioIni=0, precioFin=99999)=>{
      // Si los parámetros viene por defecto solo devolver todos los bienes
      // para evitar procesamiento innecesario
      if(ciudad==="" && tipo==="" && precioIni === 0 && precioFin === 99999){
        return data;
      }
      // Si algunos de los parametros cambio realizar el filtro para 
      // devolver solo lo deseado.
      return data.filter((bien, i)=>{
        return ((bien.Ciudad == ciudad || ciudad == "")
            && (bien.Tipo == tipo || tipo == "")
            && bien.PrecioDecimal >= precioIni
            && bien.PrecioDecimal <= precioFin);
      });
    },
    obtenerCiudades : ()=>{
      return ciudades;
    },
    obtenerTipos: ()=>{
      return tipos;
    },
}
