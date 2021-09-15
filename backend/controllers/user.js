//intégration de bcrypt qui a une fonction de hachage  et permet de se protéger des attaques
const bcrypt = require("bcrypt");
// permet l'échange sécurisé de tokens et la vérification de l'intégrité et de l'authenticité des données
const jwt = require('jsonwebtoken');

//const User = require ("../models/user");

//connexion de l'utilisation
exports.signup = (req, res, next) => {
  //hachage du mt de passe//
    bcrypt.hash(req.body.password, 10)
      .then(hash => {
        const user = new User({
          email: req.body.email,
          password: hash
        });
        user.save()
          .then(() => res.status(201).json({ message: 'Utilisateur créé' }))
          .catch(error => res.status(400).json({ error }));
      })
      .catch(error => res.status(500).json({ error }));
  };

exports.login = (req, res, next) => {
    User.findOne({ email: req.body.email })
      .then(user => {
        if (!user) {
          return res.status(401).json({ error: 'Utilisateur inconnu' });
        }
        //bcrypt compare le1ER mt de passe enregistré lors de l'inscription et de 2eme saisi par l'utilisateur
        bcrypt.compare(req.body.password, user.password)
          .then(valid => {
            if (!valid) {
              return res.status(401).json({ error: 'Mot de passe incorrect' });
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
          .catch(error => res.status(500).json({ error }));
      })
      .catch(error => res.status(500).json({ error }));
};