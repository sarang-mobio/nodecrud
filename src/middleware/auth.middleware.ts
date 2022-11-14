import userModel from "@/resources/user/user.model";
import HttpException from "@/utils/exceptions/http.exception";
import Token from "@/utils/interfaces/token.interface";
import { verifyToken } from "@/utils/token";
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

async function authMiddleware(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    const bearer = req.headers.authorization;

    if (!bearer || !bearer.startsWith('Bearer ')) {
        return next(new HttpException(401, 'Unauthorised'))
    }

    const accessToken = bearer.split('Bearer ')[1];

    try {
        const payload: Token | jwt.JsonWebTokenError = await verifyToken(accessToken);

        if (payload instanceof jwt.JsonWebTokenError) {
            return next(new HttpException(401, 'Unauthorised'))
        }

        const user = await userModel.findById(payload.id).select('-password').exec();

        if (!user) {
            return next(new HttpException(401, 'Unauthorised'))
        }

        (req as any).user = user;

        return next();
    } catch (error: any) {
        return next(new HttpException(401, 'Unauthorised'));
    }
}

export default authMiddleware;
