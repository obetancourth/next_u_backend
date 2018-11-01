let express     = require('express'),
    router      = express.Router();

const {obtenerBienes, obtenerCiudades, obtenerTipos} = require('./models/bienesmodel');

router.get('/getall', (req, res, next) => {
    return res.status(200).json(obtenerBienes());
  }
); // end getall
router.get('/ciudades', (req, res, next) => {
    return res.status(200).json(obtenerCiudades());
  }
); // end ciudades
router.get('/tipo', (req, res, next) => {
    return res.status(200).json(obtenerTipos());
  }
); // end tipo
router.get('/parametros', (req, res, next) => {
    return res.status(200).json({tipos:obtenerTipos(), ciudades:obtenerCiudades()});
  }
); // end tipo

router.post('/get', (req,res)=>{
    console.log(req.body);
    let {ciudad, tipo, precioIni, precioFin} = req.body;
    precioIni = parseFloat(precioIni);
    precioFin = parseFloat(precioFin);
    return res.status(200).json(obtenerBienes(ciudad, tipo, precioIni, precioFin));
});


module.exports = router;
