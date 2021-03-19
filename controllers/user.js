const bcrypt = require('bcrypt');

const User = require('../models/user')
const jwt = require('jsonwebtoken');
const CryptoJS = require('crypto-js');

const encryptWithAES = text => {
  const passphrase = CryptoJS.enc.Hex.parse('000102030405060708090a0b0c0d0e0f101112131415161718191a1b1c1d1e1f');
  return CryptoJS.AES.encrypt(text, passphrase, { mode: CryptoJS.mode.ECB }).toString();
};

////////////////identification d un utilisateur////////////////
exports.signup = (req, res, next) => {
  const eHash = encryptWithAES(req.body.email);
  console.log(eHash);
  bcrypt.hash(req.body.password, 10)
  .then(hash => {
      const user = new User(
      {
          email: eHash,
          password: hash
      });
      user.save()
      .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
      .catch(error => res.status(400).json({ error }));
  })
  .catch(error => res.status(500).json({ error }));
};

//////////////////token d authentification////////////////////////////////////////
exports.login = (req, res, next) => {
  const emailEncryption = encryptWithAES(req.body.email);
  console.log(emailEncryption);
  User.findOne({ email: emailEncryption })
  .then(user => {
      if (!user) {
      return res.status(401).json({ error: 'Utilisateur non trouvé !' });
      }
      bcrypt.compare(req.body.password, user.password)
      .then(valid => {
          if (!valid) {
          return res.status(401).json({ error: 'Mot de passe incorrect !' });
          }
          res.status(200).json({
              userId: user._id,
              token: jwt.sign(
                { userId: user._id },
                'RANDOM_TOKEN_SECRET',
                { expiresIn: '24h' }
              )
          });
      })
  .catch(error => res.status(400).json({ error }));
})
.catch(error => res.status(500).json({ error }));
};