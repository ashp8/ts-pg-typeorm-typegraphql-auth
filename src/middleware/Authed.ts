import { MiddlewareFn } from "type-graphql";
import { MyContext } from "../types/MyContext";

export const isAuth: MiddlewareFn<MyContext> = async ({context}, next)=>{
  if(!context.req.session.userId){
    return new Error("Not Authorized!");
  }

  return await next();
};