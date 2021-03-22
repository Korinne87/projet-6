const bcrypt = require('bcrypt');
const jwtoken = require('jsonwebtoken');
const User = require('../models/user');


exports.signup = (req, res, next) => {
    let regexEmail = /^[a-z0-9._-]+@[a-z0-9._-]+\.[a-z]{2,6}$/;
    if (!regexEmail.test(req.body.email)) {
        return res.status(400).json({error: 'Format email non valide'});
    } else {
        bcrypt.hash(req.body.password, 10)
        .then(hash => {
            const user = new User({
                email: req.body.email,
                password: hash
            });
            user.save()
            .then(() => res.status(201).json({message: 'Utilisateur crée !'}))
            .catch(error => res.status(400).json({error}))
        })
        .catch(error => res.status(500).json({error}))
    }
};



exports.login = (req, res, next) => {
    User.findOne({ email: req.body.email}) 
    .then(user => {
        console.log(user);
        if (!user) {
           return res.status(401).json({ error: 'Utilisateur inconnu !'})
        }
        bcrypt.compare(req.body.password, user.password)
        .then(valid => {
            if(!valid) {
             return res.status(401).json({ error: 'Mot de passe incorrect !'})
            }
            res.status(200).json({
                userId: user._id,
                token: jwtoken.sign(
                   {userId: user._id},
                   'RANDOM_TOKEN_SECRET',
                   {expiresIn: '24h'}
                )
            });
        })
        .catch(error => res.status(500).json({ error }));
    })
    .catch(error => res.status(500).json({ error }));
}
