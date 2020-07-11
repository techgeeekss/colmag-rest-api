const express = require('express');
const bcrypt = require('bcrypt');
require('dotenv/config');
const jwt = require('jsonwebtoken');

const routes = express.Router();
const {
  autheticateToken
} = require('./authMiddlewares');
const User = require('./UserSchema');

routes.get('/users', autheticateToken, async (req, res) => {
  try {
    var users = await User.find({});
    res.send(users);
  } catch (error) {
    console.log(error);
  }
})

routes.post('/signup', async (req, res) => {
  try {
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    const user = await new User({
      _id: req.body.username,
      password: hashedPassword
    }).save();

    return res.send(user);

  } catch (error) {
    return res.sendStatus(500);
  }
})

routes.post('/login', async (req, res) => {
  try {
    const user = await User.findById(req.body.username);

    if (user === null) return res.status(400).send('please sign up');

    if (await bcrypt.compare(req.body.password, user.password)) {
      const payload = {
        sub: user._id
      }
      const accessToken = generateActionToken(payload);
      const refreshToken = generateRefreshToken(payload);

      await User.findByIdAndUpdate(user._id,{token : refreshToken});
      
      return res.json({
        accessToken: accessToken,
        refreshToken: refreshToken
      })
    } 
    else return res.send("not allowed");


  } catch (error) {
    return res.sendStatus(500);
  }

})

routes.post('/refresh',async(req,res)=>{
  try {
    const refreshToken = req.body.token;
    if(refreshToken == null) return res.sendStatus(401);

    jwt.verify(refreshToken,process.env.REFRESH_TOKEN,async(err,data)=>{
      if(err) return res.sendStatus(403);

      const user = await User.findById(data.sub);
      if (user.token !== refreshToken) return res.sendStatus(403)

      return res.send({accessToken:generateActionToken({sub:data.sub})});
    }); 
  } catch (err) {
    return res.sendStatus(500)
  }
  
});

routes.post('/logout', async (req, res) => {
  try {
    var token = jwt.decode(req.body.token);
    await User.findByIdAndUpdate(token.sub,{$unset:{token:""}})
    return res.sendStatus(200);
  } catch (err) {
    return res.sendStatus(500);
  }
})

routes.delete('/delete', autheticateToken, async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.body.username);
    res.send(user);
  } catch (err) {
    res.status(500).send();
  }
})

const generateActionToken = (payload)=>{
  const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN, {
    expiresIn: '1h'
  });
  return accessToken;
}

const generateRefreshToken = (payload)=>{
  return jwt.sign(payload,process.env.REFRESH_TOKEN);
}


module.exports = routes;