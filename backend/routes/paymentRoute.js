const express = require("express");

const {
  processPayments,
  sendStripeApiKey,
} = require("../controllers/paymentController");

const router = express.Router();

const { isAuthenticatedUser } = require("../middleware/auth");

router.route("/process/payment").post(isAuthenticatedUser, processPayments);
router.route("/stripeapikey").get(isAuthenticatedUser, sendStripeApiKey);

module.exports = router;
