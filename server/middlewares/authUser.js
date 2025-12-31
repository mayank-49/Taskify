import jwt from "jsonwebtoken";

export const userAuth = async (req, res, next) => {
  const { token } = req.cookies;
  if (!token) {
    return res.json({
      success: false,
      message: "Unauthorized! No token provided",
    });
  }

  try {
    const tokenDecoded = jwt.verify(token, process.env.JWT_SECRET);

    const userId = tokenDecoded.id || tokenDecoded._id;

    if (!userId) {
      return res.json({
        success: false,
        message: "Unauthorized! Invalid token payload",
      });
    }

    req.userId = userId;
    next();
  } catch (error) {
    console.log(error.message);
    return res.json({success: false, message: error.message});
  }
};
