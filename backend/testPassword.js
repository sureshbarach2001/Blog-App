const bcrypt = require("bcryptjs");

const storedHash = "$2b$12$g96R1kUG7uARLqED6jn8c.dMG9/OtvkMCUPziAgrB/xXmcEJK9hPS"; // Replace with your actual stored hash
const inputPassword = "SecurePass123@"; // The password you are trying to login with

bcrypt.compare(inputPassword, storedHash).then(match => {
    console.log(match ? "✅ Password matches!" : "❌ Password mismatch!");
});
