import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
const app=express()

app.use(
  cors({
    origin: "https://car-rental-client-eosin.vercel.app",
        // origin: "http://localhost:5173",
    credentials: true
  })
);
app.use(express.json({limit:"16kb"}))
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
import adminRouter from "./routes/admin.routes.js"; // ← yeh add karo

// routes declaration
app.use("/api/v1/users", userRouter)
app.use("/api/v1/owners", ownerRouter)
app.use("/api/v1/bookings", bookingRouter)
app.use("/api/v1/auth", googleRouter);
app.use("/api/v1/blogs", blogRouter);
app.use("/api/v1/users/blogs", commentRouter);
app.use("/api/v1/admin", adminRouter); // ← yeh add karo

app.use(errorHandler); 

export {app}