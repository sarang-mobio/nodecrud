import { Router, Request, Response, NextFunction } from 'express';
import Controller from '@/utils/interfaces/controller.interface';
import HttpException from '@/utils/exceptions/http.exception';
import validationMiddleware from '@/middleware/validation.middleware';
import validate from '@/resources/post/post.validation';
import PostService from '@/resources/post/post.service';
import auth from '@/middleware/auth.middleware'

class PostController implements Controller {
    public path = '/posts';
    public router = Router();

    private PostService = new PostService();
    constructor() {
        this.initialiseRoutes();
    }

    private initialiseRoutes(): void {
        this.router.post(`/posts`, validationMiddleware(validate.create), auth, this.create);
        this.router.get(`/get-all-posts`, auth, this.getPosts);
    }

    private create = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
        try {
            const { title, body } = req.body;
            const post = await this.PostService.create(title, body, req);

            res.status(201).json({ data: { code: 201, status: 'success', post } });
        } catch (e: any) {
            next(new HttpException(400, 'Cannot create post'))
        }
    }

    private getPosts = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
        console.log((req as any).user);

        const posts = await this.PostService.find(req);
        res.status(200).json({ data: { code: 200, status: 'success', posts } });

    }
}

export default PostController