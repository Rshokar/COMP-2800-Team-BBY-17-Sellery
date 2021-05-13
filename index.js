const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');

const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');

const { readFile } = require('fs');
const { MongoClient } = require('mongodb');
const { read } = require('fs/promises');
const ObjectId = require('mongodb').ObjectId;

const app = express();

app.use("/js", express.static("static/js"));
app.use("/css", express.static("static/css"));
app.use("/html", express.static("static/html"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


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
 * This route will return the HTML for the post summary.
 * @author Ravinder Shokar 
 * @date April-30-2021
 */
app.get("/post_summary", requireLogin, (req, res) => {
  readFile("static/html/post_summary.html", "utf-8", (err, html) => {
    if (err) {
      res.status(500).send("Sorry, out of order.");
    }
    res.send(html);
  })
})

/**
 * This route will return the HTML for the post page.
 * @author Jimun Jang
 * @date April-30-2021
 */
app.get("/post", requireLogin, (req, res) => {
  readFile("static/html/post.html", "utf-8", (err, html) => {
    if (err) {
      res.status(500).send("Sorry, out of order.");
    }
    res.send(html);
  })
})

/**
 * This route will return the HTML for the post summary.
 * @author Ravinder Shokar 
 * @date April-30-2021
 */
app.get("/post_summary", requireLogin, (req, res) => {
  readFile("static/html/post_summary.html", "utf-8", (err, html) => {
    if (err) {
      res.status(500).send("Sorry, out of order.");
    }
    res.send(html);
  })
})

/**
 * This route will return the HTML for the post page.
 * @author Jimun Jang
 * @date April-30-2021
 */
app.get("/post", requireLogin, (req, res) => {
  readFile("static/html/post.html", "utf-8", (err, html) => {
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
  
  /** added this component to get user's location using token, then saving a post to
   *  our database
   * @author Jimun Jang
   * @date May-13, 2021
   */
  jwt.verify(token, 'gimp', async (err, decodedToken) => {
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
        poster_name: user.name
      }).then(() => {
        let message = "success";
        res.send({ message });
      })
    })
  })
})

/**
 * This route sends user info to bio section of storefront
 * @author Mike Lim
 * @version 1.0
 * @date May 06 2021
 */
app.get("/storefront-data", requireLogin, (req, res) => {
  let formatOfResponse = req.query['format'];
  let data = null;

  if (formatOfResponse == 'getJSONBio') {
    res.setHeader('Content-Type', 'application/json');
    console.log("hello you made it to the storefront.");
    client
      .db("sellery")
      .collection("sample_data")
      .find({ "_id": ObjectId("60956e66db7bf207dbc33255") })
      .toArray(function (err, result) {
        if (err) throw err;
        console.log(result);
        res.send(result);
      });
    // console.log(data);
    // res.send(data);
  }
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

  const query = { "_id": ObjectId(post.ID) }

  const updateDoc = {
    $set: {
      title: post.title,
      description: post.description,
      units: post.uinits,
      price: post.price,
      quantity: post.quantity,
    }
  }

  const options = { upsert: true };

  result = await client.db("sellery").collection("post").updateOne(query, updateDoc, options);



  if (result.modifiedCount === 1) {
    console.log(
      `${result.matchedCount} document(s) matched the filter, updated ${result.modifiedCount} document(s).`,
    );
    myObj = {
      message: "Success Deleting Post",
      status: "sucess",
    };
    res.send(myObj);
  } else {
    console.log(
      `${result.matchedCount} document(s) matched the filter, updated ${result.modifiedCount} document(s).`,
    );
    console.log("No documents matched the query. Deleted 0 documents.");
    myObj = {
      message: "Error Deleting Post",
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

  const query = { "_id": ObjectId(post.ID) }
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

  console.log("Hello you made it generate produce.");
  client
    .db("sellery")
    .collection("post")
    .find({

    })
    .toArray(function (err, result) {
      if (err) throw err;
      res.send(result);
    });
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
 * Stores user info into our mongoDB database when user signs up.
 * User info contains location, name, email, password.
 * 
 * Creates a cookie as a form of token that stores encoded user id.
 * @author Jimun Jang
 * @date May-12-2021
 */
app.post('/signup', async (req, res) => {
  const { name, latitude, longitude, email, password } = req.body;

  const salt = await bcrypt.genSalt();
  const hashedPassword = await bcrypt.hash(password, salt);

  const db = client.db("sellery");

  if (latitude != '' && longitude != '') {
    const user = db.collection("users").insertOne({
      name,
      location: {
        type: "Point",
        coordinates: [longitude, latitude]
      },
      email,
      password: hashedPassword,
    }).then(() => {
      const token = jwt.sign({ id: user._id }, 'gimp', {
        expiresIn: 24 * 60 * 60
      });
      res.cookie('jwt', token, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 });
      res.status(200).json({ user: user._id });
    }).catch((err) => {
      let error = "password must be longer than 7 characters long";
      if (err.code === 11000) {
        error = "email is already registered";
      }
      res.status(400).json({ error });
    });
  } else {
    let error = "Invalid Address: try to choose an address from the drop down menu";
    res.status(400).json({ error });
  }
});

/**
 * This function lets user log in and
 * creates a cookie as a form of token that stores encoded user id.
 * 
 * @author Jimun Jang
 * @date May-12-2021
 */
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  const db = client.db("sellery");

  const user = await db.collection("users").findOne({ email });
  if (user) {
    const auth = await bcrypt.compare(password, user.password);
    if (auth) {
      const token = jwt.sign({ id: user._id }, 'gimp', {
        expiresIn: 24 * 60 * 60
      })
      res.cookie('jwt', token, { httpOnly: true, maxAge: 24 * 24 * 60 * 1000 });
      res.status(200).json({ user: user._id });
    } else {
      let error = "wrong password";
      res.status(400).json({ error });
    }
  } else {
    let error = "wrong email";
    res.status(400).json({ error });
  }
});

/** when user clicks log out button, it deletes cookie.
 * 
 * @author Jimun Jang
 * @date May-10, 2021
 */
app.get('/logout', (req, res) => {
  res.cookie('jwt', '', { maxAge: 1 });
  res.redirect('/login');
})

app.listen(8000, () => console.log("App available on http://localhost:8000"));
