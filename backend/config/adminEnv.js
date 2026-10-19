// Reads admin settings from the environment. Strips spaces/quotes and accepts
// ADMIN_TOKEN_SECRET as an alias of JWT_SECRET.
const clean = (v) => String(v || "").trim().replace(/^["']|["']$/g, "");

const getAdminEnv = () => ({
  username: clean(process.env.ADMIN_USERNAME),
  password: clean(process.env.ADMIN_PASSWORD),
  secret: clean(process.env.JWT_SECRET || process.env.ADMIN_TOKEN_SECRET),
});

module.exports = { getAdminEnv };