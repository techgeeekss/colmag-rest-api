const jwt = require('jsonwebtoken');

const autheticateToken = (req,res,next)=>{
    const authHeader = req.headers['authorization'];
    const authToken = authHeader && authHeader.split(' ')[1];
    if(!authToken) return res.sendStatus(401);
    jwt.verify(authToken,process.env.ACCESS_TOKEN,(err,user)=>{
      if(err) return res.sendStatus(403);
      req.user = user;
      next()
    });  
    
}

module.exports = {
    autheticateToken : autheticateToken
}