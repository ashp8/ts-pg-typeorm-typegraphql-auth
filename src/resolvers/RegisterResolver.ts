import { Arg, Authorized, Mutation, Query, Resolver, UseMiddleware} from "type-graphql";
import  bcrypt from 'bcryptjs';
import { RegisterInput, User } from "../entity/User";
import { isAuth } from "../middleware/Authed";
import { sendMail } from "../utils/sendEmail";
import { createConfirmationUrl } from "../utils/createConfirmationUrl";
import { CToken } from "../entity/CToken";

@Resolver()
export class RegisterResolver{
  @Query(() => [User])
  async users(){
     return await User.find({});
  }

  @UseMiddleware(isAuth)
  @Query(()=>String)
  async hello(): Promise<String>{
    return "Hello world";
  };

  @Mutation(() => User)
  async register(
    @Arg('data'){ email, firstName
    , lastName, password} : RegisterInput,
    ): Promise<User>{
      const hashedPassword = await bcrypt.hash(password, 12); 
      const user = await User.create({
        firstName,
        lastName,
        email,
        password: hashedPassword
      }).save();
      
      await sendMail(email, createConfirmationUrl(user.id));
      return user;

  }
}