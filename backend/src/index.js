import express from "express";
import dotenv from "dotenv";
import cookieparser from "cookie-parser";




import authRoutes from "./routes/auth.routes.js";
import problemRoutes from "./routes/problem.routes.js";


dotenv.config();

const app = express();


app.use(express.json());
app.use(cookieparser());



app.get("/" , (req, res) =>{
    res.send("hello guys welcome to code wala🔥");
})


app.use("/api/v1/auth" , authRoutes);
app.use("/api/v1/problems" , problemRoutes);
 


app.listen(process.env.PORT, () => {
    console.log("server is running on port 8080 ");
})