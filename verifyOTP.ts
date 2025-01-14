// In your `verifyOtp.js` or similar file

const expressAsyncHandler = require("express-async-handler");
const dotenv = require("dotenv");
dotenv.config();

// Mock database storage (for simplicity)
let otpStore = {}; // Email to OTP map (in-memory)

const verifyOtp = expressAsyncHandler(async (req, res) => {
  const { email, otp } = req.body;

  // Check if OTP exists and is not expired
  if (otpStore[email] && otpStore[email] === otp) {
    // OTP verified successfully
    delete otpStore[email]; // Remove OTP from the store
    res.status(200).json({ message: "OTP verified successfully" });
  } else {
    res.status(400).json({ error: "Invalid or expired OTP" });
  }
});

module.exports = { verifyOtp };
