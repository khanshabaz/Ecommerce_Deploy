const express = require("express");
const server = express();
require('dotenv').config();
const crypto=require("crypto")
const {User} = require("./model/User");
const jwt=require("jsonwebtoken")
const mongoose = require("mongoose");
const path=require("path")
const JwtStrategy = require('passport-jwt').Strategy;
const cookieParser=require('cookie-parser');
const productsRouter = require("./routes/Products");
const brandsRouter = require("./routes/Brands");
const categoriesRouter = require("./routes/Categories");
const authRouter = require("./routes/Auth");
const userRouter = require("./routes/Users");
const cartRouter = require("./routes/Carts");
const orderRouter = require("./routes/Orders");
const paymentRouter=require("./routes/payment");
const cors = require("cors");
const LocalStrategy = require("passport-local").Strategy;
const passport = require("passport");
const session = require("express-session");
const { isAuth, sanitizerUser, cookieExtractor } = require("./services/common");

//JWT Options
const opts = {}
opts.jwtFromRequest = cookieExtractor;
opts.secretOrKey = process.env.SECRET_KEY;

//nodemailer 

//middlewares
server.use(express.static(path.resolve(__dirname, 'dist')))
server.use(cookieParser())

server.use(session({
  secret: process.env.SESSION_KEY,
  resave: false, // don't save session if unmodified
  saveUninitialized: false, // don't create session until something stored
}));

server.use(passport.authenticate('session'));
server.use(
  cors({
    exposedHeaders: ["X-Total-Count"],
  })
);



server.use(express.json())
server.use("/products",isAuth(), productsRouter.router);
server.use("/brands",isAuth(), brandsRouter.router);
server.use("/categories",isAuth(),  categoriesRouter.router);
server.use("/auth", authRouter.router);
server.use("/users",isAuth(),  userRouter.router);
server.use("/cart", isAuth(), cartRouter.router);
server.use("/orders",isAuth(),  orderRouter.router);
server.use("/payment",isAuth(),  paymentRouter.router);
server.get('*', (req, res) =>
  res.sendFile(path.resolve('dist', 'index.html'))
);

passport.use(
  "local",
  new LocalStrategy( {usernameField:'email'},async function (email, password, done) {
   
    //by default passport uses username
    try {
      const user = await User.findOne({ email: email });
  
      if (!user) {
        done(null,false,{message:"Invalid Credentials"})//response
      } 
       crypto.pbkdf2(
            password,
            user.salt,
            310000,
            32,
            "sha256",
            async function (err, hashedPassword) {
              if (!crypto.timingSafeEqual(user.password, hashedPassword)) {
                return done(null,false,{message:"Invalid Credentials"})//response
              }
              const token=jwt.sign(sanitizerUser(user),process.env.SECRET_KEY);
              console.log(token)
              done(null,{id:user.id,role:user.role, token})
            }
          );
    } catch (err) {
      done(err)
    }
  })
);

passport.use("jwt",new JwtStrategy(opts, async function(jwt_payload, done) {
  try{
    const user = await User.findById(jwt_payload.id);
      if (user) {
          return done(null, sanitizerUser(user));
      } else {
          return done(null, false);
          // or you could create a new account
      }
    }catch(err){
      return done(err,false)
    }
  }))

passport.serializeUser(function(user, cb) {
  console.log("Serialize",user)
  process.nextTick(function() {
    return cb(null, {
      id: user.id,
      role:user.role
    });
  });
});

passport.deserializeUser(function(user, cb) {
  console.log("de-Serialize",user)
  process.nextTick(function() {
    return cb(null, user);
  });
});

main().catch((err) => console.log(err));

async function main() {
  await mongoose.connect(process.env.MongoDB_URL);
  console.log("database connected");
}

server.get("/", (req, res) => {
  res.json({ status: "Success" });
});


server.listen(process.env.PORT, () => {
  console.log("Server Started");
});
