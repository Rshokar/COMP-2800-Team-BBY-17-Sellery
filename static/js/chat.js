var socket = io();

const submit = document.getElementById("submit");
const input = document.getElementById("input_field");
const messages = document.getElementById("messages");

const url = new URL(window.location.href);
const roomID = url.searchParams.get('chat');


//Set up Dom
loadChat(roomID);


// Join chatroom
socket.emit("joinRoom", roomID);

//Message from server
socket.on('message', (msg) => {
  console.log(msg)
  outputMessage(msg)
})


submit.addEventListener('click', (e) => {
  e.preventDefault();
  if (input.value) {
    socket.emit('chat message', input.value, roomID);
    input.value = '';
    input.focus()
    messages.scrollTop = messages.scrollHeight;
  }
});


/**
 * This function will output the msg to the dom in the correct format
 * @author Ravinder Shokar 
 * @version 1.0 
 * @date May 18 2021
 * @param {string} msg 
 */
function outputMessage(msg) {
  console.log(msg);
  var div = document.createElement("div");
  div.classList.add("message");

  //This will needed to be filled with either sender or reciever
  //div.classList.add(person)
  let html;
  if (isMine(msg.user.ID)) {
    html =
      `
      <p class="text me">
        ${msg.msg}
      </p>
         <span class="meta">${msg.user.name} ${msg.time}</span>
      `;
  } else {
    html = `
        <p class="text you">
        ${msg.msg}
        </p>
        <span class="meta">${msg.user.name} ${msg.time}</span>
        `;
  }


  div.innerHTML = html

  messages.append(div);
}



/**
 * This function will make an ajax call to the server and get all of 
 * the chats for this room 
 * @author Ravinder Shokar 
 * @version 1.0 
 * @date May 20 2021
 * @param room is the room ID
 */
function loadChat(room) {
  console.log(room);
  $.ajax({
    url: "/get_chat",
    type: "GET",
    dataType: "JSON",
    data: { room },
    success: (data) => {
      $("#input span").attr("id", data.me.ID);
      console.log(data);
      $("#you").text(data.you.name)
      for (let msg in data.messages) {
        outputMessage(msg);
      }
    },
    error: (err) => {
      console.log(err);
    }
  })
}

/**
 * This function will get the ID of the current USer form the HTML and 
 * compare it to the inputed field. Is the same it returs true, if not 
 * returns false
 * @author Ravinder Shokar 
 * @version 1.0 
 * @date May 20 2021 
 * @param id is the id of a user.
 */
function isMine(id) {
  return $("#input span").attr("id") == id;
}