const Razorpay = require('razorpay');

exports.razorpay = new Razorpay({
  key_id: process.env.API_KEY,
  key_secret: process.env.KEY_SECRET,
});

