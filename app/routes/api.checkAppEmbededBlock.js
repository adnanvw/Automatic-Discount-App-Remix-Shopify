
import { json } from "@remix-run/node";

import { authenticate } from "../shopify.server";
import dotenv from "dotenv"
dotenv.config()

export const loader = async ({ request }) => {
    try {
        const { admin, session } = await authenticate.admin(request);
        const regExp = new RegExp(process.env.SHOPIFY_AUTOMATIC_BXGY_DISCOUNT_ID)

        const allThemes = await admin.rest.resources.Theme.all({
            session: session,
        });


        const activeTheme = allThemes.data.filter((item) => {
            return item.role == "main"
        })
        const activeThemeId = activeTheme[0].id

        const asset = await admin.rest.resources.Asset.all({
            session: session,
            theme_id: activeThemeId,
            asset: { "key": "config/settings_data.json" },
        });

        const assetValue = asset.data[0].value
        const parsedAssetValue = await JSON.parse(assetValue)
        
        let appEmbededBlockDisabled = true;
        
        if (parsedAssetValue.current.blocks) {
            const objectArray = Object.entries(parsedAssetValue.current.blocks)
            
            const filteredObjectArray = objectArray.length && objectArray.filter((item) => {
                return regExp.test(item[1].type)
            })
          
            if(filteredObjectArray.length ){
                appEmbededBlockDisabled=filteredObjectArray[0][1].disabled
            }
        }
        return json({ appEmbededBlockDisabled })
    } catch (error) {
        console.log("error123", error)
        return json({ "error": "Something went wrong" })
    }
};