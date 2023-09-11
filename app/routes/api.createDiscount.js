import { json } from "@remix-run/node";


import { authenticate } from "../shopify.server";
import { createDiscount } from "~/Graphql/createDiscountApi.js";

export const action = async ({request}) => {

    const data= JSON.parse(await request.text())

    switch (request.method) {
        case "POST": {
            try {
                const {admin,session} = await authenticate.admin(request);
                
                const response= await createDiscount(admin.graphql, data,session.shop)
        
                // console.log("****",response)
                if(response){
                    return json({
                        success:"Data Saved Successfully."
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