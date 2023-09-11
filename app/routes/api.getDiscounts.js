import { json } from "@remix-run/node";
import { discountModel } from "~/db.server";
import { authenticate } from "../shopify.server";

export const loader = async ({ request }) => {

    try {
        const { session } = await authenticate.admin(request);

        const discountArray = await discountModel.find({ shop: session.shop })
        return json({ discountArray })

    } catch (error) {
        return json({
            error: "Something went wrong..."
        });
    }
};