const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const multer = require('multer');
const fs = require('fs');

const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');

const morgan = require('morgan');
const rfs = require('rotating-file-stream');
const path = require('path');


const methodOverride = require('method-override');

const { readFile } = require('fs');
const { MongoClient } = require('mongodb');
const { read } = require('fs/promises');
const ObjectId = require('mongodb').ObjectId;

const app = express();

"use strict";

// set storage
var storage = multer.diskStorage({
  // destination: function (req, res, cb) {
  //   cb(null, 'uploads');
  // },
  filename: function (req, file, cb) {
    var ext = file.originalname.substr(file.originalname.lastIndexOf('.'));
    cb(null, file.fieldname + '-' + Date.now() + ext);
  }
})

store = multer({ storage: storage })
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const { formatMessage } = require("./utils/messages");
const { format } = require('util');


app.use("/js", express.static("static/js"));
app.use("/css", express.static("static/css"));
app.use("/html", express.static("static/html"));
// for about page pics and favicon
app.use("/pics", express.static("static/pics"));

app.use("/views", express.static("static/views"));



app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


/**
 * Used for logging. Logging is set to rotate daily
 * @author Arron Ferguson, Gurshawn Sehkon
 * @date May-18-2021
 */
const accessLogStream = rfs.createStream('access.log', {
  interval: '1d',
  path: path.join(__dirname, 'static/log')
});
app.use(morgan(':referrer :url :user-agent', {
  stream: accessLogStream
}));




/**
 * Connection URI. Update <username>, <password>, and <your-cluster-url> to reflect your cluster.
 * See https://docs.mongodb.com/ecosystem/drivers/node/ for more details
 */
const uri = "mongodb+srv://testing:gcX9e2D4a4HXprR0@sellery.4rqio.mongodb.net/Sellery?retryWrites=true&w=majority"





// Mongo DB Client.
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

//Connect App to DB. 
async function main() {
  try {
    // Connect to the MongoDB cluster
    await client.connect();

  } catch (e) {
    console.error(e);
  }
  //finally {
  //  await client.close();
  //}
}

main().catch(console.error);


io.on('connection', (socket) => {

  const chatBot = {
    id: -1,
    name: "Chat Bot"
  }


  socket.on('joinRoom', (room) => {

    socket.join(room)

    // Welcome to current user.
    socket.emit('message', formatMessage(chatBot, 'Welcome to the Chat'));

    //Broadcast when a user connects
    socket.broadcast.to(room).emit("message", formatMessage(chatBot, "A user has joined the chat"));


    //User disconects
    socket.on('disconnect', () => {
      io.to(room).emit("message", formatMessage(chatBot, "A user has left the chat"));
    });

  })

  //User sends message
  socket.on("chat message", (msg, roomID) => {
    addMessage(msg, roomID);
    io.emit('message', msg);
  });

})

/**
 * This function will push a message to the chatroom in mongoDB to save all messages
 * @author Mike Lim
 * @version 1.0
 * @date May 20 2021
 * @param {} message message object holding the single message
 */
function addMessage(message, room) {
  const db = client
    .db("sellery")
    .collection("chat");

  db.update({ "_id": ObjectId(room) }, { $push: { "messages": message } });

}

// async function listDatabases(client) {
//   databasesList = await client.db().admin().listDatabases();

//   console.log("Databases:");
//   databasesList.databases.forEach(db => console.log(` - ${db.name}`));
// };

/**
 * This is a middleware function that checks whether the user
 * has token. This token is used for verifying user.
 * @author Jimun Jang
 * @date May-13-2021
 */
requireLogin = (req, res, next) => {
  const token = req.cookies.jwt;

  if (token) {
    jwt.verify(token, 'gimp', (err, decodedToken) => {
      if (err) {
        res.redirect('/login');
      } else {
        next();
      }
    })
  } else {
    res.redirect('/login');
  }
}


/**
 * This route returns index page to the client 
 * @atuhor Ravinder Shokar 
 * @date April-29-2021
 */
app.get("/", requireLogin, (req, res) => {
  readFile("static/html/index.html", "utf-8", (err, html) => {
    if (err) {
      res.status(500).send("sorry, out of order");
    }
    res.send(html);
  })
})


/**
 * This route will return the HTML template for Sellary. This page is meant 
 * for development purposes only 
 * @author Ravinder Shokar 
 * @date April-30-2021
 */
app.get("/template", requireLogin, (req, res) => {
  readFile("static/html/template.html", "utf-8", (err, html) => {
    if (err) {
      res.status(500).send("Sorry, out of order.");
    }
    res.send(html);
  })
})

/**
 * This route will return the HTML for the feed page (home page).
 * @author Gurshawn Sekhon
 * @date April-30-2021
 */
app.get("/feed", requireLogin, (req, res) => {
  readFile("static/html/feed.html", "utf-8", (err, html) => {
    if (err) {
      res.status(500).send("Sorry, out of order.");
    }
    res.send(html);
  })
})

/**
 * This route will return the store front for Sellary. This page is meant 
 * for development purposes only 
 * @author Mike Lim 
 * @date April-30-2021
 */
app.get("/storefront", requireLogin, (req, res) => {
  readFile("static/html/storefront.html", "utf-8", (err, html) => {
    if (err) {
      res.status(500).send("Sorry, out of order.");
    }
    res.send(html);
  })
})



/**
 * This route will post data to Mongo DB. 
 * @author Ravinder Shokar 
 * @date May-05-2021
 */
app.post("/post_post", requireLogin, (req, res) => {
  const db = client.db("sellery");
  let post = req.body;
  const token = req.cookies.jwt;
  console.log(post);

  /** added this component to get user's location using token, then saving a post to
   *  our database
   * @author Jimun Jang
   * @date May-13, 2021
   */
  jwt.verify(token, 'gimp', async (err, decodedToken) => {
    console.log(decodedToken);
    db.collection("users").findOne({ "_id": ObjectId(decodedToken.id) })
      .then((data) => {
        const user = data;
        db.collection("post").insertOne({
          description: post.description,
          price: post.price,
          quantity: post.quantity,
          time: post.time,
          title: post.title,
          units: post.units,
          location: user.location,
          poster_name: user.name,
          user_id: decodedToken.id
        }).then(() => {
          db.collection("post").createIndex({ location: "2dsphere" });
          let message = "success";
          res.send({ message });
        })
      })
  })
})

/**
 * This route sends a single users info to the bio section of storefront
 * @author Mike Lim
 * @version 1.0
 * @date May 06 2021
 */
app.get("/storefront-data", requireLogin, (req, res) => {
  const token = req.cookies.jwt;

  jwt.verify(token, 'gimp', (err, decodedToken) => {
    console.log(decodedToken);

    client.db("sellery").collection("users")
      .findOne({ "_id": ObjectId(decodedToken.id) })
      .then((data) => {
        res.send({ result: data });
      })
  })
})

/**
 * This route is responsible for updating post in with post data. 
 * @author Ravinder Shokar
 * @version 1.0
 * @date May 06 2021
 */
app.post("/update_post", requireLogin, async (req, res) => {
  let post = req.body;

  console.log(post)

  const query = {
    "_id": ObjectId(post.ID)
  }

  const updateDoc = {
    $set: {
      title: post.title,
      description: post.description,
      units: post.units,
      price: post.price,
      quantity: post.quantity,
    }
  }

  const options = {
    upsert: true
  };

  result = await client.db("sellery").collection("post").updateOne(query, updateDoc, options);

  if (result.modifiedCount === 1) {
    console.log(
      `${result.matchedCount} document(s) matched the filter, updated ${result.modifiedCount} document(s).`,
    );
    myObj = {
      message: "Success Updating Post",
      status: "sucess",
    };
    res.send(myObj);
  } else {
    console.log(
      `${result.matchedCount} document(s) matched the filter, updated ${result.modifiedCount} document(s).`,
    );
    console.log("No documents matched the query. Deleted 0 documents.");
    myObj = {
      message: "Error Updating Post",
      status: "error"
    }
    res.send(myObj)
  }


});


/**
 * This route is responsible for deleting post. 
 * @author Ravinder Shokar
 * @version 1.0
 * @date May 11 2021
 */
app.post("/delete_post", requireLogin, (req, res) => {
  post = req.body;

  const db = client.db("sellery");
  const posts = db.collection("post");

  const query = {
    "_id": ObjectId(post.ID)
  }
  let myObj;

  const result = posts.deleteOne(query);

  if (result.deletedCount === 1) {
    console.dir("Successfully deleted one document.");
    myObj = {
      message: "Success Deleting Post",
      status: "sucess",
    };
    res.send(myObj);
  } else {
    console.log(result.deletedCount);
    console.log('Result', result);
    console.log("No documents matched the query. Deleted 0 documents.");
    myObj = {
      message: "Error Deleting Post",
      status: "error"
    }
    res.send(myObj)
  }
})


/**
 * This route gets all post from the DB 
 * @author Gurshawn Sehkon
 * @date May 07 2021  
 */
app.get("/generate_produce", requireLogin, (req, res) => {
  const token = req.cookies.jwt;

  jwt.verify(token, 'gimp', async (err, decodedToken) => {
    console.log(decodedToken);
    client
      .db("sellery")
      .collection("post")
      .find({

      })
      .toArray(function (err, result) {
        obj = {
          user_id: decodedToken.id,
          results: result,
        }
        if (err) throw err;
        res.send(obj);
      });
  })


  // console.log(data);
  // res.send(data);

})

/**
 * This routes to a login page
 * @author Jimun Jang
 * @date May-11-2021
 */
app.get('/login', (req, res) => {
  readFile("static/html/login.html", "utf-8", (err, html) => {
    if (err) {
      res.status(500).send("Sorry, out of order.");
    }
    res.send(html);
  });
});

/**
 * This routes to a signup page
 * @author Jimun Jang
 * @date May-11-2021
 */
app.get('/signup', (req, res) => {
  readFile("static/html/signup.html", "utf-8", (err, html) => {
    if (err) {
      res.status(500).send("Sorry, out of order.");
    }
    res.send(html);
  });
});


/**
 * This route responsbile for returning the chats HTML file.
 * @author Ravinder Shokar 
 * @date May-18-2021
 */
app.get('/chats', requireLogin, (req, res) => {
  readFile("static/html/chats.html", "utf-8", (err, html) => {
    if (err) {
      res.status(500).send("Sorry, out of order.");
    }
    res.send(html);
  });
});

/**
 * This route responsbile for returning the chat HTML file.
 * @author Ravinder Shokar 
 * @date May 18 2021
 */
app.get('/chat', requireLogin, (req, res) => {
  readFile("static/html/chat.html", "utf-8", (err, html) => {
    if (err) {
      res.status(500).send("Sorry, out of order.");
    }
    res.send(html);
  });
});

/**
 * This route is reesponsible for checking if a chatroom exist. If it does 
 * then it will redirect to the correct room. If does not it will create 
 * a new room, then redirect the user to the chat room.
 * @author Ravinder Shokar 
 * @version 1.0 
 * @date May 19 2021
 */
app.post("/create_chat_room", requireLogin, async (req, res) => {
  const token = req.cookies.jwt;
  let post = req.body;

  jwt.verify(token, "gimp", async (err, decodedToken) => {
    console.log("Token", decodedToken);
    let userOne = post.currentUserID;
    let userTwo = post.uID
    let obj;

    const db = client.db("sellery").collection('chat');

    //Check if a chat room exist. 
    const chatRoom = await db.findOne({
      ID: { "$all": [userOne, userTwo] }
    });

    if (chatRoom) {
      console.log("Chat room exist");

      //Redirect to chatroom
      console.log(chatRoom);
      res.send({
        status: "success",
        message: "Chat room found",
        id: chatRoom._id
      })
    } else {
      console.log("Chat room does not exist");

      // Create Chat room
      db.insertOne({
        names: [decodedToken.userName, post.un],
        ID: [userOne, userTwo],
        messages: []
      },
        (err, doc) => {
          if (err) {
            res.send({
              status: "error",
              message: "Erro finding chatroom",
            })
          } else {
            res.send({
              status: "success",
              message: "chat room found",
              id: doc.insertedId
            })
          }
        })
    }


  })


})


/**
 * This route is responsible for getting a chat log from the DB and returning it 
 * to the clien 
 * @author Ravinder Shokar 
 * @version 1.0 
 * @date May 20 2021
 */
app.get("/get_chat", requireLogin, async (req, res) => {
  const token = req.cookies.jwt;

  jwt.verify(token, 'gimp', async (err, decodedToken) => {
    let obj;
    let me;
    let you;
    let userID = decodedToken.id;
    let roomID = req.query.room;
    console.log(roomID);


    const database = client.db("sellery");
    const chats = database.collection("chat")

    const query = { "_id": ObjectId(roomID) }

    const chat = await chats.findOne(query);

    console.log(chat);

    if (chat) {

      if (chat.ID[0] == userID) {
        me = { ID: chat.ID[0], name: chat.names[0] }
        you = { ID: chat.ID[1], name: chat.names[1] }
      } else {
        me = { ID: chat.ID[1], name: chat.names[1] }
        you = { ID: chat.ID[0], name: chat.names[0] }
      }

      obj = {
        messages: chat.messages,
        me: me,
        you: you,
        status: "Success",
      }
    } else {
      obj = {
        result: null,
        status: "Error",
        message: "Error Querying for Chat",
      }
    }
    res.send(obj);
  })
});

/**
 * This route is responsible for getting chats assoiciated with the currently 
 * logged in user
 * @author Ravinder Shokar 
 * @version 1.0 
 * @data May 20 2021
 */
app.get("/get_my_chats", requireLogin, async (req, res) => {
  const token = req.cookies.jwt;

  jwt.verify(token, 'gimp', async (err, decodedToken) => {
    console.log(decodedToken);
    let userID = decodedToken.id;

    const database = client.db("sellery");
    const chats = database.collection('chat');

    const query = { ID: userID };

    await chats.find(query).toArray((err, result) => {
      if (err) throw err;
      res.send({
        status: "success",
        message: "Successfuly got users chats",
        results: result,
        userID: userID
      })
    })
  })
})

/**
 * Stores user info into our mongoDB database when user signs up.
 * User info contains location, name, email, password.
 * 
 * Creates a cookie as a form of token that stores encoded user id.
 * @author Jimun Jang
 * @date May-12-2021
 */
app.post('/signup', async (req, res) => {
  const {
    name,
    latitude,
    longitude,
    email,
    password
  } = req.body;

  const salt = await bcrypt.genSalt();
  const hashedPassword = await bcrypt.hash(password, salt);

  const db = client.db("sellery");

  const longInNum = Number(longitude);
  const latInNum = Number(latitude);

  if (latitude != '' && longitude != '') {
    db.collection("users").insertOne({
      name,
      location: {
        type: "Point",
        coordinates: [longInNum, latInNum]
      },
      email, // validate it
      password: hashedPassword,
    }).then((data) => {
      console.log(data);
      const user = data;
      const token = jwt.sign({ id: user.ops[0]._id, userName: user.ops[0].name }, 'gimp', {
        expiresIn: 24 * 60 * 60
      });
      console.log(user.ops[0]._id);
      res.cookie('jwt', token, {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000
      });
      res.status(200).json({
        user: user._id
      });
    }).catch((err) => {
      let error = "password must be longer than 7 characters long";
      if (err.code === 11000) {
        error = "email is already registered";
      }
      res.status(400).json({
        error
      });
    });
  } else {
    let error = "Invalid Address: try to choose an address from the drop down menu";
    res.status(400).json({
      error
    });
  }
});

/**
 * This function lets user log in and
 * creates a cookie as a form of token that stores encoded user id.
 * 
 * @author Jimun Jang
 * @date May 12 2021
 */
app.post('/login', async (req, res) => {
  const {
    email,
    password
  } = req.body;

  const db = client.db("sellery");

  const user = await db.collection("users").findOne({
    email
  });
  if (user) {
    const auth = await bcrypt.compare(password, user.password);
    if (auth) {
      const token = jwt.sign({
        userName: user.name,
        id: user._id
      }, 'gimp', {
        expiresIn: 24 * 60 * 60
      })
      res.cookie('jwt', token, {
        httpOnly: true,
        maxAge: 24 * 24 * 60 * 1000
      });
      res.status(200).json({
        user: user._id
      });
    } else {
      let error = "wrong password";
      res.status(400).json({
        error
      });
    }
  } else {
    let error = "wrong email";
    res.status(400).json({
      error
    });
  }
});

/** when user clicks log out button, it deletes cookie.
 * 
 * @author Jimun Jang
 * @date May 10, 2021
 */
app.get('/logout', (req, res) => {
  res.cookie('jwt', '', { maxAge: 1 });
  res.redirect('/login');
})


/**
 * This route gets the currently logged in users posts
 * @author Mike Lim
 * @date May 10 2021  
 */
app.get("/generate_my_produce", (req, res) => {

  const token = req.cookies.jwt;

  jwt.verify(token, 'gimp', async (err, decodedToken) => {
    let userId = decodedToken.id;

    client
      .db("sellery")
      .collection("post")
      .find({ "user_id": userId })
      .toArray(function (err, result) {
        if (err) throw err;
        let obj = {
          userId: userId,
          results: result
        }
        res.send(obj);
      });

  })
})

/**
 * This route gets a users posts dependent on there userId
 * @author Ravinder Shokar
 * @date May 17 2021  
*/
app.post("/generate_user_produce", (req, res) => {

  userId = req.body.id

  client
    .db("sellery")
    .collection("post")
    .find({ "user_id": userId })
    .toArray(function (err, result) {
      if (err) throw err;
      let obj = {
        userId: userId,
        results: result
      }
      console.log("generate_user_produce", obj);
      res.send(obj);
    });

})

/**
 * This route gets all reviews from the DB 
 * @author Mike Lim
 * @date May 13 2021  
 */
app.get("/generate_reviews", (req, res) => {

  user_id = '60956e66db7bf207dbc33255';

  //console.log("Generate reviews server");
  client
    .db("sellery")
    .collection("reviews")
    .find({
      "user_id": ObjectId(user_id)
    })
    .toArray(function (err, result) {
      if (err) throw err;
      //console.log(result);
      res.send(result);
    });
})


/**
 * This route will return the about page for Sellary. This page is meant 
 * for development purposes only 
 * @author Gurshawn Sekhon
 * @date May-05-10
 */
app.get("/about", (req, res) => {
  readFile("static/html/about.html", "utf-8", (err, html) => {
    if (err) {
      res.status(500).send("Sorry, out of order.");
    }
    res.send(html);
  })
})


/**
 * This route will return the form for reviews/ratings.. This page is meant 
 * for development purposes only 
 * @author Gurshawn Sekhon
 * @date May-05-11
 */
app.get("/review_form", (req, res) => {
  readFile("static/html/review_form.html", "utf-8", (err, html) => {
    if (err) {
      res.status(500).send("Sorry, out of order.");
    }
    res.send(html);
  })
})




/**
 * This route will write reviews to the database.
 * @author Gurshawn Sekhon
 * @date May-10-2021
 */
app.post("/createReviews", (req, res) => {

  const {
    rating,
    reviewComment
  } = req.body;

  const db = client.db("sellery");

  const date = new Date().toDateString();

  db.collection("reviews").insertOne({
    rating,
    reviewComment,
    date
  }).then(() => {
    let obj = {
      status: "success",
      message: "created reviews successfully",
    }
    console.log(obj);
    res.send(obj);
  })
    .catch((err) => {
      let obj = {
        result: {},
        status: "error",
        message: ""
      }
      console.log(obj);
      res.send(obj);
    })
});

/**
 * This route will upload profile picture
 * @author Gurshawn Sekhon, Jimun Jang
 * @date May-10-2021
 */

app.post('/uploadImage', store.array('images'), (req, res, next) => {
  const token = req.cookies.jwt;
  const files = req.files;

  if (!files) {
    const error = new Error('Please choose files');
    error.httpStatusCode = 400;
    return next(error);
  }

  // convert images into base64 encoding
  let images = files.map((file) => {
    let image = fs.readFileSync(file.path);

    return encode_image = image.toString('base64');
  })

  let result = images.map((src, index) => {
    const filename = files[index].originalname;
    const contentType = files[index].mimetype;
    const imageBase64 = src;
    jwt.verify(token, 'gimp', (err, decodedToken) => {
      client.db("sellery").collection("users").findOneAndUpdate(
        { "_id": ObjectId(decodedToken.id) },
        {
          $set: {
            "profile_pic": {
              filename,
              contentType,
              imageBase64
            }
          }
        }
      ).then((data) => {
        res.redirect('/storefront')
      }).catch((err) => {
        res.send(err);
      })
    })
  })

})

/**
 * This route is responsible for updating profile bio in with profile bio data. 
 * @author Mike Lim
 * @version 1.0
 * @date May 20 2021
 */
app.post("/update_bio", requireLogin, async (req, res) => {
  let post = req.body;

  console.log("server: ", req);

  const query = {
    "_id": ObjectId(post.ID)
  }

  const updateBioDoc = {
    $set: {
      name: post.name,
      bio: post.bio,
      location: {
        type: "Point",
        coordinates: [post.longitude, post.latitude]
      }
      // image here
    }
  }

  const options = {
    upsert: true
  };

  // WILL NEED TO CHANGE COLLECTION
  result = await client.db("sellery").collection("sample_data").updateOne(query, updateBioDoc, options);



  if (result.modifiedCount === 1) {
    console.log(
      `${result.matchedCount} document(s) matched the filter, updated ${result.modifiedCount} document(s).`,
    );
    myObj = {
      message: "Success updating bio",
      status: "sucess",
    };
    res.send(myObj);
  } else {
    console.log(
      `${result.matchedCount} document(s) matched the filter, updated ${result.modifiedCount} document(s).`,
    );
    console.log("No documents matched the query. Deleted 0 documents.");
    myObj = {
      message: "Error updating bio",
      status: "error"
    }
    res.send(myObj)
  }


});

/**
 * Proximity search
 * @author Jimun Jang
 * @version 1.0
 * @date May 20 2021
 */
app.get('/proximity_search', (req, res) => {
  const distance = Number(req.query.distance);
  const db = client.db('sellery');
  const token = req.cookies.jwt;

  jwt.verify(token, 'gimp', async (err, decodedToken) => {
    db.collection("users").findOne({ "_id": ObjectId(decodedToken.id) })
      .then((data) => {
        const longitude = Number(data.location.coordinates[0]);
        const latitude = Number(data.location.coordinates[1]);
        console.log(longitude, latitude, distance);
        db.collection("post").find(
          {
            location:
            {
              $near:
              {
                $geometry: { type: "Point", coordinates: [longitude, latitude] },
                $maxDistance: distance
              }
            }
          }
        ).toArray((err, result) => {
          if (err) {
            let obj = { err };
            res.send(err);
          } else {

            let obj = { user_id: decodedToken.id, result };
            res.send(obj);
          }
        })
      });
  })
})


server.listen(8000, () => { console.log('listening on http://localhost:8000/'); });
