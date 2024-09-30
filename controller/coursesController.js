const Razorpay = require('razorpay');
const httpsStatusCode = require('../constant/httpStatuscode');
const Course = require("../models/coursesModel");

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Create a checkout session
const createCheckoutSession = async (req, res) => {
    try {
        const { courseId } = req.body;

        // Retrieve course details from the database
        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(httpsStatusCode.BAD_REQUEST).json({ 
                success: false, 
                message: 'Course not found' 
            });
        }

        // Create Razorpay order
        const order = await razorpay.orders.create({
            amount: course.price * 100, // Razorpay accepts amount in paise
            currency: 'INR',
            receipt: `receipt_${course._id}`,
        });

        // Send order ID to the frontend
        return res.status(httpsStatusCode.OK).json({
            success: true,
            orderId: order.id,
            amount: order.amount,
            currency: order.currency,
        });

    } catch (error) {
        console.error('Error creating Razorpay order:', error);
        return res.status(httpsStatusCode.INTERNAL_SERVER_ERROR).json({ 
            success: false, 
            message: 'Internal Server Error' 
        });
    }
};

module.exports = createCheckoutSession;
