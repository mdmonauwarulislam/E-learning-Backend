const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const httpsStatusCode = require('../constant/httpStatuscode');
const Course = require("../models/coursesModel");

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

        // Create a new Stripe Checkout Session
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: 'inr',
                        product_data: {
                            name: course.title,
                            metadata: {
                                courseId: course._id.toString(),
                            },
                        },
                        unit_amount: course.price * 100,
                    },
                    quantity: 1,
                },
            ],
            mode: 'payment',
            success_url: `${process.env.CLIENT_URL}/congratulations?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.CLIENT_URL}/payment-failed`,
            client_reference_id: req.user._id.toString(),
        });

        // Send session ID as a response
        return res.status(httpsStatusCode.OK).json({ success: true, sessionId: session.id });

    } catch (error) {
        console.error('Error creating checkout session:', error);
        return res.status(httpsStatusCode.INTERNAL_SERVER_ERROR).json({ 
            success: false, 
            message: 'Internal Server Error' 
        });
    }
};

module.exports = createCheckoutSession;
