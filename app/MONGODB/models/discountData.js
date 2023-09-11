import mongoose from "mongoose";

const discountSchema = new mongoose.Schema({
},{
    timestamps: true,
    strict: false 
})

const discountModel = mongoose.model("discountData", discountSchema);

export default discountModel;




