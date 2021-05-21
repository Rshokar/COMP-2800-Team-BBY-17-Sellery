/**
 * This script queries the DB for all active chats associated with this user. 
 * THen displays them to the DOM 
 * @author Ravinder Shokar 
 * @version 1.0 
 * @date May 20 2021 
 */

$(document).ready(async () => {
  renderChats()
})


/**
 * This function will get the chats associated with the currently logged in user. 
 * @author Ravinder Shokar 
 * @version 1.0 
 * @date May 20 2021 
 * @return [Chats] returns a array of list associated with the currently logged in user 
 */
function renderChats() {
  $.ajax({
    url: "/get_my_chats",
    type: "GET",
    dataTpye: "JSON",
    success: (data) => {
      const chats = data.results;
      const userID = data.userID;

      appendToHTML(chats, userID);


    },
    error: (err) => {
      console.log(err);
      return {
        status: "error",
        message: "Error"
      }
    }
  })

  let chats = null;

}

/**
 * This function will itrerate over a list of chats and display YOU and most recent MESSAGE and TIME
 * @author Ravinder Shokar 
 * @version 1.0
 * @date May 20 2021 
 * @param chats are the chats to be displayed in the DOM
 * @param UserID is used to verify who the message is from.
 */
function appendToHTML(chats, userID) {
  for (chat in chats) {
    html = buildHTML(chats[chat], userID);
    $("#chats").prepend(html);
  }
}

/**
 * This function will create the appropriate HTML for the Chat
 * @author Ravinder Shokar 
 * @version 1.0 
 * @date May 20 2021 
 * @param chat is the chat being appended to the HTML
 * @param userID is the ID of the currently logged in user. We use this to compare with 
 * the user ID of the message to find out who "YOU" is
 */
function buildHTML(chat, userID) {


  if (userID == chat.ID[0]) {
    html = `
    
      <div class="chat">
        <img src="https://dummyimage.com/100x100/000/fff">
        <a href="/chat?chat=${chat._id}"><span>${chat.names[1]}</span></a>
      </div>
    
    `
  } else {
    html = `
    
      <div class="chat">
        <img src="https://dummyimage.com/100x100/000/fff">
        <a href="/chat?chat=${chat._id}"><span>${chat.names[0]}</span></a>
      </div>
    
    `
  }

  return html;
}