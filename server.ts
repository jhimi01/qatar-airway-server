// DATABASE_URL="postgresql://postgres:123@localhost:5432/qatardb"

// JWT_SECRET_KEY="f8ac80dff2dfe6bc21b20233f61b0b1605e2a5ca3a7f1a004fb74f336d791f2a37061543586106ad07ed53883d2ca02654a962f5194537c4d69958a691525e5a"

// EMAIL_USER=talukderjhimi@gmail.com
// EMAIL_PASS=ybsu hfpl pgqz onqn


// RECAPTCHA_SITE_KEY=6LchN7gqAAAAAN1x37YAX0nhMkvuta3w_0ZiRElH
// RECAPTCHA_SECRET_KEY=6LchN7gqAAAAAAmMXDCh5cYvgXEs22o4J_ZsKpVr




import dotenv from "dotenv";
import app from "./app";

dotenv.config();

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
