const BasicStrategy = require('passport-http').BasicStrategy;
const BearerStrategy = require('passport-http-bearer').Strategy;
const userRepository = require('../repositories/user.repository');
const passport = require('passport');

passport.use(new BasicStrategy({
    usernameField: 'email',
    passwordField: 'password'
}, ((email, password, done) => {
    userRepository.login(email, password)
        .then(user => {
            return done(null, user);
        }).catch(error => {
            return done(error, false);   
        });
})));

passport.use(new BearerStrategy((token, done) => {
    userRepository.getByToken(token)
        .then(user => {
            return done(null, user);
        }).catch((error) => {
            return done(error, false);
        });
}));

module.exports.require_basic = (req, res, next) => {    
    passport.authenticate('basic', {session: false}, (error, user) => {
        req.user = user;

        if (error) {
            return next(error);
        }

        if (user) {
            return next();
        }
        return res.status(500).json({message: 'User not found'});
    })(req, res);
}

module.exports.require_auth = (req, res, next) => {
    passport.authenticate('bearer', { session: false }, function(err, user, info) {
        req.user = user;
        
        if (err) { 
          return next(err);
        }
        
        if (user) { 
          return next();
        }
    
        return res.send(403, { message: "You are not permitted to perform this action." });
      })(req, res);
}

module.exports.require_role = (role) => {
    return (req, res, next) => {
        if (req.user && req.user.role === role.id) {
            next();
        } else {
            res.status(403).json({
                message: "You are not permitted to perform this action."
            })
        }
    }
}

module.exports.roles = {
    "admin": {
        id: "admin",
        name: "Admin",
        description: "Admin user"
    },
    "user": {
        id: "user",
        name: "User",
        description: "User"
    }
}