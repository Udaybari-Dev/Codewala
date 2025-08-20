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








// // This is your Prisma schema file,
// // learn more about it in the docs: https://pris.ly/d/prisma-schema

// // Looking for ways to speed up your queries, or scale easily with your serverless or edge functions?
// // Try Prisma Accelerate: https://pris.ly/cli/accelerate-init

// generator client {
//   provider = "prisma-client-js"
//   output   = "../src/generated/prisma"
// }

// datasource db {
//   provider = "postgresql"
//   url      = env("DATABASE_URL")
// }


// enum UserRole {
//   USER
//   ADMIN
// }

// enum Difficulty{
//   EASY
//   MEDIUM
//   HARD
// }
 
// model User {
//   id        String @id @default(uuid())
//   name      String?
//   email     String   @unique
//   image   String?
//   role  UserRole @default(USER)
//   password  String
//   createdAt DateTime @default(now())
//   updatedAt DateTime @updatedAt

//   problems Problem[]
// }

// model Problem {
//   id String @id @default(uuid())
//   title String
//   description String
//   difficulty Difficulty
//   tags String[]  // ["tag1" , "tag2" , "tag3"]
//   userId String
//   examples Json
//   constraints String
//   hints String?
//   editorial String?

//   testcases Json
//   codeSnippets Json 
//   referenceSolution Json

//   createdAt DateTime @default(now())
//   updatedAt DateTime @updatedAt

//   //relationships

//   user User @relation(  fields: [userId], references: [id], onDelete: Cascade)
  
// }