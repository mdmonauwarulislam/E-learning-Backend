const express = require("express");
const Router = express.Router();
require('dotenv').config();

// Importing controllers and middlewares
const { verifyToken } = require("../middleware/authMiddleware");
const { purchaseCourse, purchaseCourseFromWebhook } = require("../controller/purchaseController");
const { checkEnrollment } = require("../controller/enrollmentController");
const checkoutController = require("../controller/checkoutController");

// Purchase course route (requires user authentication)
Router.post("/purchase-course", verifyToken, purchaseCourse);

// Check enrollment route (requires user authentication)
Router.get("/check-enrollment/:courseId", verifyToken, checkEnrollment);

// Route to create a Razorpay checkout session (requires user authentication)
Router.post('/create-checkout-session', verifyToken, checkoutController);

// Webhook route to handle Razorpay events
Router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
    const signature = req.headers['x-razorpay-signature'];

    const isValidSignature = Razorpay.validateWebhookSignature(req.body, signature, webhookSecret);

    if (!isValidSignature) {
        return res.status(400).json({ message: 'Invalid signature' });
    }

    const event = JSON.parse(req.body.payload);

    if (event.event === 'payment.captured') {
        await purchaseCourseFromWebhook(event.payload.payment.entity);
    }

    res.status(200).json({ success: true });
});

module.exports = Router;
