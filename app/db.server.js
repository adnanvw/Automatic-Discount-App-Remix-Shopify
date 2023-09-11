
import mongoConnect from "./MONGODB/connection";
import discountModel from "./MONGODB/models/discountData";
import shopModel from "./MONGODB/models/ShopModel";


mongoConnect()
export {
  discountModel, shopModel
}
