const express = require('express');
const router = express.Router([]);
const mongoose = require('mongoose');
const cors = require('cors');
const Vendor = require('../models/vendor');
const {validToken} = require('../jwt');

router.options('*', cors());

router.get('/:crmid', cors(), async (req, res, next) => {
    const valid = await validToken(req.headers);
    if (!valid) return res.sendStatus(403);
  Vendor.findOne({ crmid: req.params.crmid }, (err, vendor) => {
      if (!vendor) {
          // res.sendStatus(404);
          res.json(false);
      } else {
          if (err) return next(err);
          return res.json(vendor);
      }
  }).populate('hoteles');
});

router.post('/', cors(), async (req, res, next) => {
    const valid = await validToken(req.headers);
    if (!valid) return res.sendStatus(403);
  Vendor.create(req.body, (err, post) => {
    if (err) return next(err);
    res.json(post);
  });
});

router.put('/:id', cors(), async (req, res, next) => {
    const valid = await validToken(req.headers);
    if (!valid) return res.sendStatus(403);
  Vendor.findByIdAndUpdate(req.params.id, req.body, (err, post) => {
    if (err) return next(err);
    res.json(post);
  });
});

module.exports = router;
