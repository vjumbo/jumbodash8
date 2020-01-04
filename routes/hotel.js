const express = require('express');
const router = express.Router([]);
const mongoose = require('mongoose');
const cors = require('cors');
const Hotel = require('../models/hotel');
const hotelTypes = require("../def/hotelTypes");
const TipoTarifaTypes = require("../def/tipoTarifaTypes");
const {validToken} = require('../jwt');

router.options('*', cors());


router.get('/', cors(), async (req, res, next) => {
    const valid = await validToken(req.headers);
    if (!valid) return res.sendStatus(403);
  Hotel.find({}, 'nombre segmetohotel categoria region descripcion sistema', (err, hoteles) => {
      if (!hoteles) {
          res.json([]);
      } else {
          if (err) return next(err);
          res.json(hoteles);
      }
  }).populate('sistema.usuarioCreador', 'username')
      .populate('sistema.usuarioAsignado', 'username')
      /*.populate('habitaciones').populate('servicios')
      .populate('serviciosNoIncluidos').populate('penalidades')*/;
});

router.get('/hoteltypes', cors(), async (req, res, next) => {
    const valid = await validToken(req.headers);
    if (!valid) return res.sendStatus(403);
  res.json(hotelTypes);
});

router.get('/tipotarifatypes', cors(), async (req, res, next) => {
    const valid = await validToken(req.headers);
    if (!valid) return res.sendStatus(403);
    res.json(TipoTarifaTypes);
});

router.get('/:id', cors(), async (req, res, next) => {
    const valid = await validToken(req.headers);
    if (!valid) return res.sendStatus(403);
  Hotel.findById(req.params.id,  (err, hotel) => {
    if (err) return next(err);
    res.json(hotel);
  }).populate('habitaciones').populate('servicios')
      .populate('serviciosNoIncluidos').populate('penalidades').
  populate('tipoTarifa.tipoHabitacion');
});

router.get('/hotelesby/:search/:field', cors(), async (req, res, next)=> {
    const valid = await validToken(req.headers);
    if (!valid) return res.sendStatus(403);
  const user = {};
  const filters = req.params.search.split('##');
  const values = req.params.field.split('##');
  filters.forEach((value, indx) => {
    user[value] = values[indx];
  });
  Hotel.findOne(user,  (err, post) => {
    if (err) return next(err);
    res.json(post);
  }).populate('habitaciones').populate('servicios')
      .populate('serviciosNoIncluidos').populate('penalidades');
});

router.post('/', cors(),async (req, res, next) => {
    const valid = await validToken(req.headers);
    if (!valid) return res.sendStatus(403);
  Hotel.create(req.body,  (err, post) => {
    if (err) return next(err);
    res.json(post);
  });
});

router.put('/:id', cors(), async (req, res, next) => {
    const valid = await validToken(req.headers);
    if (!valid) return res.sendStatus(403);
  Hotel.findByIdAndUpdate(req.params.id, req.body,  (err, post) => {
    if (err) return next(err);
    res.json(post);
  });
});

router.delete('/:id', cors(), async (req, res, next) => {
    const valid = await validToken(req.headers);
    if (!valid) return res.sendStatus(403);
  Hotel.findByIdAndRemove(req.params.id, req.body,  (err, post) => {
    if (err) return next(err);
    res.json(post);
  });
});

module.exports = router;
