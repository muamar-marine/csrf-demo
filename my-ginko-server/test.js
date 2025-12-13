import bcrypt from 'bcryptjs';

const test = ['FatuiIzKooL234', 'ChumIzFum909', 'xxx123PwNdxxx'];

console.log(test.map((e) => bcrypt.hashSync(e, 10)));
