import bcrypt from "bcrypt";

const password = "password";
const salt = bcrypt.genSaltSync(10);
const hash = await bcrypt.hashSync(password, salt);
console.log(hash);
