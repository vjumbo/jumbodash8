const express = require('express');
const router = express.Router([]);
const mongoose = require('mongoose');
const Servicio = require('../models/servicio');
const cors = require('cors');
const {validToken} = require('../jwt');

router.options('*', cors());

router.get('/', cors(), async (req, res, next) => {
    const valid = await validToken(req.headers);
    if (!valid) return res.sendStatus(403);
  Servicio.find({}, (err, servicios) => {
    if (!servicios) {
      res.json([]);
    } else {
      if (err) return next(err);
      res.json(servicios);
    }
  }).populate('sistema.usuarioCreador', 'username')
    .populate('sistema.usuarioAsignado', 'username');
});

router.get('/:id', cors(), async (req, res, next) =>{
    const valid = await validToken(req.headers);
    if (!valid) return res.sendStatus(403);
  Servicio.findById(req.params.id,  (err, post) => {
    if (err) return next(err);
    res.json(post);
  }).populate('sistema.usuarioCreador', 'username')
    .populate('sistema.usuarioAsignado', 'username');
});

router.post('/', cors(), async (req, res, next) => {
    const valid = await validToken(req.headers);
    if (!valid) return res.sendStatus(403);
  Servicio.create(req.body,  (err, post) => {
    if (err) return next(err);
    res.json(post);
  });
});

router.put('/:id', cors(), async (req, res, next) => {
    const valid = await validToken(req.headers);
    if (!valid) return res.sendStatus(403);
  Servicio.findByIdAndUpdate(req.params.id, req.body,  (err, post) => {
    if (err) return next(err);
    res.json(post);
  });
});

router.delete('/:id', cors(), async (req, res, next) => {
    const valid = await validToken(req.headers);
    if (!valid) return res.sendStatus(403);
  Servicio.findByIdAndRemove(req.params.id, req.body,  (err, post) => {
    if (err) return next(err);
    res.json(post);
  });
});

module.exports = router;
