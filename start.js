const app = require("./server");
const dotenv = require("dotenv");
dotenv.config({ path: "./.env" });

app.listen(process.env.PORT, () => {
  console.log("server is running");
});

// app.listen(3000);
