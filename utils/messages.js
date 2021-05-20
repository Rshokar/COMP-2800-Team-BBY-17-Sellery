const { ObjectID } = require('bson');
const moment = require('moment');


/**
 * THis function will format a message suitable for the DB's needs 
 * @author Ravinder Shokar 
 * @version 1.0
 * @date May 19 2021
 * @param {User} user cotaining all neccesary information.  
 * @param {*} msg beging sent to room
 * @returns a obj containing msg, user, and timestamp. 
 */
function formatMessage(user, msg) {
  return {
    user,
    msg,
    time: moment().format("h:mm a")
  }
}

/**
 * This function will push a message to the chatroom in mongoDB to save all messages
 * @author Mike Lim
 * @version 1.0
 * @date May 20 2021
 * @param {} message message object holding the single message
 */
function addMessage(message) {
  const db = client
  .db("sellery")
  .collection("chat");

  db.update({ "_id": ObjectID(message.id) }, { $push: { "messages": message }});
}




module.exports = { formatMessage };