import {v4} from 'uuid';
import { CToken } from '../entity/CToken';
export const createConfirmationUrl = (userId: number): string =>{
  const vvid = v4();
  const saveToken = async()=>{await CToken.create({token: vvid}).save()};
  saveToken();
  return `http://localhost:3000/user/confirm/${vvid}`;
}