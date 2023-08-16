const mongoose = require("mongoose");
const CONSTANTS = require("./api/config/constants");

mongoose.connect(
  CONSTANTS.MONGODB.URL,
  {
    useCreateIndex: true,
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useFindAndModify: false
  }
)

var conn = mongoose.connection;
conn.on('connected', () => {
  console.log('Mongoose connected to Database...');
});

conn.on('error', err => {
  console.log(err.message);
});

conn.on('disconnected', () => {
  console.log('Mongoose connection is disconnected...');
});

process.on('SIGINT', () => {
  conn.close(() => {
    console.log(
      'Mongoose connection is disconnected due to app termination...'
    );
    process.exit(0);
  });
});

module.exports = conn;