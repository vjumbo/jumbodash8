const express = require('express');
const router = express.Router([]);
const mongoose = require('mongoose');
const Pais = require('../models/pais');
const cors = require('cors');
const {validToken} = require('../jwt');

router.options('*', cors());

router.get('/', cors(), async (req, res, next) => {
    const valid = await validToken(req.headers);
    if (!valid) return res.sendStatus(403);
  Pais.find( (err, products) => {
    if (err) return next(err);
    res.json(products);
  });
});

router.get('/:pais', cors(), async (req, res, next) => {
    const valid = await validToken(req.headers);
    if (!valid) return res.sendStatus(403);
  Pais.findOne({'info.nombre': req.params.pais }, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
});

router.get('/:id', cors(), async (req, res, next) =>{
    const valid = await validToken(req.headers);
    if (!valid) return res.sendStatus(403);
  Pais.findById(req.params.id,  (err, post) => {
    if (err) return next(err);
    res.json(post);
  });
});

router.post('/', cors(), async (req, res, next) => {
    const valid = await validToken(req.headers);
    if (!valid) return res.sendStatus(403);
  Pais.create(req.body,  (err, post) => {
    if (err) return next(err);
    res.json(post);
  });
});

router.put('/:id', cors(), async (req, res, next) => {
    const valid = await validToken(req.headers);
    if (!valid) return res.sendStatus(403);
  Pais.findByIdAndUpdate(req.params.id, req.body,  (err, post) => {
    if (err) return next(err);
    res.json(post);
  });
});

router.delete('/:id', cors(), async (req, res, next) => {
    const valid = await validToken(req.headers);
    if (!valid) return res.sendStatus(403);
  Pais.findByIdAndRemove(req.params.id, req.body,  (err, post) => {
    if (err) return next(err);
    res.json(post);
  });
});

module.exports = router;
