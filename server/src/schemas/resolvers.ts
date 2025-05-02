import { User } from '../models/index.js';
import { signToken, AuthenticationError } from '../services/auth.js';

interface UserArgs {
    username: string;
  }

interface CreateUserArgs {
    input:{
      username: string;
      email: string;
      password: string;
      savedBooks: BookInput[];
    }
  }

interface LoginUserArgs {
    email: string;
    password: string;
}

interface BookInput {
    authors: [string];
    description: string;
    bookId: string;
    image: string;
    link: string;
    title: string;
}


interface DeleteBookArgs {
    bookId: string;   
}

const resolvers = {
    Query: {
        user: async (_parent: any, { username }: UserArgs) => {
            return User.findOne({ username });
        }, 
        me: async (_parent: any, _args: unknown, context: any) => {
            if (context.user) {
              return User.findOne({ _id: context.user._id });
            }
            throw new AuthenticationError('Could not authenticate user.');
        },       
    },

    Mutation: {
        createUser: async (_parent: any, { input }: CreateUserArgs) => {
            const user = await User.create({ ...input });
          
            const token = signToken(user.username, user.email, user._id);
            console.log("create user triggered: " + user.username);
            return { token, user };
        },

        login: async (_parent: any, { email, password }: LoginUserArgs) => {
            const user = await User.findOne({ email });
      
            if (!user) {
              throw new AuthenticationError('Could not authenticate user.');
            }
      
            const correctPw = await user.isCorrectPassword(password);
      
            if (!correctPw) {
              throw new AuthenticationError('Could not authenticate user.');
            }
      
            const token = signToken(user.username, user.email, user._id);
      
            return { token, user };
          },

        saveBook: async (_parent: any, { book }: { book: BookInput }, context: any) => {
            if (context.user) {
                return User.findOneAndUpdate(
                    { _id: context.user._id },
                    { $addToSet: { savedBooks: book }, },
                    { new: true, runValidators: true, }
                );
            }
            throw new AuthenticationError("You must be logged in");
        },

        deleteBook: async (_parent: any, { bookId }: DeleteBookArgs, context: any) => {
            if (context.user) {
                return User.findOneAndUpdate(
                    { _id: context.user._id },
                    { $pull: { savedBooks: { bookId: bookId } }, },
                    { new: true, }
                );
            }
            throw new AuthenticationError("You must be logged in");
        },
    },
};

export default resolvers;