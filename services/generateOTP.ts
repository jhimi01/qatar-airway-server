import otpGenerator from "otp-generator";

// Declare `generateOTP` only once
const generateOTP = (): string => {
  const OTP = otpGenerator.generate(6, {
    upperCaseAlphabets: true,
    specialChars: false,
  });

  return OTP;
};

export default generateOTP;  // Use ES module export
