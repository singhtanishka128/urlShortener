const express = require("express")
const urlRoute = require("./routes/url.js")
const { connectToMongoDB } = require("./connect")
const URL = require("./models/url")
require('dotenv').config();


const app = express()
const PORT = 8000

connectToMongoDB(process.env.MONGODB_URL).then(()=>console.log("mongodb connected"))

app.use(express.json())
app.use("/url", urlRoute)
app.get("/:shortId", async (req,res)=>{
    const shortId = req.params.shortId;
    const entry = await URL.findOneAndUpdate(
        {
        shortId,
        },
        {
            $push: {
                visitHistory: { timestamp: Date.now() },
            }
        }
)
res.redirect(entry.redirectURL)
})

app.listen(PORT,()=>console.log(`server started at PORT: ${PORT}`))