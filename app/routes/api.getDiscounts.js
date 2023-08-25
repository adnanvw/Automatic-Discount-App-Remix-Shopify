import { json } from "@remix-run/node";
import db from "../db.server";
import { authenticate } from "../shopify.server";

export const loader = async ({request}) => {

    try {
        const {session}= await authenticate.admin(request);

        const discountArray = await db.discount.findMany({where:{shop:session.shop}})
        return json({discountArray})
        
    } catch (error) {
        return json({
            error:"Something went wrong..."
        });
    }
  };