const mongoose = require('mongoose');


const connectDb = ()=> {
    if (!process.env.DB_URI) {
        console.error("There is no mongo url set in env file or config.js");
    }
    return mongoose.connect(process.env.DB_URI, {
      useNewUrlParser:true,
      useCreateIndex:true,
      useFindAndModify:false,
      useUnifiedTopology:true
    });
  };
  
  
  
  
  module.exports = connectDb;
