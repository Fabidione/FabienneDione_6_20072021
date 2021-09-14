const sauce = require('../models/sauce');
const fs = require('fs');

// création d'une nouvelle sauce//
exports.createSauce = (req, res, next) => {
  const sauceThing = JSON.parse(req.body.sauce);
  delete sauceThing._id;
  const sauce = new Sauce({
    ...sauceThing,
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
    likes: 0,
    dislikes: 0,
    usersLiked: [],
    usersDisliked: []
  });
  sauce.save()
    .then(() => res.status(201).json({ message: 'Sauce enregistrée'}))
    .catch(error => res.status(400).json({ error }));
};

//sélectionner une sauce grace à son id//
exports.getOneSauce = (req, res, next) => {
  Sauce.findOne({
    _id: req.params.id
  }).then(
    (sauce) => {
      res.status(200).json(sauce);
    }
  ).catch(error => res.status(404).json({error: error}));
};

//modifie une sauce //
exports.modifySauce = (req, res, next) => {
  let sauceThing = {};
  req.file ? (
    Sauce.findOne({
      _id: req.params.id
    }).then((sauce) => {
      //créer une const si l'utilisateur veut aussi modifier l'image//
      const filename = sauce.imageUrl.split('/images/')[1]
      fs.unlinkSync(`images/${filename}`)
    }),
    //ajout de nouvelle images suite à la modification de sauce//
    sauceThing = {
      ...JSON.parse(req.body.sauce),
      imageUrl: `${req.protocol}://${req.get('host')}/images/${
        req.file.filename
      }`,
    }
  ) : (sauceThing = {...req.body
    }
  )
  Sauce.updateOne(
      {
        _id: req.params.id
      }, {
        ...sauceThing,
        _id: req.params.id
      }
    )
    .then(() => res.status(200).json({
      message: 'Sauce modifiée !'
    }))
    .catch((error) => res.status(400).json({
      error
    }))
}

//suprression de la sauce//
exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then(sauce => {
      const filename = sauce.imageUrl.split('/images/')[1];
      fs.unlink(`images/${filename}`, () => {
        Sauce.deleteOne({ _id: req.params.id })
          .then(() => res.status(200).json({ message: 'Sauce supprimée !'}))
          .catch(error => res.status(400).json({ error }));
      });
    })
    .catch(error => res.status(500).json({ error }));
};

//séléctionner toutes sauces//
exports.getAllSauce = (req, res, next) => {
  Sauce.find().then(
    (sauces) => {
      res.status(200).json(sauces);
    }
  ).catch(error => res.status(400).json({ error: error}));
};

//aimer et disliker les sauces//
exports.likeDislike = (req, res, next) => {
  let like = req.body.like
  let userId = req.body.userId
  let sauceId = req.params.id
//condition pour ajouter un like//
  if (like === 1) { 
    Sauce.updateOne({
        _id: sauceId
      }, {
        $push: {
          usersLiked: userId
        },
        $inc: {
          likes: +1
        },
      })
      .then(() => res.status(200).json({
        message: 'like ajouté'
      }))
      .catch((error) => res.status(400).json({
        error
      }))
  }
  //condition pour ajouter un dislike//
  if (like === -1) {
    Sauce.updateOne( 
        {
          _id: sauceId
        }, {
          $push: {
            usersDisliked: userId
          },
          $inc: {
            dislikes: +1
          }, 
        }
      )
      .then(() => {
        res.status(200).json({
          message: 'Dislike ajouté'
        })
      })
      .catch((error) => res.status(400).json({
        error
      }))
  }
  if (like === 0) { 
    Sauce.findOne({
        _id: sauceId
      })
      .then((sauce) => {
          //annuler un like//
        if (sauce.usersLiked.includes(userId)) { 
          Sauce.updateOne({
              _id: sauceId
            }, {
              $pull: {
                usersLiked: userId
              },
              $inc: {
                likes: -1
              }, 
            })
            .then(() => res.status(200).json({
              message: 'Like annulé'
            }))
            .catch((error) => res.status(400).json({
              error
            }))
        }
          //annuler un dislike//
        if (sauce.usersDisliked.includes(userId)) { 
          Sauce.updateOne({
              _id: sauceId
            }, {
              $pull: {
                usersDisliked: userId
              },
              $inc: {
                dislikes: -1
              }, 
            })
            .then(() => res.status(200).json({
              message: 'Dislike annulé'
            }))
            .catch((error) => res.status(400).json({
              error
            }))
        }
      })
      .catch((error) => res.status(404).json({
        error
      }))
  }
}