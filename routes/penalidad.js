const express = require('express');
const router = express.Router([]);
const mongoose = require('mongoose');
const Penalidad = require('../models/panalidad');
const cors = require('cors');
const {validToken} = require('../jwt');

router.options('*', cors());

router.get('/', cors(), async (req, res, next) => {
    const valid = await validToken(req.headers);
    if (!valid) return res.sendStatus(403);
  Penalidad.find( (err, penaliad) => {
    if (!penaliad) {
      res.json([]);
    } else {
      if (err) return next(err);
      res.json(penaliad);
    }
  }).populate('sistema.usuarioCreador', 'username')
      .populate('sistema.usuarioAsignado', 'username');
});

router.get('/:id', cors(), async (req, res, next) =>{
    const valid = await validToken(req.headers);
    if (!valid) return res.sendStatus(403);
  Penalidad.findById(req.params.id,  (err, post) => {
    if (err) return next(err);
    res.json(post);
  }).populate('sistema.usuarioCreador', 'username')
      .populate('sistema.usuarioAsignado', 'username');
});

router.post('/', cors(), async (req, res, next) => {
    const valid = await validToken(req.headers);
    if (!valid) return res.sendStatus(403);
  Penalidad.create(req.body,  (err, post) => {
    if (err) return next(err);
    res.json(post);
  });
});

router.put('/:id', cors(), async (req, res, next) => {
    const valid = await validToken(req.headers);
    if (!valid) return res.sendStatus(403);
  Penalidad.findByIdAndUpdate(req.params.id, req.body,  (err, post) => {
    if (err) return next(err);
    res.json(post);
  });
});

router.delete('/:id', cors(), async (req, res, next) => {
    const valid = await validToken(req.headers);
    if (!valid) return res.sendStatus(403);
  Penalidad.findByIdAndRemove(req.params.id, req.body,  (err, post) => {
    if (err) return next(err);
    res.json(post);
  });
});

module.exports = router;
