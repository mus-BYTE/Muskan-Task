// const app = require("express")();
// const express = require("express");
// const path = require("path");
// const dotenv = require("dotenv");

// dotenv.config();
// const PORT = 8080;

// // const session = require('express-session');
// app.use(express.static(path.join(__dirname,"/public/")))
// const ejs = require('ejs');
// app.set('view engine', 'ejs');
// app.set('views', __dirname + '/views');

// app.use(session({
//     secret:"keyboard cat",
//     resave: false,
//     saveUninitialized:true,
// }));

// const passport = require("passport");
// const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

// passport.use(new GoogleStrategy({
//     clientID:"1028585814559-p73tfia0htgmm81jve7o39dqege5pq1f.apps.googleusercontent.com",
//     clientSecret:"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",
//     callbackURL:`${process.env.GOOGLE_CALLBACK}/auth/google/callback`
// },
//     function(accessToken,refreshToken,profile,done){
//         console.log(profile);
//         return done(null,profile);
//     }
// ));

// passport.serializeUser(function(user,done){
//     done(null,user);
// });

// passport.deserializeUser(function(user,done){
//     done(null,user);
// });

// app.use(passport.initialize());
// app.use(passport.session());

// app.get('/auth/google',
//     passport.authenticate('google',{scope:["https://www.googleapis.com/auth/plus.login"]})
// );

// app.get('/auth/google/callback',
//     passport.authenticate('google', { failureRedirect: '/login' }),
//     (req, res) => {
//         res.redirect('/home');
//     }
// );
// const session = require('express-session');
// const RedisStore = require('connect-redis')(session);

// const sessionConfig = {
//     store: new RedisStore({ url: 'redis://localhost:8080' }),
//     secret: 'your_secret_here',
//     resave: false,
//     saveUninitialized: false
// };
// app.get("/",(req,res)=>{
//     res.render("login.ejs");
// });
// app.get("/home",(req,res)=>{
//     res.render("home.ejs");
// });

// app.listen(PORT,()=>{
//     console.log(`Server is listening at Port:${PORT}`);
// })


const express = require("express");
const path = require("path");
const dotenv = require("dotenv");
const session = require('express-session');
const RedisStore = require('connect-redis')(session);
const passport = require("passport");
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

dotenv.config();
const PORT = 8080;
const app = express();

app.use(express.static(path.join(__dirname, "/public/")));
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

// Session configuration using Redis
const sessionConfig = {
    store: new RedisStore({ url: 'redis://localhost:8080' }),
    secret: 'your_secret_here',
    resave: false,
    saveUninitialized: false
};

app.use(session(sessionConfig));

// Passport initialization
app.use(passport.initialize());
app.use(passport.session());

// Google OAuth Strategy setup
passport.use(new GoogleStrategy({
    clientID: "YOUR_CLIENT_ID",
    clientSecret: "YOUR_CLIENT_SECRET",
    callbackURL: `${process.env.GOOGLE_CALLBACK}/auth/google/callback`
}, (accessToken, refreshToken, profile, done) => {
    console.log(profile);
    return done(null, profile);
}));

passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((user, done) => {
    done(null, user);
});

// Routes
app.get("/", (req, res) => {
    res.render("login.ejs");
});

app.get("/home", (req, res) => {
    res.render("home.ejs");
});

// Google OAuth routes
app.get('/auth/google', passport.authenticate('google', { scope: ["https://www.googleapis.com/auth/plus.login"] }));

app.get('/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/login' }),
    (req, res) => {
        res.redirect('/home');
    }
);

// Start server
app.listen(PORT, () => {
    console.log(`Server is listening at Port:${PORT}`);
});
