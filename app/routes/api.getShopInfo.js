import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
// import db from "../db.server";
import { authenticate } from "../shopify.server";

export const loader = async ({request}) => {

    try {
        const {admin,session} = await authenticate.admin(request);
        
        const data = await admin.rest.resources.Shop.all({session});
        const shop = data.data[0];
        console.log("shop****",shop)
        return json({
            shopData:shop
        });
        
    } catch (error) {
        return json({
            error:"Something went wrong..."
        });
    }
  };