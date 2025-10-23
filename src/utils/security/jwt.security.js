import jwt from "jsonwebtoken";

// =============================
// إنشاء Access + Refresh Tokens
// =============================
export const createTokens = ({
  payload = {},
  accessExpiresIn = process.env.JWT_EXPIRE || "1h",
  refreshExpiresIn = process.env.JWT_EXPIRE_REFRESH || "1y",
  accessSecret = process.env.JWT_SECRET,
  refreshSecret = process.env.JWT_SECRET_REFRESH,
} = {}) => {
  const accessToken = generateToken({
    payload,
    expiresIn: accessExpiresIn,
    secret: accessSecret,
  });

  const refreshTokenValue = generateToken({
    payload: { userId: payload.userId },
    expiresIn: refreshExpiresIn,
    secret: refreshSecret,
  });

  return { accessToken, refreshToken: refreshTokenValue };
};

// =============================
// إنشاء Token عام (Access أو Refresh)
// =============================
export const generateToken = ({
  payload = {},
  expiresIn = process.env.JWT_EXPIRE || "1h",
  secret = process.env.JWT_SECRET,
} = {}) => {
  return jwt.sign(payload, secret, { expiresIn });
};

// =============================
// التحقق من أي Token
// =============================
export const verifyToken = (token, secret) => {
  try {
    return jwt.verify(token, secret);
  } catch (err) {
    throw new Error("Invalid or expired token");
  }
};

