const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const Token = require('./models/token');

async function setHash(apikey) {
    return await new Promise(
        (resolve, reject) => bcrypt.hash(
            apikey, saltRounds,
            (err, hash) => err ? reject(err) :  resolve(hash))
    );
}

async function getToken(user) {
    const hashedPassword = await setHash(user.apikey);
    await saveHash(user.username, hashedPassword);
    return jwt.sign(
        { user: {username: user.username, apikey: user.apikey} },
        hashedPassword,
        { expiresIn: '4h' }
    );
}

async function saveHash(username, hash) {
    const hasToken = await getTokenByUser(username);
    if (hasToken !== null) {
        await updateHasg(username, hash);
    } else {
        await createHash({username,hash});
    }
}

async function createHash(data) {
    await new Promise(
        (resolve, reject) => Token.create(data,(err, token) => {
        if (err) return resolve(null);
        return resolve(token);
    }));
}

async function updateHasg(username,hash) {
    await new Promise((resolve,reject) => Token.findOneAndUpdate({username: username}, {$set:{hash:hash}}, (err, token) => {
        if (err) return resolve(null);
        return resolve(token);
    }));
}


async function getTokenByUser(username) {
    return new Promise((resolve,reject) =>Token.findOne({ username: username }, (err, token) => {
        if (!token) {
            return resolve(null);
        } else {
            if (err) resolve(null);
            return resolve(token);
        }
    }));
}

async function validToken({username, token}) {
    const {hash} = await getTokenByUser(username);
    if (hash === null) return false;
    const user = await jwt.verify(token, hash, (err, decode) =>{
        if (err) return null;
        return decode.user;
    });
    if (!user) return false;
    return (username === user.username);
}

module.exports = {
    getToken,
    validToken,
};