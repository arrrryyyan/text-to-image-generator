import axios from "axios";
import userModel from "../models/userModel.js";
import FormData from "form-data";
import jwt from "jsonwebtoken";

export const generateImage = async (req, res) => {
  try {
    const token = req.headers.token;
    const { prompt } = req.body;

    if (!token || !prompt) {
      return res.json({ success: false, message: "Missing Details" });
    }

    // ✅ VERIFY USER
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await userModel.findById(decoded.id);

    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    // ✅ CREDIT CHECK
    if (user.creditBalance < 1) {
      return res.json({
        success: false,
        message: "No Credit Balance",
        creditBalance: user.creditBalance,
      });
    }

    // ✅ CLIPDROP REQUEST
    const formData = new FormData();
    formData.append("prompt", prompt);

    const { data } = await axios.post(
      "https://clipdrop-api.co/text-to-image/v1",
      formData,
      {
        headers: {
          "x-api-key": process.env.CLIPDROP_API,
          ...formData.getHeaders(),
        },
        responseType: "arraybuffer",
      }
    );

    // ✅ IMAGE CONVERSION
    const base64Image = Buffer.from(data, "binary").toString("base64");
    const resultImage = `data:image/png;base64,${base64Image}`;

    // ✅ DEDUCT CREDIT
    user.creditBalance -= 1;
    await user.save();

    res.json({
      success: true,
      message: "Image Generated",
      creditBalance: user.creditBalance,
      resultImage,
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};
