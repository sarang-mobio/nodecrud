import PostModel from '@/resources/post/post.model';
import Post from '@/resources/post/post.interface';
import { Request } from 'express';
import userModel from '../user/user.model';

class PostService {
    private post = PostModel;
    private user = userModel;

    public async create(title: string, body: string, req: Request): Promise<Post> {

        try {
            const userId = (req as any).user._id;
            const post = await this.post.create({ title, body, userId });
            const user = await this.user.findByIdAndUpdate(userId,
                { $push: { posts: { postId: post._id } } },
                { new: true, useFindAndModify: false }
            );

            return post;
        } catch (error: any) {
            throw new Error('Unable to create post');
        }
    }


    public async find(req: Request) {
        try {
            const post = await this.post.find({ 'userId': (req as any).user });

            return post;
        } catch (error: any) {
            throw new Error('Unable to fetch post');

        }
    }

}

export default PostService;