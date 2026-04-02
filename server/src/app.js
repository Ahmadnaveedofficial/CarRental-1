import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
const app=express()

app.use(
  cors({
    origin: "http://localhost:5173",
    
     credentials: true
  })
);
app.use(express.json({limit:"16kb"}))  //“Client JSON data bhejega, mujhe usay read karna hai.”
app.use(express.urlencoded({extended :true,limit:"16kb"}))
app.use(express.static("public"))
app.use(cookieParser())



// routes import
import userRouter from  './routes/user.routes.js'
import ownerRouter from "./routes/owner.routes.js"
import bookingRouter from "./routes/booking.routes.js"
import errorHandler from "./utils/errorHandler.js"
import googleRouter from "./routes/google.routes.js";
import commentRouter from "./routes/comment.route.js";
import blogRouter from "./routes/blog.route.js"; 
// //routes declaration
app.use("/api/v1/users",userRouter)
app.use("/api/v1/owners",ownerRouter)
app.use("/api/v1/bookings",bookingRouter)
app.use("/api/v1/auth", googleRouter);
app.use("/api/v1/blogs", blogRouter);
app.use("/api/v1/users/blogs", commentRouter);

app.use(errorHandler);
// //https://localhost:8000/api/v1/users/register


export {app}