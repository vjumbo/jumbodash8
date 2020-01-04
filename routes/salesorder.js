const express = require('express');
const router = express.Router([]);
const mongoose = require('mongoose');
const SalesOrder = require('../models/salesorder');
const cors = require('cors');
const {validToken} = require('../jwt');

router.options('*', cors());

router.get('/', cors(), async (req, res, next) => {
    const valid = await validToken(req.headers);
    if (!valid) return res.sendStatus(403);
  SalesOrder.find({}, (err, salesorder) => {
    if (!salesorder) {
      res.json([]);
    } else {
      if (err) return next(err);
      res.json(salesorder);
    }
  });
});

router.get('/:id', cors(), async (req, res, next) =>{
    const valid = await validToken(req.headers);
    if (!valid) return res.sendStatus(403);
  SalesOrder.findById(req.params.id,  (err, post) => {
    if (err) return next(err);
    res.json(post);
  });
});

router.post('/', cors(), async (req, res, next) => {
    const valid = await validToken(req.headers);
    if (!valid) return res.sendStatus(403);
  SalesOrder.create(req.body,  (err, post) => {
    if (err) return next(err);
    res.json(post);
  });
});

router.put('/:id', cors(), async (req, res, next) => {
    const valid = await validToken(req.headers);
    if (!valid) return res.sendStatus(403);
  SalesOrder.findByIdAndUpdate(req.params.id, req.body,  (err, post) => {
    if (err) return next(err);
    res.json(post);
  });
});

router.delete('/:id', cors(), async (req, res, next) => {
    const valid = await validToken(req.headers);
    if (!valid) return res.sendStatus(403);
  SalesOrder.findByIdAndRemove(req.params.id, req.body,  (err, post) => {
    if (err) return next(err);
    res.json(post);
  });
});

module.exports = router;
