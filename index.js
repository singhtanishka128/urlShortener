const express = require("express")
const urlRoute = require("./routes/url.js")
const { connectToMongoDB } = require("./connect")
require('dotenv').config();


const app = express()
const PORT = 8000

connectToMongoDB(process.env.MONGODB_URL).then(()=>console.log("mongodb connected"))

app.use(express.json())
app.use("/url", urlRoute)

app.listen(PORT,()=>console.log(`server started at PORT: ${PORT}`))