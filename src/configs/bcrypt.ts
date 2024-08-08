import * as bcrypt from 'bcrypt';
import { log } from 'util';

export class Bcrypt {

    async hashPassword(password:string) {
        const saltRounds = 10;  // You can adjust this value
     // console.log("pass=",password);
      
        const hashed = await bcrypt.hash(password, saltRounds);
        return hashed;
      }

     async verifyPassword(plainPassword:string, hashedPassword:string) {
        const match = await bcrypt.compare(plainPassword, hashedPassword);
        return match;
      }
      async compare(password: string, hash: string): Promise<boolean> {
         return bcrypt.compare(password, hash);
       }

}