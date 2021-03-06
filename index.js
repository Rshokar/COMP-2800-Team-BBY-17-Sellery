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
app.use("/pics", express.static("static/pics"));

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
app.get("/", (req, res) => {
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
 * This route sends a single users info to the bio section of storefront
 * Ravinder Shokar: I added an if check to see if a user ID has passed in. If it 
 * has it will query that user.
 * @author Mike Lim
 * @author Ravinder Shokar 
 * @version 1.0
 * @date May 26 2021
 */
app.get("/storefront-data", requireLogin, (req, res) => {
  const token = req.cookies.jwt;
  const userID = req.query.id;

  jwt.verify(token, 'gimp', (err, decodedToken) => {

    if (userID) {
      client.db("sellery").collection("users")
        .findOne({ "_id": ObjectId(userID) })
        .then((data) => {
          res.send({ result: data });
        })
    } else {
      client.db("sellery").collection("users")
        .findOne({ "_id": ObjectId(decodedToken.id) })
        .then((data) => {
          res.send({ result: data });
        })
    }
  })
})

/**
 * This route returns a single usrs docuemnt. The user is dependent on which ID
 * is sent in req.body;
 * @author Ravinder Shokar 
 * @version 1.0
 * @date May 24 2021
 */
app.get("/get_your_storefront", requireLogin, (req, res) => {
  client.db("sellery").collection("users")
    .findOne({ "_id": ObjectId("60a801413c579615c234b306") })
    .then((data) => {
      res.send({ result: data });
    })
})

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
    let userOne = decodedToken.id;
    let userTwo = post.uID

    let obj;

    const db = client.db("sellery").collection('chat');

    //Check if a chat room exist. 
    const chatRoom = await db.findOne({
      ID: { "$all": [userOne, userTwo] }
    }, (err, chatRoom) => {
      if (chatRoom) {
        console.log("Chat room exist");

        //Redirect to chatroom
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
                message: "Error finding chatroom",
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
    });
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

    const database = client.db("sellery");
    const chats = database.collection("chat")

    const query = { "_id": ObjectId(roomID) }

    const chat = await chats.findOne(query);

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

  if (password.length < 8) {
    let error = "password must be longer than 7 characters long";
    res.status(400).json({ error });
  }
  const salt = await bcrypt.genSalt();
  const hashedPassword = await bcrypt.hash(password, salt);

  const db = client.db("sellery");

  const longInNum = Number(longitude);
  const latInNum = Number(latitude);

  if (latitude != '' && longitude != '') {
    db.collection("users").findOne({ email: email }, function (err, user) {
      if (err) {
        console.log(err);
      }
      if (user) {
        let error = "email already exists, try to sign up with different email";
        res.status(400).json({ error });
      } else {
        db.collection("users").insertOne({
          name,
          location: {
            type: "Point",
            coordinates: [longInNum, latInNum]
          },
          email,
          password: hashedPassword,
        }).then((data) => {
          const user = data;
          const token = jwt.sign({ id: user.ops[0]._id, userName: user.ops[0].name }, 'gimp', {
            expiresIn: 24 * 60 * 60
          });
          res.cookie('jwt', token, {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000
          });
          res.status(200).json({
            user: user._id
          });
        })
      }
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
  const token = req.cookies.jwt;

  jwt.verify(token, 'gimp', async (err, decodedToken) => {
    client
      .db("sellery")
      .collection("post")
      .find({ "user_id": userId })
      .toArray(function (err, result) {
        if (err) throw err;
        let obj = {
          userId: decodedToken.id,
          results: result
        }
        res.send(obj);
      });
  })
})

/**
 * This route gets all reviews from the DB 
 * @author Mike Lim
 * @date May 13 2021  
 */
app.get("/generate_reviews", (req, res) => {

  const token = req.cookies.jwt;

  jwt.verify(token, "gimp", (err, decodedToken) => {
    const userID = decodedToken.id;
    client
      .db("sellery")
      .collection("reviews")
      .find({
        "storefrontOwner": userID
      })
      .toArray(function (err, result) {
        if (err) throw err;
        res.send(result);
      });

  })
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
 * Ravinder: This route will get rating, comment from req.body and create a 
 * review in the reviews collection is sellery db. 
 * @author Gurshawn Sekhon
 * @author Ravinder Shokar . 
 * @date May-10-2021
 */
app.post("/create_reviews", (req, res) => {
  const token = req.cookies.jwt;


  jwt.verify(token, "gimp", (err, decodedToken) => {

    const date = new Date().toDateString();

    const comment = {
      comment: req.body.comment,
      rating: req.body.rating,
      storefrontOwner: req.body.storefrontOwner,
      reviewOwner: decodedToken.id,
      datePosted: date
    }
    const db = client.db("sellery");

    db.collection("reviews")
      .insertOne(comment)
      .then(() => {
        let obj = {
          status: "success",
          message: "Successfully Created Review",
        }
        res.send(obj);
      })
      .catch((err) => {
        let obj = {
          result: {},
          status: "error",
          message: "error uploading comment."
        }
        res.send(obj);
      })
  });
})



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

  const token = req.cookies.jwt;

  jwt.verify(token, 'gimp', async (err, decodedToken) => {
    let userId = decodedToken.id;


    const query = {
      "_id": ObjectId(userId)
    };

    const options = {
      upsert: true
    };

    if (post.name) {
      const updateName = {
        $set: {
          name: post.name
        }
      }

      await client
        .db("sellery")
        .collection("users")
        .updateOne(query, updateName, options);

      const postQuery = {
        "user_id": userId
      }

      const updatePostDoc = {
        $set: {
          poster_name: post.name
        }
      }

      client.db("sellery").collection("post").updateMany(postQuery, updatePostDoc);
    }

    if (post.bio) {
      const updateBio = {
        $set: {
          bio: post.bio
        }
      }

      await client
        .db("sellery")
        .collection("users")
        .updateOne(query, updateBio, options);
    }

    if (post.latitude) {
      const updateLoc = {
        $set: {
          location: {
            type: "Point",
            coordinates: [parseFloat(post.longitude), parseFloat(post.latitude)]
          }
        }
      }

      await client
        .db("sellery")
        .collection("users")
        .updateOne(query, updateLoc, options);

      const locQuery = {
        "user_id": userId
      }

      const updateLocMany = {
        $set: {
          location: {
            type: "Point",
            coordinates: [parseFloat(post.longitude), parseFloat(post.latitude)]
          }
        }
      }

      client.db("sellery").collection("post").updateMany(locQuery, updateLocMany);
    }
  })
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

/**
 * Post with an image
 * @author Jimun Jang
 * @date May 25 2021
 */
app.post('/update_post', store.array('editedImage'), (req, res, next) => {
  const token = req.cookies.jwt;
  const files = req.files;
  const db = client.db('sellery');
  var date = new Date();
  var time = date.toDateString();
  var post_unit;
  var filename;
  var contentType;
  var imageBase64;

  if (req.body.unit == 'weight') {
    post_unit = req.body.weightOptions;
  } else {
    post_unit = req.body.unit;
  }

  if (!files) {
    filename = null;
    contentType = null;
    imageBase64 = null;
  } else {
    // convert images into base64 encoding
    let images = files.map((file) => {
      let image = fs.readFileSync(file.path);

      return encode_image = image.toString('base64');
    });
    images.map((src, index) => {
      filename = files[index].originalname;
      contentType = files[index].mimetype;
      imageBase64 = src;
    })
  }

  jwt.verify(token, 'gimp', async (err, decodedToken) => {
    client.db("sellery").collection("post").findOneAndUpdate(
      { "_id": ObjectId(req.body.postId) },
      {
        $set: {
          title: req.body.title,
          quantity: req.body.quantity,
          price: req.body.price,
          description: req.body.description,
          time: time,
          units: post_unit,
          "post_pic": {
            filename,
            contentType,
            imageBase64
          }
        }
      }
    ).then((data) => {
      res.redirect('back');
    })
  })
})

/**
 * Post with an image
 * @author Jimun Jang
 * @date May 25 2021
 */
app.post('/uploadPost', store.array('postImage'), (req, res, next) => {
  const token = req.cookies.jwt;
  const files = req.files;
  const db = client.db('sellery');
  var date = new Date();
  var time = date.toDateString();
  var post_unit;
  var filename;
  var contentType;
  var imageBase64;

  if (req.body.unit == 'weight') {
    post_unit = req.body.weightOptions;
  } else {
    post_unit = req.body.unit;
  }

  if (!files) {
    filename = null;
    contentType = null;
    imageBase64 = null;
  } else {
    // convert images into base64 encoding
    let images = files.map((file) => {
      let image = fs.readFileSync(file.path);

      return encode_image = image.toString('base64');
    });
    images.map((src, index) => {
      filename = files[index].originalname;
      contentType = files[index].mimetype;
      imageBase64 = src;
    })
  }

  jwt.verify(token, 'gimp', async (err, decodedToken) => {
    db.collection("users").findOne({ "_id": ObjectId(decodedToken.id) })
      .then((data) => {
        const user = data;
        db.collection("post").insertOne({
          description: req.body.description.trim(),
          price: req.body.price,
          quantity: req.body.quantity,
          time: time,
          title: req.body.title,
          units: post_unit,
          location: user.location,
          poster_name: user.name,
          user_id: decodedToken.id,
          post_pic: {
            filename,
            contentType,
            imageBase64
          }
        }).then(() => {
          db.collection("post").createIndex({ location: "2dsphere" });
          res.redirect('back');
        })
      })
  })
})

server.listen(8000, () => { console.log('listening on http://localhost:8000/'); });
