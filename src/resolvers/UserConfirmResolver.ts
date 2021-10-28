import { Arg, Authorized, Ctx, Mutation, Query, Resolver, UseMiddleware} from "type-graphql";
import { CToken } from "../entity/CToken";
import { MyContext } from "../types/MyContext";
import { User } from "../entity/User";

@Resolver()
export class UserConfirmResolver{
  @Mutation(() => String)
  async confirm(
    @Arg('token') token: string,
    @Ctx() {req}:MyContext
   ): Promise<boolean>{

    const tk = await CToken.findOne({where: {token}});
    console.log(token);
    console.log(tk);
    if(!tk){
      return false;
    }

    if(tk.expire < new Date()){
      await CToken.delete({id: tk.id});
      return false;
    }

    const user = await User.findOne({where: {id: req.session.userId}});
    user.confirmed = true;
    await user.save();
    await CToken.delete({id: tk.id});

    return true;

  }
}