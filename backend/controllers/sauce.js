const sauce = require('../models/sauce')
//permet de modifier le système de fichiers, y compris aux fonctions permettant de supprimer les fichiers.
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
    .catch((error) => res.status(400).json({ error }));
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
      message: 'La sauce a bien été modifiée !'
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
          .then(() => res.status(200).json({ message: 'La sauce a bien été supprimée !'}))
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

//aimer les sauces//
exports.likeSauce = (req, res, next) => {
  let OneClic = req.body.like
  let SauceClic = req.params.id
  let userId = req.body.userId
  if (OneClic=== 0) { 
    Sauce.findOne({
        _id: SauceClic
      })
      .then((sauce) => {
          //annuler un like//
        if (sauce.usersLiked.includes(userId)) { 
          Sauce.updateOne({
              _id: SauceClic
            }, {
              $pull: {
                usersLiked: userId
              },
              $inc: {
                likes: -1
              }, 
            })
            .then(() => res.status(200).json({
              message: 'Like a bien été annulé'
            }))
            .catch((error) => res.status(400).json({
              error
            }))
        }
          //annuler un dislike//
        if (sauce.usersDisliked.includes(userId)) { 
          Sauce.updateOne({
              _id: SauceClic
            }, {
              $pull: {
                usersDisliked: userId
              },
              $inc: {
                dislikes: -1
              }, 
            })
            .then(() => res.status(200).json({
              message: 'Dislike a bien été annulé'
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

//condition pour ajouter un like//
  if (OneClic === 1) { 
    Sauce.updateOne({
        _id: SauceClic
      }, {
        $push: {
          usersLiked: userId
        },
        $inc: {
          likes: +1
        },
      })
      .then(() => res.status(200).json({
        message: 'le like a bien été pris en compte'
      }))
      .catch((error) => res.status(400).json({
        error
      }))
  }
  //condition pour ajouter un dislike//
  if (OneClic === -1) {
    Sauce.updateOne( 
        {
          _id: SauceClic
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
          message: 'Dislike a bien été pris en compte'
        })
      })
      .catch((error) => res.status(400).json({
        error
      }))
  }
  
}