const Sauce = require('../models/sauce');
const fs = require('fs');

exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject._id;
    const sauce = new Sauce({
        ...sauceObject,
        likes: 0,
        dislikes: 0,
        usersLiked: [],
        usersDisliked: [],
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });
    sauce.save()
        .then(() => res.status(201).json({
            message: 'Objet enregistré !'
        }))
        .catch(error => res.status(400).json({
            error
        }));
};

exports.modifySauce = (req, res, next) => {
    const sauceObject = req.file ?
        {
            ...JSON.parse(req.body.sauce),
            imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
        } : {
            ...req.body
        };
    Sauce.updateOne({
            _id: req.params.id
        }, {
            ...sauceObject,
            _id: req.params.id
        })
        .then(() => res.status(200).json({
            message: 'Objet modifié !'
        }))
        .catch(error => res.status(400).json({
            error
        }));
};

exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({
            _id: req.params.id
        })
        .then(sauce => {

            const filename = sauce.imageUrl.split('/images/')[1];
            fs.unlink(`images/${filename}`, () => {

                Sauce.deleteOne({
                        _id: req.params.id
                    })
                    .then(() => res.status(200).json({
                        message: 'Objet supprimé !'
                    }))
                    .catch(error => res.status(400).json({
                        error
                    }));
            });
        })
        .catch(error => res.status(500).json({
            error
        }));
};

exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({
            _id: req.params.id
        })
        .then(sauce => res.status(200).json(sauce))
        .catch(error => res.status(404).json({
            error
        }));
};

exports.getAllSauces = (req, res, next) => {
    Sauce.find()
        .then(sauces => res.status(200).json(sauces))
        .catch(error => res.status(400).json({
            error
        }));
};

exports.likeSauce = (req, res, next) => {
    Sauce.findOne({
            _id: req.params.id
        })
        .then(sauce => {
            const sauceUsersLikes = sauce.usersLiked;
            const sauceUsersDislikes = sauce.usersDisliked;
            const userLike = req.body.like;
            const userId = req.body.userId;
            console.log(sauce);

            if (userLike === -1 & sauceUsersDislikes.indexOf(userId) < 0) {
                sauce.dislikes =+ 1;
                sauceUsersDislikes.push(req.body.userId);
                res.status(201).json({message:"C'est noté!"});
            }

            if (userLike === 1 & sauceUsersLikes.indexOf(userId) < 0) {
                sauce.likes =+ 1;
                sauceUsersLikes.push(req.body.userId);
                res.status(201).json({message:"C'est noté!"});
            }
            if(userLike===0 & sauceUsersLikes.indexOf(userId) >= 0 ){
                sauce.likes-=1;
                let userIndex=sauceUsersLikes.indexOf(userId);
                sauceUsersLikes.splice(userIndex,1);
                res.status(201).json({message:"C'est noté!"});
            }
            if(userLike===0 & sauceUsersDislikes.indexOf(userId) >= 0 ){
                sauce.dislikes-=1;
                let userIndex=sauceUsersDislikes.indexOf(userId);
                sauceUsersDislikes.splice(userIndex,1);
                res.status(201).json({message:"C'est noté!"});
            }
            else{}
            sauce.save();
            console.log(sauce);
        })
        .catch(error => res.status(404).json({
            error
        }));
};