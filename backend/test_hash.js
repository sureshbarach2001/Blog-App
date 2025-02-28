const bcrypt = require("bcryptjs");

const password = "SecurePass123@";
const saltRounds = 12;

bcrypt.hash(password, saltRounds, (err, hash) => {
  if (err) {
    console.error("Error hashing password:", err);
  } else {
    console.log("Generated Hash:", hash);
  }
});
