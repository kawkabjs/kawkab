import crypto from 'crypto';

export class Encryption {
  private algorithm: string;
  private secretKey: crypto.CipherKey | Buffer;
  private iv: crypto.BinaryLike | Buffer;

  constructor() {
    this.algorithm = 'aes-256-cbc';
    this.secretKey = crypto.randomBytes(32);
    this.iv = crypto.randomBytes(16);
  }

  encrypt(text: string) {
    const cipher = crypto.createCipheriv(this.algorithm, this.secretKey, this.iv);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return {
      iv: this.iv.toString('hex'),
      content: encrypted
    };
  }

  decrypt(hash: { iv: WithImplicitCoercion<string> | { [Symbol.toPrimitive](hint: 'string'): string; }; content: string; }) {
    const decipher = crypto.createDecipheriv(this.algorithm, this.secretKey, Buffer.from(hash.iv, 'hex'));
    let decrypted = decipher.update(hash.content, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  }
}
