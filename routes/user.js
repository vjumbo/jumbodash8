const express = require('express');
const router = express.Router([]);
const mongoose = require('mongoose');
const User = require('../models/user.js');
const cors = require('cors');
const {getToken, validToken} = require('../jwt');


router.options('*', cors());

router.get('/:username', cors(), (req, res, next) => {
  User.findOne({ username: req.params.username }, async (err, user) => {
    if (!user) {
      // res.sendStatus(404);
      res.json(false);
    } else {
      if (err) return next(err);
        const token = await getToken(user);
      return res.json({...user, ...{token: token}});
    }
  });
});

router.get('/', cors(), async (req, res, next) => {
    const valid = await validToken(req.headers);
    if (!valid) return res.sendStatus(403);
  User.find( (err, products) => {
    if (err) return next(err);
    res.json(products);
  });
});



/*  */
router.post('/', cors(), async (req, res, next) => {
    const token = await getToken(req.body);
  User.create(req.body,(err, post) => {
    if (err) return next(err);
    res.json({...post, ...{token: token}});
  });
});

/*  */
router.put('/:id', cors(), async (req, res, next) => {
    const valid = await validToken(req.headers);
    if (!valid) return res.sendStatus(403);
  User.findByIdAndUpdate(req.params.id, req.body, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
});

module.exports = router;
