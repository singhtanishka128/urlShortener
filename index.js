const express = require("express")
const urlRoute = require("./routes/url.js")
const { connectToMongoDB } = require("./connect")
const URL = require("./models/url")
const staticRoute = require("./routes/staticRouter.js")
require('dotenv').config();
const path = require("path")


const app = express()
const PORT = 8000

connectToMongoDB(process.env.MONGODB_URL).then(()=>console.log("mongodb connected"))

app.set("view engine", "ejs");
app.set("views", path.resolve("./views"))


app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.get("/test", async (req,res)=>{
    const allUrls = await URL.find({});
    return res.render("home", {
        urls: allUrls,
    })
})

app.use("/url", urlRoute)
app.use("/",staticRoute)

app.get("/url/:shortId", async (req,res)=>{
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