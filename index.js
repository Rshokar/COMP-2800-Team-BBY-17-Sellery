const express = require('express');
const bodyParser = require('body-parser');

const { readFile } = require('fs');
const { MongoClient } = require('mongodb');
const { read } = require('fs/promises');
const { ObjectID } = require("bson");

const app = express();

app.use("/js", express.static("static/js"));
app.use("/css", express.static("static/css"));
app.use("/html", express.static("static/html"));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false }));


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
  let data = null;

  if (formatOfResponse == 'getJSONBio') {
    res.setHeader('Content-Type', 'application/json');
    console.log("hello you made it here");
    client
      .db("sellery")
      .collection("sample_data")
      .find({ "_id": ObjectID("60956e66db7bf207dbc33255") })
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
  post = req.body;

  console.log(post)

  let filter = { title: "Corn" }

  let updateDoc = {
    $set: {
      title: post.title,
      //description: post.description,
      //units: post.uinits,
      //price: post.price,
      //quantity: post.quantity,
    }
  }

  const options = { upsert: true };

  result = await client.db("sellary").collection("post").updateOne(filter, updateDoc, options);

  console.log(
    `${result.matchedCount} document(s) matched the filter, updated ${result.modifiedCount} document(s).`,
  );


});


/**
 * This route is responsible for deleting post. 
 * @author Ravinder Shokar
 * @version 1.0
 * @date May 11 2021
 */
app.post("/delete_post", async (req, res) => {
  post = req.body;

  const db = client.db("sellary");
  const posts = db.collection("post");

  const query = { _id: post }
  let myObj;

  console.log("My Post", post);
  console.log("Post ID", post.ID);
  console.log("Query", query);


  const result = await posts.deleteOne(query);

  if (result.deletedCount === 1) {
    console.dir("Successfully deleted one document.");
    myObj = {
      message: "Success Deleting Post",
      status: "sucess",
    };
    res.send(myObj);

  } else {
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
app.get("/generate_produce", (req, res) => {

  console.log("Sellery is the best!");
  client
    .db("sellery")
    .collection("post")
    .find({

    })
    .toArray(function (err, result) {
      if (err) throw err;
      console.log(result);
      res.send(result);
    });
  // console.log(data);
  // res.send(data);

})

app.listen(8000, () => console.log("App available on http://localhost:8000"));
