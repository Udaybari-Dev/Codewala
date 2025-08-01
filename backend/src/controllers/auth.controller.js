import bcrypt from "bcryptjs";
import {db} from "../libs/db.js";
import { UserRole } from "../generated/prisma/index.js";
import jwt from 'jsonwebtoken';



export const register = async(req,res) => {

    const {email , password , name} = req.body;

    try {
        const existingUser = await db.user.findUnique({
            where:{
                email: email
            }
        })

        if(existingUser){
            return res.status(400).json({
                message: "User already exists"
            }) 
        }

        const hashedPassword = await bcrypt.hash(password, 10);


        const newUser = await db.user.create({
            data :{
                email: email,
                password : hashedPassword,
                name : name,
                role: UserRole.USER

            }
        })

        const token = jwt.sign({ id: newUser.id} , process.env.JWT_SECRET ,{
            expiresIn: "7d"
        })

        res.cookie("jwt" , token,{
            httpOnly : true,
            sameSite : "strict",
            secure: process.env.NODE_ENV !== "developement",
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days

        })

        res.status(201).json({
            success: true,
            message:" User registered successfully",
            user:{
                id: newUser.id,
                email: newUser.email,
                name: newUser.name,
                role: newUser.role,
                image: User.image           
                  }
            })

         
    } catch (error) {
        console.log("error in registering user", error);
        res.status(500).json({
            error:"error creating user"
        })
    }

}

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
        const existingUser = await db.user.findUnique({
        where: { email }
        });

        if (!existingUser) {
        return res.status(404).json({ message: "User not found" });
        }

        const isPasswordCorrect = await bcrypt.compare(password, existingUser.password);

        if (!isPasswordCorrect) {
        return res.status(401).json({ message: "Invalid credentials" });
        }

        const token = jwt.sign({ id: existingUser.id }, process.env.JWT_SECRET, {
        expiresIn: "7d"
        });

        res.cookie("jwt", token, {
        httpOnly: true,
        sameSite: "strict",
        secure: process.env.NODE_ENV !== "development",
        maxAge: 7 * 24 * 60 * 60 * 1000 //  For 7 days
        });

        res.status(200).json({
        success: true,
        message: "Login successful",
        user: {
            id: existingUser.id,
            email: existingUser.email,
            name: existingUser.name,
            role: existingUser.role,
            image: existingUser.image
        }
        });

  } catch (error) {
    console.log("error in login user", error);
    res.status(500).json({ error: "Error logging in" });
  }
}

export const logout = async(req , res) => {

    try {

        res.clearCookie("jwt" ,{
          httpOnly: true,
          sameSite: "strict",
          secure: process.env.NODE_ENV !== "development",
        })
        
        res.status(200).json({     // 204 krte hai to koi content nahi ayega 
            success: true,
            message: "User logged out successfully"

        })
    } catch (error) {
        console.log("Error in logging out user", error);
    res.status(500).json({ error: "Error logging out" });
  }
}


export const check = async(req , res) => {

    try {
        res.status(200).json({
            success: true,
            message: "User is authenticaed",
            user: req.user // user is attached in auth middleware
        })
    } catch (error) {
        console.error("Errror in checking user authentication:", error);
        res.status(500).json({
            error: "Error checking user"
        })
    }
}
 
