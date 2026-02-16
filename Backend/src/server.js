require('dotenv').config();
const app = require('./app');
const cors = require("cors");

const PORT = process.env.PORT || 5000;


app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true
  })
);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
