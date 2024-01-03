const multer = require("multer");
const fs = require("fs-extra");
const path = require("path");
const User = require("../models/User");

const upload = multer({
    storage: multer.diskStorage({
        destination: async (req, file, callback) => {
            let type = req.params.type;
            let path = ``;
            if (type === "profilpic") {
                path = `./uploads/${type}`;
            }
            else if (type === "chatImage") {
                path = `./uploads/${type}`;
            }

            if (!fs.existsSync(path)) {
                fs.mkdirSync(path, { recursive: true });
            }

            fs.mkdirsSync(path);
            callback(null, path);
        },
        filename: async (req, file, callback) => {

            let type = req.params.type;
            let user_id = req.params.user_id;

            
            const { userId, friendId } = req.params;

            const user = await User.findById(userId);
            const friendObj = user.friends.find(
                (friend) => friend.friendId.toString() === friendId
            );

            const lastMessage = friendObj.messages.reduce((prev, current) =>
                prev.timestamp > current.timestamp ? prev : current
            );

            //   const latestProduct = await models.Product.findOne({
            //     paranoid : false,
            //     order: [["product_id", "DESC"]],
            //     attributes: ["product_id"],
            //   });

            //   const latestPost = await models.Post.findOne({
            //     paranoid : false,
            //     order: [["post_id", "DESC"]],
            //     attributes: ["post_id"],
            //   });

            //   const lastestStore = await models.Store.findOne({
            //     paranoid : false,
            //     order: [["store_id", "DESC"]],
            //     attributes: ["store_id"]
            //   })

            //   let product_id = 1;
            //   if (latestProduct) {
            //     product_id = latestProduct.dataValues.product_id + 1;
            //   }

            //   let post_id = 1;
            //   if (latestPost) {
            //     post_id = latestPost.dataValues.post_id + 1;
            //   }

            //   let store_id = 1;
            //   if(lastestStore){
            //     store_id = lastestStore.dataValues.store_id + 1;
            //   }

            const fileExtension = path.extname(file.originalname).toLowerCase();
            if (user_id != undefined && type === "profilpic") {
                callback(null, `${user_id}.jpg`);
            } else if (friendId != undefined && type === "chatImage") {
                callback(null, `${lastMessage.id}.jpg`);
            }
        },
    }),
});

module.exports = upload;