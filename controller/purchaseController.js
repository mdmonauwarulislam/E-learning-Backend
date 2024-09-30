const Razorpay = require('razorpay');
const Enrollment = require("../models/EnrollmentModel");
const Course = require("../models/coursesModel");
const User = require("../models/usersModel");
const httpsStatusCode = require("../constant/httpStatuscode");

// Initialize Razorpay instance
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Purchase course and enroll the user
const purchaseCourse = async (req, res) => {
  const userId = req.user._id;
  const { courseId } = req.body;

  try {
    // Check if the user is already enrolled
    const existingEnrollment = await Enrollment.findOne({ user: userId, course: courseId });
    if (existingEnrollment) {
      return res.status(httpsStatusCode.CONFLICT).json({
        success: false,
        message: 'You are already enrolled in this course.',
      });
    }

    // Validate course existence
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(httpsStatusCode.NOT_FOUND).json({
        success: false,
        message: 'Course not found.',
      });
    }

    // Create Razorpay order
    const order = await razorpay.orders.create({
      amount: course.price * 100, // Convert price to paise
      currency: 'INR',
      receipt: `receipt_${courseId}_${userId}`,
      payment_capture: 1, // Auto-capture payment
    });

    // Return the order details to the client
    return res.status(httpsStatusCode.OK).json({
      success: true,
      orderId: order.id,
      currency: order.currency,
      amount: order.amount,
      courseId: courseId,
    });

  } catch (error) {
    console.error('Error creating Razorpay order:', error);
    return res.status(httpsStatusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'An error occurred during the course enrollment process.',
      error: error.message,
    });
  }
};

// Handle Razorpay Webhook to enroll the user after payment success
const purchaseCourseFromWebhook = async (eventData) => {
  try {
    const { payment_id, order_id, courseId, userId } = eventData;

    // Validate user and course existence
    const user = await User.findById(userId);
    const course = await Course.findById(courseId);

    if (!user || !course) {
      console.error('User or course not found during webhook processing.');
      return;
    }

    // Check if the user is already enrolled in the course
    const existingEnrollment = await Enrollment.findOne({ user: userId, course: courseId });
    if (existingEnrollment) {
      console.log('User is already enrolled in this course.');
      return;
    }

    // Create a new enrollment
    const newEnrollment = await Enrollment.create({
      user: userId,
      course: courseId,
      enrolledOn: new Date(),
    });

    // Update the user's purchasedCourses array
    user.purchasedCourses.push(courseId);
    await user.save();

    // Update the course's purchasedBy array
    course.purchasedBy.push(userId);
    await course.save();

    console.log('Webhook enrollment successful!');
  } catch (error) {
    console.error('Error processing Razorpay webhook for course enrollment:', error);
  }
};

module.exports = {
  purchaseCourse,
  purchaseCourseFromWebhook,
};
