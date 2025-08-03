import jwt from "jsonwebtoken";
import {db} from "../libs/db.js";



export const authMiddleware = async (req , res , next)=> {
    try {
            const token = req.cookies.jwt;

            if(!token){
                return res.status(401).json({
                    message: "unauthorized access, please login"
                })
            }

            let decoded 

            try {
                decoded = jwt.verify(token , process.env.JWT_SECRET)
                
            } catch (error) {
                return res.status(401).json({
                    message: "invalid token, please login again"
                })
            }
            const user = await db.user.findUnique({
                where: {
                    id: decoded.id
                },
                select: {
                    id: true,
                    email: true,
                    name: true,
                    image: true,
                    role: true
                }
            })

            if(!user){
                return res.status(404).json({message: "User not found"})
            }
            req.user = user; // Attach user to request object

            next();
            
    } catch (error) {
        console.error("Error in authenticating user:", error);
        res.status(500).json({
            message: "Error in authenticating user"
        }); 
    }
}



export const checkAdmin = async (req , res , next) => {

    try { 
        const userId = req.user.id;
        const user = await db.user.findUnique({
            where: {
                id: userId
            },
            Select : {
                role : true
            }
        })

        if (!user || user.role !== "ADMIN") {
            return res.status(403).json({
                message: "Access denied, admin only"
            });
        } 
        next();
    } catch (error) {
        console.error("Error checking admin role:", error);
        res.status(500).json({
            message: "Error checking admin role"
        });
        
    }
    
}












// middleware is like a security guard that checks if the user is authenticated before allowing access to certain routes