const express = require('express');
const router = express.Router([]);
const mongoose = require('mongoose');
const Habitacion = require('../models/habitacion');
const cors = require('cors');
const {validToken} = require('../jwt');

router.options('*', cors());

router.get('/', cors(), async (req, res, next) => {
    const valid = await validToken(req.headers);
    if (!valid) return res.sendStatus(403);
    Habitacion.find({}, '-imagenes', (err, products) => {
        if (err) return next(err);
        res.json(products);
    }).populate('sistema.usuarioCreador', 'username')
        .populate('sistema.usuarioAsignado', 'username');
});

router.get('/:id', cors(), async (req, res, next) =>{
    const valid = await validToken(req.headers);
    if (!valid) return res.sendStatus(403);
  Habitacion.findById(req.params.id,  (err, post) => {
    if (err) return next(err);
    res.json(post);
  }).populate('sistema.usuarioCreador', 'username')
      .populate('sistema.usuarioAsignado', 'username');
});

router.post('/', cors(), async (req, res, next) => {
    const valid = await validToken(req.headers);
    if (!valid) return res.sendStatus(403);
  Habitacion.create(req.body,  (err, post) => {
    if (err) return next(err);
    res.json(post);
  });
});

router.put('/:id', cors(), async (req, res, next) => {
    const valid = await validToken(req.headers);
    if (!valid) return res.sendStatus(403);
  Habitacion.findByIdAndUpdate(req.params.id, req.body,  (err, post) => {
    if (err) return next(err);
    res.json(post);
  });
});

router.delete('/:id', cors(), async (req, res, next) => {
    const valid = await validToken(req.headers);
    if (!valid) return res.sendStatus(403);
  Habitacion.findByIdAndRemove(req.params.id, req.body,  (err, post) => {
    if (err) return next(err);
    res.json(post);
  });
});

module.exports = router;
