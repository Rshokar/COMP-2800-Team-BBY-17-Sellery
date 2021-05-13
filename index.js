const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');

const { readFile } = require('fs');
const { MongoClient } = require('mongodb');
const { read } = require('fs/promises');
const ObjectId = require('mongodb').ObjectId;

const mongoose = require('mongoose');
const User = require('./models/user');


const app = express();

app.use("/js", express.static("static/js"));
app.use("/css", express.static("static/css"));
app.use("/html", express.static("static/html"));
// for about page pics and favicon
app.use("/pics", express.static("static/pics"));


app.use(express.json());
app.use(express.urlencoded({ extended: true }));


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
app.get("/template", (req, res) => {
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
app.get("/post_summary", (req, res) => {
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
app.get("/post", (req, res) => {
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
app.get("/post_summary", (req, res) => {
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
app.get("/post", (req, res) => {
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
app.get("/feed", (req, res) => {
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
app.get("/storefront", (req, res) => {
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
app.post("/post_post", (req, res) => {

  let post = req.body;

  console.log(post);

  // Only for this route. 
  const db = client.db("sellery");

  db.collection("post").insertOne(post)
    .then((result) => {
      let obj = {
        status: "success",
        message: "message",
      }
      console.log(obj);
      res.send(obj);
    })
    .catch((err) => {
      let obj = {
        result: {},
        status: "error",
        message: "",
      }
      console.log(obj);
      res.send(obj);
    })
})

/**
 * This route sends user info to bio section of storefront
 * @author Mike Lim
 * @version 1.0
 * @date May 06 2021
 */
app.get("/storefront-data", (req, res) => {
  let formatOfResponse = req.query['format'];

  user_id = '60956e66db7bf207dbc33255';

  if (formatOfResponse == 'getJSONBio') {
    res.setHeader('Content-Type', 'application/json');
    console.log("hello you made it to the storefront.");
    client
      .db("sellery")
      .collection("sample_data")
      .find({ "_id": ObjectId(user_id) })
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
app.post("/update_post", async (req, res) => {
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
app.post("/delete_post", (req, res) => {
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
 * @date May-07-2021  
 */
app.get("/generate_produce", (req, res) => {

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

app.get('/login', (req, res) => {
  readFile("static/html/login.html", "utf-8", (err, html) => {
    if (err) {
      res.status(500).send("Sorry, out of order.");
    }
    res.send(html);
  });
});

app.post('/signup', async (req, res) => {
  const { email, password, address } = req.body;

  const salt = await bcrypt.genSalt();
  const hashedPassword = await bcrypt.hash(password, salt);

  // Only for this route. 
  const db = client.db("sellery");

  db.collection("users").insertOne({email, password: hashedPassword, address})
    .then((result) => {
      let obj = {
        status: "success",
        message: "message",
      }
      console.log(obj);
      res.send(obj);
    })
    .catch((err) => {
      let obj = {
        result: {},
        status: "error",
        message: "",
      }
      console.log(obj);
      res.send(obj);
    });
 });

app.get('/signup', (req, res) => {
  readFile("static/html/signup.html", "utf-8", (err, html) => {
    if (err) {
      res.status(500).send("Sorry, out of order.");
    }
    res.send(html);
  });
});

app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  const db = client.db("sellery");

  const user = await db.collection("users").findOne({ email });
  if (user) {
    const auth = await bcrypt.compare(password, user.password);
    if (auth) {
      res.status(200).json({ user: user._id });
    } else {
      res.send('wrong password');
    }
  } else {
    res.send('wrong email');
  }
});

/**
 * This route gets a user's posts from the DB 
 * @author Mike Lim
 * @date May 10 2021  
*/
app.get("/generate_user_produce", (req, res) => {

  // get user id from somewhere else
  user_id = '60956e66db7bf207dbc33255';

  console.log("Route");

  client
    .db("sellery")
    .collection("post")
    .find({ "user_id": ObjectId(user_id) })
    .toArray(function (err, result) {
      if (err) throw err;
      console.log(result);
      res.send(result);
    });

})

/**
 * This route gets all reviews from the DB 
 * @author Mike Lim
 * @date May 13 2021  
*/
app.get("/generate_reviews", (req, res) => {

  user_id = '60956e66db7bf207dbc33255';

  console.log("Generate reviews server");
  client
    .db("sellery")
    .collection("reviews")
    .find({
      "user_id": ObjectId(user_id)
    })
    .toArray(function (err, result) {
      if (err) throw err;
      console.log(result);
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




app.listen(8000, () => console.log("App available on http://localhost:8000"));
