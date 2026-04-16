import { generateStreamToken } from "../config/stream.js";


export const getStreamToken = async (requestAnimationFrame, res) => {
  try {
    const token = generateStreamToken(requestAnimationFrame.auth().userId);
    res.status(200).json({ token });
  } catch (error) {
    console.log("Error in generating stream token:", error);
    res.status(500).json({ error: error.message });
  }
};
