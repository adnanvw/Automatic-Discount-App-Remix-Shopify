import { json } from "@remix-run/node";

import db from "../db.server";
import { authenticate } from "../shopify.server";
import { updateDiscount } from "~/Graphql/updateDiscountApi";

export const action = async ({request}) => {

    const data= JSON.parse(await request.text())

    switch (request.method) {
        case "POST": {
            try {
                const {admin,session} = await authenticate.admin(request);
                
                const response= await updateDiscount(admin.graphql, data,session.shop)
        
                // console.log("****",response)
                if(response){
                    return json({
                        success:"Data Updated Successfully."
                    });

                }else{
                    return json({
                        error:"Something went wrong..."
                    });
                }
                
            } catch (error) {
                console.log("error",error)
                return json({
                    error:"Something went wrong..."
                });
            }
        }
    }
  };