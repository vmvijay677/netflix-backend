const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const authRoute = require('./Routes/Auth');
const userRoute = require('./Routes/Users');
const movieRoute = require('./Routes/Movies');
const listRoute = require('./Routes/Lists');

const app = express();

dotenv.config();
app.use(express.json());
app.use(cors());

const PORT = 8000 || process.env.PORT;

mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log("Mongo is connected"))
    .catch((err) => console.log(err));

app.get("/", function (req, res) {
    res.send("This is Netflix API!");
});

app.use("/api/auth", authRoute);

app.use("/api/users", userRoute);

app.use("/api/movies", movieRoute);

app.use("/api/lists", listRoute);

app.listen(PORT, () => {
    console.log("Server is connected!");
});
