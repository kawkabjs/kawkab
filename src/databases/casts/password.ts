import { CastsModel, password } from '../..';

const { CastsAttributes } = require('sutando');

export class PasswordCastAttribute extends CastsAttributes {
  static set(model: any, key: any, value: any, attributes: any) {
    const bcrypt = require('bcrypt');

    const password = 'yourPasswordHere';
    const saltRounds = 10;
        
    bcrypt.hash(password, saltRounds, function(err: any, hash: any) {
      if (err) {
        console.error('Error hashing password:', err);
      } else {
        return hash;
      }
    });
  }
}