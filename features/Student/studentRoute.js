const express = require('express');

const routes = express.Router();

routes.get('/',(req,res)=>{
    res.send("at student route");
});


module.exports = routes;