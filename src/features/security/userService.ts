import { User } from '@prisma/client';
import securityUtils, { ObfuscatedUser } from 'src/features/security/securityUtils';
import { prisma } from '../shared/prisma';

interface UserProvider {
  register(userData:Omit<User, 'isVerified'>):Promise<ObfuscatedUser>;
  setVerified(username:string, isVerified: boolean):Promise<ObfuscatedUser>;
  changeEmail(username:string, newEmail:string):Promise<ObfuscatedUser>;
  changePassword(username:string, oldPassword:string, newPassword:string):Promise<ObfuscatedUser>;
  update(userData:User):Promise<ObfuscatedUser>; //! !!!!!!! Must filter props passed
  delete(username:string):Promise<void>; //! !!!!!!! Must filter props passed
  get(username: string):Promise<ObfuscatedUser|undefined>;
  get(username: string, preventObfuscation: true):Promise<User|undefined>;
  list(skip:number, take:number): Promise<ObfuscatedUser[]>;
  getForEmail(email:string): Promise<ObfuscatedUser|undefined>;
  obfuscateEmail(email: string): string;
  //! ! TODO Implement "Disable User"
}

export const USERNAME_REGEX_STR = '^[\\d._a-z]{3,}$';
export const usernameRegex = new RegExp(USERNAME_REGEX_STR);

const userService: UserProvider = {
  async register(userData: User) {
    //* check username for allowed characters
    if (!usernameRegex.test(userData.username)) {
      throw new Error(`Invalid username provided. Allowed pattern is: ${USERNAME_REGEX_STR}`);
    }
    //* check if username is taken
    let someUser = await this.get(userData.username);
    if (someUser) {
      throw new Error(`Username "${userData.username}" already taken`);
    }
    //* check if e-mail is in use
    someUser = await this.getForEmail(userData.email);
    if (someUser) {
      throw new Error(`Email "${userData.email}" already in use by another user`);
    }
    const data: User = { ...userData, isVerified: false };
    data.pwd = await securityUtils.hash(data.pwd);
    const dbUser = await prisma.user.create({ data });
    return securityUtils.obfuscateUser(dbUser);
  },
  async setVerified(username: string, isVerified: boolean): Promise<ObfuscatedUser> {
    const dbUser = await prisma.user.update({ data: { isVerified }, where: { username } });
    return securityUtils.obfuscateUser(dbUser);
  },
  async changeEmail(username: string, newEmail: string): Promise<ObfuscatedUser> {
    //* check if new e-mail is in use
    const someUser = await this.getForEmail(newEmail);
    if (someUser) {
      throw new Error(`Email "${newEmail}" already in use by another user`);
    }
    const dbUser = await prisma.user.update({ data: { emailOnSwitch: newEmail }, where: { username } });
    return securityUtils.obfuscateUser(dbUser);
  },
  async changePassword(username: string, oldPassword: string, newPassword: string): Promise<ObfuscatedUser> {
    const user = await prisma.user.findUnique({ where: { username } });
    if (!user) throw new Error(`Could not find user with username: ${username}`);
    if (!user.isVerified) throw new Error(`User ${username} is not verified and can't change password`);
    //* check old password
    if (!await securityUtils.compare(oldPassword, user.pwd)) throw new Error('Old password invalid');
    const newPwdHash = await securityUtils.hash(newPassword);
    const dbUser = await prisma.user.update({ data: { pwd: newPwdHash }, where: { username } });
    return securityUtils.obfuscateUser(dbUser);
  },
  async delete(username: string): Promise<void> {
    await prisma.user.delete({ where: { username } });
  },
  async get(username: string, preventObfuscation = false): Promise<ObfuscatedUser | undefined> {
    const user = await prisma.user.findUnique({ where: { username } });
    if (user) {
      return preventObfuscation ? (user as ObfuscatedUser) : securityUtils.obfuscateUser(user);
    }
    return undefined;
  },
  async getForEmail(email: string, preventObfuscation = false): Promise<ObfuscatedUser | undefined> {
    const user = await prisma.user.findUnique({ where: { email } });
    if (user) {
      return preventObfuscation ? (user as ObfuscatedUser) : securityUtils.obfuscateUser(user);
    }
    return undefined;
  },
  async list(skip: number, take: number): Promise<ObfuscatedUser[]> {
    const users = await prisma.user.findMany({ skip, take });
    return users.map((e) => securityUtils.obfuscateUser(e));
  },
  obfuscateEmail(email: string): string {
    const [prefix, suffix] = email.split('@');
    return `${prefix.slice(0, 1)}***${prefix.slice(-3)}@${suffix}`;
  },
  async update(userData): Promise<ObfuscatedUser> {
    const { username, ...userDataRest } = userData;
    const dbUser = await prisma.user.update({ where: { username }, data: userDataRest });
    return securityUtils.obfuscateUser(dbUser);
  },
};

export default userService;
