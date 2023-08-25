import { authenticate } from "../shopify.server";
import db from "../db.server";

export const action = async ({ request }) => {

    console.log("hittted###")
  const { topic, shop, session } = await authenticate.webhook(request);


  switch (topic) {
    case "CARTS_UPDATE":
      console.log("TOPIC", topic);
      break;
    default:
      throw new Response("Unhandled webhook topic", { status: 404 });
  }

  throw new Response();
};
