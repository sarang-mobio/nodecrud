import validationMiddleware from "@/middleware/validation.middleware";
import Controller from "@/utils/interfaces/controller.interface";
import { Router, Request, Response, NextFunction } from "express";
import UserService from "./user.service";
import validate from '@/resources/user/user.validation';
import HttpException from "@/utils/exceptions/http.exception";
import { sendEmail } from "@/utils/mail";
import { registerMail } from '@/utils/constants'
import authMiddleware from "@/middleware/auth.middleware";
class UserController implements Controller {

    public path = '/users';
    public router = Router();
    private UserService = new UserService();

    constructor() {
        this.initialiseRoutes();
    }

    /**
     * initialiseRoutes
     */
    private initialiseRoutes(): void {
        this.router.post(`${this.path}/register`, validationMiddleware(validate.register), this.register);
        this.router.post(`${this.path}/login`, validationMiddleware(validate.login), this.login);
        this.router.get(`${this.path}/get-profile`, authMiddleware, this.getUsersProfile);
    }

    /**
     * Register New User
     *
     * @param req
     * @param res
     * @param next
     */
    private register = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
        try {
            const { name, email, password } = req.body;

            const token = await this.UserService.register(name, email, password, 'user');
            sendEmail(
                'sarang.belsare@mobiosolutions.com',
                'sarang.belsare@mobiosolutions.com',
                'successfull registered',
                registerMail
            )
            res.status(201).json({ token });

        } catch (error: any) {
            next(new HttpException(400, error.message))
        }
    }

    /**
     * Login User
     *
     * @param req
     * @param res
     * @param next
     */
    private login = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
        try {
            const { email, password } = req.body;

            const token = await this.UserService.login(email, password);
            if (token) {
                res.status(200).json({ data: { status: 'Success', token } });
            }

        } catch (error: any) {
            next(new HttpException(400, error.message))
        }
    }

    private getUsersProfile = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
        try {
            const user = (req as any).user
            const users = await this.UserService.getUsersProfile(user);

            return res.status(200).json({ data: { status: 'Success', users } });
        } catch (error: any) {

        }
    }
}

export default UserController;