var passport = require('passport');
var GoogleStrategy = require('passport-google-oauth20').Strategy;
var key = require('../config/keys.js');
const db = require("../models");


passport.use(

    new GoogleStrategy({
            clientID: key.googleClientID,
            clientSecret: key.googleClientSecretKey,
            callbackURL: '/auth/google/callback'
            //passReqToCallback : true,
        },
        
        (accessToken, refreshToken, profile, done) => {
            console.log("profile+++++++++++++++++++",profile)
            db.User.findOne({ social_id: profile.id }, (err, user) => {

                // console.log(user)
                if (user) {
                    done(null, user);
                } else {
                    db.User.create({
                            "social_id": profile.id,
                            "first_name": profile.name.givenName,
                            "last_name": profile.name.familyName,
                            "email": profile.emails[0].value,
                            "photo": profile.photos[0].value
                        },
                        (err, user) => {
                            console.log(user)
                            done(null, user);
                        }
                    )
                }
            });
        }
    )
);
passport.serializeUser((user, done) => {
    console.log("")
    done(null, user);
});

passport.deserializeUser((id, done) => {

    //console.log('userId', id);
    done(null, id);

});


module.exports = passport;