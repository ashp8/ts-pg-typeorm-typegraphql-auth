import { Ctx, Query, Resolver, Root} from "type-graphql";
import { User } from "../entity/User";
import { MyContext } from "../types/MyContext";

@Resolver()
export class MeResolver{
  @Query(() => User, {nullable: true})
  async me(
    @Ctx() {req}: MyContext
  ): Promise<User | undefined>{
    if(!req.session.userId){
      return undefined;
    }
    return User.findOne(req.session.userId);

  }
  
}