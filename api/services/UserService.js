import fs from 'fs';
import mime from "mime";
import util from "util";

module.exports = {

  findAll: async () => {
    let users = await db.User.findAll();
    return users;
  },

  findOne: async (userId) => {
    let user = await db.User.findById(userId);
    return user;
  }//,

  /*
    marked below codes jsut in case,
    if need to return a user's profile picture in future.
  */

  // findOneWithImages: async (userId) => {
  //   let user = await db.User.findById(userId);
  //   let userWithImage = UserService.withImage(user);
  //   return userWithImage;
  // },
  //
  // findAllWithImages: async () => {
  //   let users = await db.User.findAll();
  //   let usersWithImage = users.map(UserService.withImage);
  //   return usersWithImage;
  // },

  // withImage: (user) => {
  //   let userJson = user.toJSON();
  //   try {
  //     let src = `${__dirname}/../../assets/images/product/${product.id}.jpg`;
  //     let data = fs.readFileSync(src).toString("base64");
  //
  //     if (data) {
  //       let base64data = util.format("data:%s;base64,%s", mime.lookup(src), data);
  //       productJson.image = base64data;
  //     }
  //   } catch (error) {
  //     console.log(`can\'t find product ${product.id} image`);
  //     productJson.image = 'about:blank';
  //   }
  //   return productJson;
  // }

};
