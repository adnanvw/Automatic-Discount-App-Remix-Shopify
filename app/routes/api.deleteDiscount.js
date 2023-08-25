import { json } from "@remix-run/node";

import db from "../db.server";
import { authenticate } from "../shopify.server";
import { deleteDiscount } from "~/Graphql/deleteDiscountApi";

export const action = async ({request}) => {

    const data= JSON.parse(await request.text())

    switch (request.method) {
        case "DELETE": {
            try {
                const {admin,session} = await authenticate.admin(request);
                
                const response= await deleteDiscount(admin.graphql, data)
        
                if(response){
                    return json({
                        success:"Data Deleted Successfully."
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