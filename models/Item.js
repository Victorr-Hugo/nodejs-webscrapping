import mongoose from "mongoose";

const itemSchema = new mongoose.Schema(
    {
        title: { 
            type: String, 
            required: true 
        },
        body: { 
            type: String, 
            required: true 
        },
        designer: {
            type:String,
            required: true,
        },
        category: {
            type:String,
            required: true,
        },
        price: { 
            type: String,
            required: true,
        },
        gender: {
            type: String,
            required: true,
        },
        imagesSrc:[],
        releaseDate: { 
            type: Date, 
            default: Date.now 
        },
        isLimitedEdition: { 
            type: Boolean, 
            default: false 
        },
        availableSizes: String,
        sizes:[],
    }
);

export default mongoose.model('Items', itemSchema)
