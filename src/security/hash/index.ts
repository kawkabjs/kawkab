import bcrypt from 'bcrypt';

export class Hash {
  async generate(data: string, saltRounds:number = 10) {
    return await bcrypt.hash(data, saltRounds);
  }

  async verify(data: string, hash: string) {
    return await bcrypt.compare(data, hash);
  }
}