const multer = require("multer");
const fs = require("fs-extra");
const path = require("path");
const User = require("../models/User");
const GroupChat = require("../models/GroupChat");

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
            else if (type === "chatImageGroup") {
                path = `./uploads/${type}`;
            }
            else if (type === "profpicGroup") {
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
            let lastMessage
            let groupId = req.params.groupId
            let group_id = req.params.group_id

            const { userId, friendId } = req.params;

            if (userId && friendId) {
                const user = await User.findById(userId);
                const friendObj = user.friends.find(
                    (friend) => friend.friendId.toString() === friendId
                );

                lastMessage = friendObj.messages.reduce((prev, current) =>
                    prev.timestamp > current.timestamp ? prev : current
                );
            }

            
            if(groupId){
                const group = await GroupChat.findById(groupId);
                lastMessage = group.messages.reduce((prev, current) =>
                prev.timestamp > current.timestamp ? prev : current
                );
            }
            
            console.log(groupId);
            console.log(lastMessage);

            const fileExtension = path.extname(file.originalname).toLowerCase();
            if (user_id != undefined && type === "profilpic") {
                callback(null, `${user_id}.jpg`);
            } else if (friendId != undefined && type === "chatImage") {
                callback(null, `${lastMessage.id}.jpg`);
            } else if (groupId != undefined && type === "chatImageGroup") {
                callback(null, `${lastMessage.id}.jpg`);
            } else if (group_id != undefined && type === "profpicGroup") {
                callback(null, `${group_id}.jpg`);
            }
            
        },
    }),
});

module.exports = upload;