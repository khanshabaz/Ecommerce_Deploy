const model = require("../model/Order");
const { Product } = require("../model/Product");
const Order = model.Order;
const {User} = require("../model/User");
const { sendMail, invoiceTemplate } = require("../services/common");


exports.fetchOrderByUser = async (req, res) => {
  const {id}=req.user;
   try {
     const orders = await Order.find({user:id});
     res.status(200).json(orders);
   } catch (err) {
     console.error({ err });
     res.status(400).json(err);
   }
 };

 exports.createOrder = async (req, res) => {
    const order = new Order(req.body);
  for(let item of order.items){
    let product=await Product.findOne({_id:item.product.id});
    product.$inc("stock",-1*item.quantity);
    await product.save();
  }
    try {
      const doc = await order.save();
      const user = await User.findById(order.user);
      sendMail({to:user.email,html:invoiceTemplate(order),subject:"Order Received"})
      res.status(201).json(doc);
    } catch (err) {
      console.error({ err });
      res.status(400).json(err);
    }
  };

  



   exports.updateOrder = async (req, res) => {
    const {id}=req.params
     try {
       const order = await Order.findByIdAndUpdate(id,req.body,{new:true});
      res.status(200).json(order);
     } catch (err) {
       console.error({ err });
       res.status(400).json(err);
     }
   };
  

   
exports.fetchAllOrders = async (req, res) => {
  let query = Order.find({});
  let totalOrderQuery = Order.find({});

 

  //TODO:How to get sort on discounted Price not on actual price
  //Sorting

  const totalDocs = await totalOrderQuery.countDocuments().exec();
  console.log({ totalDocs });

  //Pagination
  if (req.query._page && req.query._per_page) {
    const pageSize = req.query._per_page;
    const page = req.query._page;
    query = query.skip(pageSize * (page - 1)).limit(pageSize);
  }
  try {
    const docs = await query.exec();
    res.set("X-Total-Count",totalDocs)
    res.status(200).json(docs);
  } catch (err) {
    console.error({ err });
    res.status(400).json(err);
  }
};
