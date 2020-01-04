const express = require('express');
const router = express.Router([]);
const mongoose = require('mongoose');
const Moneda = require('../models/moneda');
const cors = require('cors');
const {validToken} = require('../jwt');

router.options('*', cors());

router.get('/', cors(), async (req, res, next) => {
    const valid = await validToken(req.headers);
    if (!valid) return res.sendStatus(403);
  Moneda.find( (err, products) => {
    if (err) return next(err);
    res.json(products);
  });
});

router.get('/:id', cors(), async (req, res, next) =>{
    const valid = await validToken(req.headers);
    if (!valid) return res.sendStatus(403);
  Moneda.findById(req.params.id,  (err, post) => {
    if (err) return next(err);
    res.json(post);
  });
});

router.post('/', cors(), async (req, res, next) => {
    const valid = await validToken(req.headers);
    if (!valid) return res.sendStatus(403);
  if (req.body.principal === true) {
    Moneda.updateMany({},{ $set: { principal: false }},  { "multi": true }, (errr, postt) => {
      if (err) return next(errr);
      Moneda.create(req.body,  (err, post) => {
        if (err) return next(err);
        res.json(post);
      });
    })
  } else {
    Moneda.create(req.body,  (err, post) => {
      if (err) return next(err);
      res.json(post);
    });
  }

});

router.put('/:id', cors(), async (req, res, next) => {
    const valid = await validToken(req.headers);
    if (!valid) return res.sendStatus(403);
  if (req.body.principal === true) {
    Moneda.updateMany({},{ $set: { principal: false }},  { "multi": true }, (errr, postt) => {
      if (err) return next(errr);
      Moneda.findByIdAndUpdate(req.params.id, req.body,  (err, post) => {
        if (err) return next(err);
        res.json(post);
      });
    })
  } else {
    Moneda.findByIdAndUpdate(req.params.id, req.body,  (err, post) => {
      if (err) return next(err);
      res.json(post);
    });
  }

});

router.delete('/:id', cors(), async (req, res, next) => {
    const valid = await validToken(req.headers);
    if (!valid) return res.sendStatus(403);
  if (res.body.principal === false) {
    Moneda.findByIdAndRemove(req.params.id, req.body,  (err, post) => {
      if (err) return next(err);
      res.json(post);
    });
  } else {
    return next('No puede Eliminar la moneda principal')
  }

});

module.exports = router;
