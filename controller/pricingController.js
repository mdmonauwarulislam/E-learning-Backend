const pricingModel = require("../models/pricingModel");

const getPricingPlan = async (req, res) => {
    try {
        
    } catch (error) {
        return res.status(httpStatuscode.BAD_REQUEST).json({
            success: false,
            message: "Something went wrong in pricing",
            error: error.message,
        });
    }
}