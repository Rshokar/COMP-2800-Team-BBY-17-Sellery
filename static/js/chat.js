var socket = io();

const submit = document.getElementById("submit");
const input = document.getElementById("input_field");
const messages = document.getElementById("messages");
const back = document.getElementById("button");

const url = new URL(window.location.href);
const roomID = url.searchParams.get('chat');


back.addEventListener("click", (e) => {
  window.location.href = "/chats";
})


//Set up Dom
loadChat(roomID);


//Message from server
socket.on('message', (msg) => {
  outputMessage(msg, { ID: 0 })
})


submit.addEventListener('click', (e) => {
  e.preventDefault();



  if (input.value) {
    let msg = buildMsgObj();
    console.log(msg);
    socket.emit('chat message', msg, roomID);
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
function outputMessage(msg, me, you) {
  console.log(msg);
  var div = document.createElement("div");
  div.classList.add("message");

  //This will needed to be filled with either sender or reciever
  //div.classList.add(person)
  let html;
  if (msg.owner.ID === me.ID) {
    div.classList.add("me");
    html =
      `
      <p class="text">
        ${msg.message}
      </p>
         <span class="meta">${msg.owner.name} ${msg.timeStamp}</span>
      `;
  } else if (msg.owner.ID == -1) {
    div.classList.add("chatbot");
    html = `
        <p class="text">
        ${msg.message}
        </p>
        <span class="meta">Chat Bot ${msg.timeStamp}</span>
        `;
  } else {
    div.classList.add("you");
    html = `
        <p class="text">
        ${msg.message}
        </p>
        <span class="meta">${msg.owner.name} ${msg.timeStamp}</span>
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
      $("#input p").text(data.me.name);
      $("#you").text(data.you.name)
      //console.log(data)
      for (let msg in data.messages) {
        outputMessage(data.messages[msg], data.me, data.you);
      }
      // Join chatroom
      socket.emit("joinRoom", roomID);
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


/**
 * This function will gather all data needed for a message in the DOM
 * and return an OBJ
 * @author Ravinder Shokar
 * @version 1.0
 * @date May 20 2021
 * @returns an msg obj with the format of 
 * {
 *  owner: { ID }
 *  message: "String"
 *  timeStamp: 
 * }
 */
function buildMsgObj() {
  var d = new Date();

  return {
    owner: {
      id: $("#input span").attr("id"),
      name: $("#input p").text(),
    },
    message: input.value,
    timeStamp: formatAMPM(d),
  }
}


/**
 * I could not be bothered to figure this out myself and i still need to do alot of things. 
 * https://stackoverflow.com/questions/8888491/how-do-you-display-javascript-datetime-in-12-hour-am-pm-format
 * Ravinder Shokar
 * @author WasiF
 * @date Sep 20 2020
 * @param {*} date  object
 * @returns string formated to AM PM
 */
function formatAMPM(date) {
  var hours = date.getHours();
  var minutes = date.getMinutes();
  var ampm = hours >= 12 ? 'pm' : 'am';
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  minutes = minutes < 10 ? '0' + minutes : minutes;
  var strTime = hours + ':' + minutes + ' ' + ampm;

  console.log(strTime);
  return strTime;
}