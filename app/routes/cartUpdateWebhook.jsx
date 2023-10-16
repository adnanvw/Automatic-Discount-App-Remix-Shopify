import { authenticate } from "../shopify.server";
import {socketConnected} from "../entry.server.jsx"
import { discountModel } from "~/db.server";

export const action = async ({ request }) => {

  console.log("hittted###")
  const { topic, shop, session , payload} = await authenticate.webhook(request);


  switch (topic) {
    case "CARTS_UPDATE":
      console.log("TOPIC", payload);
    
      let filterArray=[]
      let totalDiscount=0
      for(let item of payload.line_items){
        filterArray.push(item.variant_id)
        totalDiscount += Number(item.total_discount)
      }

     

      if(totalDiscount !==0){
        return null
      }else{
          let ruleArray=[]
          for(let variant of filterArray){
              const ruleObj= await discountModel.findOne({customerBuyProduct:`gid://shopify/ProductVariant/${variant}`})
              ruleObj && ruleArray.push(ruleObj);
          }
        
          ruleArray.length && socketConnected.emit("addDiscountedProduct", ruleArray[0]?.customerGetProduct);
      }
      break;
    default:
      throw new Response("Unhandled webhook topic", { status: 404 });
  }

  throw new Response();
};
