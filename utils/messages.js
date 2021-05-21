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
function formatMessage(owner, message) {
  return {
    owner,
    message,
    timeStamp: moment().format("h:mm a")
  }
}




module.exports = { formatMessage };