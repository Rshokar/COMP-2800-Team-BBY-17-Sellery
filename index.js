const express = require('express');
const bodyParser = require('body-parser');
const {
    readFile
} = require('fs');
const {
    MongoClient
} = require('mongodb');
const {
    read
} = require('fs/promises');
const {
    ObjectID
} = require("bson");


const app = express();

app.use("/js", express.static("static/js"));
app.use("/css", express.static("static/css"));
app.use("/html", express.static("static/html"));

const uri = "mongodb+srv://testing:gcX9e2D4a4HXprR0@sellery.4rqio.mongodb.net/Sellery?retryWrites=true&w=majority"

const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});


//Connect App to DB. 
async function main() {
    /**
     * Connection URI. Update <username>, <password>, and <your-cluster-url> to reflect your cluster.
     * See https://docs.mongodb.com/ecosystem/drivers/node/ for more details
     */
    // const uri = "mongodb+srv://testing:gcX9e2D4a4HXprR0@sellery.4rqio.mongodb.net/Sellery?retryWrites=true&w=majority"

    // const client = new MongoClient(uri, {
    //     useNewUrlParser: true,
    //     useUnifiedTopology: true
    // });

    try {
        // Connect to the MongoDB cluster
        await client.connect();

        // Make the appropriate DB calls
        // await listDatabases(client);


    } catch (e) {
        console.error(e);
        // } finally {
        //     await client.close();
    }
}

main().catch(console.error);


// async function listDatabases(client) {
//     databasesList = await client.db().admin().listDatabases();

//     console.log("Databases:");
//     databasesList.databases.forEach(db => console.log(` - ${db.name}`));
// };

// async function getBioSample(client) {
//     bioSample = await client.db("sellery");
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
app.get("/feed", (req, res) => {
    readFile("static/html/feed.html", "utf-8", (err, html) => {
        if (err) {
            res.status(500).send("Sorry, out of order.");
        }
        res.send(html);
    })
})

/**
 * route 
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