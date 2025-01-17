const paymentService=require("../services/paymentService");

exports.createPaymentLink=async(req,res)=>{
    try{
        const paymentLink= await paymentService.createPaymentLink(req.body.id);
        return res.status(200).send(paymentLink)
    }catch(error){
        return res.status(500).send(error.message)

    }
}

// exports.updatePaymentInformation=async(req,res)=>{
//     try{

//         await paymentService.updatePaymentInformation(req.query);
//         return res.status(200).send({message:"Payment Information Update", status:true})
//     }catch(error){
//         return res.status(500).send(error.message)

//     }
// }