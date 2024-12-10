import bcrypt from 'bcrypt';

export class Password {
  async hash(password: string) {
    const saltRounds = 10;
    return await bcrypt.hash(password, saltRounds);
  }

  async verify(password: string, hash: string) {
    return await bcrypt.compare(password, hash);
  }
}