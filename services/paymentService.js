const { razorpay } = require('./razorPayClient');
const { Order } = require("../model/Order");
const { User } = require("../model/User");
const USD_TO_INR_RATE = 86;

exports.createPaymentLink = async (orderId) => {
  try {
    const order = await Order.findById({_id:orderId});
    const user = await User.findById(order.user);

    const paymentLinkRequest = {
      amount: order.totalAmount*USD_TO_INR_RATE*100,
      currency: "INR",
      customer: {
        name: user.email,
      },
      notify: {
        sms: true,
        email: true,
      },
      reminder_enable: true,
      callback_url: `https://ecommerce-deploy-silk.vercel.app/order-success/${orderId}`,
      callback_method: "get",
    };

    const paymentLink = await razorpay.paymentLink.create(paymentLinkRequest);

    const paymentLinkId = paymentLink.id;
    const payment_link_url = paymentLink.short_url;

    const resData = {
      paymentLinkId,
      payment_link_url,
    };

    return resData;
  } catch (error) {

   throw new Error(error.message)
  }
};

// exports.updatePaymentInformation = async (reqData) => {
//     const paymentId=reqData.payment_id;
//     const orderId=reqData.order_id

//   try {
//     const order = await Order.findById(orderId);
//     const payment= await razorpay.payments.fetch(paymentId);

//     if(payment.status=="captured"){
//         order.paymentDetails.paymentId=paymentId;
//         order.paymentDetails.status="COMPLETED";

//         await order.save()
//     }

//     const resData={message:"Your order is Placed", success:"true"};
//     return resData;
//   } catch (error) {
//     throw new Error(error.message)
//   }
// };
