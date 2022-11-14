import token from "@/utils/token";
import userModel from "./user.model";

/**
 * UserService
 */
class UserService {

    /**
     * User Modal
     */
    private user = userModel;

    /**
     * Register User
     *
     * @param name
     * @param email
     * @param password
     * @param role
     * @returns
     */
    public async register(name: string, email: string, password: string, role: string): Promise<string | void> {
        try {
            const user = await this.user.create({ name, email, password, role });

            const accessToken = token.createToken(user);

            return accessToken;
        } catch (error: any) {
            throw new Error(error.message)
        }
    }

    /**
     * Login User
     *
     * @param email
     * @param password
     * @returns
     */
    public async login(email: string, password: string): Promise<string | Error> {
        try {
            const user = await this.user.findOne({ email });

            if (!user) {
                throw new Error('unable to find user with that email');
            }

            if (await user.isValidPassword(password)) {
                return token.createToken(user)
            } else {
                throw new Error('Wrong creadentials given')
            }
        } catch (error: any) {
            throw new Error('unable to create user');
        }
    }

    /**
     * Get Users Profile
     *
     * @param users
     * @returns
     */
    public async getUsersProfile(users: any): Promise<Response | Error | any> {
        try {
            const user = await this.user.findById({ '_id': users._id }).populate('posts.postId', "-_id -__v -userId -createdAt -updatedAt");

            return user;
        } catch (error: any) {
            throw new Error('Wrong creadentials given')
        }
    }
}


export default UserService;