const Sauce= require('../models/sauce');
const fs = require("fs")

exports.createSauce = (req, res, next) => {
  const sauceObject = JSON.parse(req.body.sauce);  
  delete sauceObject._id;
  const sauce = new Sauce({
      ...sauceObject,
    likes: 0,
    dislikes: 0,
    usersLiked: [],
    price: req.body.price,
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  });
  sauce.save().then(
    () => {
      res.status(201).json({
        message: 'Post saved successfully!'
      });
    }
  ).catch(
    (error) => {
      res.status(400).json({
        error: error
      });
    }
  );
};

exports.getOneSauce = (req, res, next) => {
  Sauce.findOne({
    _id: req.params.id
  }).then(
    (sauce) => {
      res.status(200).json(sauce);
    }
  ).catch(
    (error) => {
      res.status(404).json({
        error: error
      });
    }
  );
};

exports.modifySauce = (req, res, next) => {
  const sauceObject = req.file
    ? {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
        }
    :  {
        ...req.body };    
  Sauce.updateOne({_id: req.params.id}, {...sauceObject, _id: req.params.id })
  .then(
    () => {
      res.status(201).json({
        message: 'Sauce updated successfully!'
      });
    }
  ).catch(
    (error) => {
      res.status(400).json({
        error: error
      });
    }
  );
};

exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
        const filename = sauce.imageUrl.split("/images/")[1];
        fs.unlink(`images/${filename}`, () => {
  Sauce.deleteOne({_id: req.params.id })
    .then(() => 
      res.status(200).json({
        message: 'Deleted!'}))
    .catch(
    (error) => 
      res.status(400).json({
        error: error
      }));
    });
})
};

exports.getAllSauces = (req, res, next) => {
  Sauce.find()
  .then(
    (sauces) => {
      res.status(200).json(sauces);
    })
  .catch(
    (error) => {
      res.status(400).json({
        error: error
      });
    }
  );
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

            if (userLike === -1 & sauceUsersDislikes.indexof(userId) < 0) {
                sauce.dislikes =+ 1;
                sauceUsersDislikes.push(req.body.userId);
                res.status(201).json({message:"ok"});

            }
            if (userLike === -1 & sauceUsersLikes.indexof(userId) < 0) {
                sauce.likes =+ 1;
                sauceUsersLikes.push(req.body.userId);
                res.status(201).json({message:"ok"});
            }
            if (userLike === 0 & sauceUsersLikes.indexof(userId) >= 0) {
                sauce.likes-=1;
                let userIndex=sauceUsersLikes.indexOf(userId);
                sauceUsersLikes.splice(userIndex,1);
                res.status(201).json({message:"ok"});  
            }
            if (userLike === 0 & sauceUsersDislikes.indexof(userId) >= 0) {
                sauce.dislikes-=1;
                let userIndex=sauceUsersDisLikes.indexOf(userId);
                sauceUsersDislikes.splice(userIndex,1);
                res.status(201).json({message:"ok"});  
            } 
            else{}
            sauce.save();
            console.log(sauce);
        })
        .catch(error => res.status(404).json({error}));
};
