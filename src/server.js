const { PORT = 8000 } = process.env;
const app = require("./app");
require("dotenv").config();

const listener = () => console.log(`Listening on Port ${PORT}!`);

app.listen(PORT, listener);
