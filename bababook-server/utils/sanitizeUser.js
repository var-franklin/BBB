/**
 * Strips the password field off a user document so it's safe to include in an API response.
 */
function sanitizeUser(user) {
  const { password, ...userWithoutPassword } = user;
  return userWithoutPassword;
}

module.exports = sanitizeUser;