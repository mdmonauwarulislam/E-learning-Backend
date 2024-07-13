const mongoose = require('mongoose');

const featureSchema = new mongoose.Schema({
    isCross: {
        type: Boolean,
        required: true
    },
    contents: { 
        type: String, 
        required: true 
    },
});

const pricingPlanSchema = new mongoose.Schema({
    title: { 
        type: String, 
        required: true 
    },
    price: { 
        type: String, 
        required: true 
    },
    period: { 
        type: String, 
        required: true },
    features: [featureSchema],
    isPro: { 
        type: Boolean, 
        required: true 
    },
});

const PricingPlan = mongoose.model('PricingPlan', pricingPlanSchema);

module.exports = PricingPlan;
