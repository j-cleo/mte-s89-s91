const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const userRoutes = require("./routes/user.js");
const blogRoutes = require("./routes/blog.js");

const app = express();
const port = 4000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect("mongodb://admin:admin1234@ac-ds4tws7-shard-00-00.4tgaaxh.mongodb.net:27017,ac-ds4tws7-shard-00-01.4tgaaxh.mongodb.net:27017,ac-ds4tws7-shard-00-02.4tgaaxh.mongodb.net:27017/BlogApp?ssl=true&replicaSet=atlas-ktgb23-shard-0&authSource=admin");

let db = mongoose.connection;

db.on("error", console.error.bind(console, "Connection Error!"));

db.once("open", () => console.log("Successfully connected to Mongo Database!"));

const corsOptions = {
	origin: ['https://mte-s89-s91-six.vercel.app'],
	methods: ['GET', 'POST'],
	allowHeaders : ['Content-Type', 'Authorization'],
	credentials: true,
	optionsSuccessStatus : 200
};

app.use(cors());

app.use("/users", userRoutes);
app.use("/blogs", blogRoutes);

if(require.main === module){
	app.listen(process.env.PORT || 4000, () => {
	    console.log(`API is now online on port ${ process.env.PORT || 4000 }`)
	});
}

module.exports = {app, mongoose};