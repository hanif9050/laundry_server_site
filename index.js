const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const MongoClient = require("mongodb").MongoClient;
const ObjectId = require("mongodb").ObjectId;

require("dotenv").config();
const app = express();
app.use(cors());
app.use(express.json());
//

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.kbc8q.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const port = process.env.PORT || 5000;
//

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
client.connect((err) => {
  const servicesCollection = client.db("assignment-11").collection("services");
  const orderCollection = client.db("assignment-11").collection("orders");
  const adminCollection = client.db("assignment-11").collection("adminLogin");
  const reviewCollection = client.db("assignment-11").collection("reviews");
  // perform actions on the collection object

  //   addService
  app.post("/addService", (req, res) => {
    const service = req.body;
    servicesCollection.insertOne(service).then((result) => {
      console.log(result);
      res.send(result.insertedCount > 0);
    });
  });
  //  end of  addService
  //   all Services
  app.get("/allServices", (req, res) => {
    servicesCollection.find().toArray((err, documents) => {
      res.send(documents);
    });
  });
  //  end of all Services
  // Find Checkout Service
  app.get("/checkOut/:serviceId", (req, res) => {
    const id = req.params.serviceId;
    servicesCollection.find({ _id: ObjectId(id) }).toArray((err, document) => {
      res.send(document[0]);
    });
  });
  // End ofFind Checkout Service
  // add Order
  app.post("/addOrder", (req, res) => {
    console.log(req.body);
    const order = req.body;
    orderCollection.insertOne(order).then((result) => {
      res.send(result.insertedCount > 0);
    });
  });
  // end of add order
  // user order
  app.get("/userOrders/:email", (req, res) => {
    console.log(req.params.email);
    const orderList = req.params.email;
    orderCollection.find({ email: orderList }).toArray((err, documents) => {
      res.send(documents);
    });
  });
  // end of user order
  // all orders
  app.get("/allOrders", (req, res) => {
    orderCollection.find().toArray((err, documents) => {
      res.send(documents);
    });
  });
  // end of all orders
  // delete order
  app.delete("/deleteService/:id", (req, res) => {
    console.log(req.params.id);
    const deleteService = req.params.id;
    servicesCollection
      .deleteOne({ _id: ObjectId(deleteService) })
      .then((result) => res.send(result.deletedCount > 0));
  });
  // end of delete order
  // admin Match
  app.post("/adminMatch", (req, res) => {
    console.log(req.body.email);
    const adminEmail = req.body.email;
    adminCollection.find({ admin: adminEmail }).toArray((err, items) => {
      res.send(items.length > 0);
    });
  });
  //end of admin Match
  // add an Admin
  app.post("/addAdmin", (req, res) => {
    console.log(req.body);
    adminCollection.insertOne(req.body).then((result) => {
      res.send(result.insertedCount > 0);
    });
  });
  // end of add an Admin

  // add review
  app.post("/addReview", (req, res) => {
    console.log(req.body);

    reviewCollection.insertOne(req.body).then((result) => {
      console.log(result);
      res.send(result.insertedCount > 0);
    });
  });
  // end of review
  // all review
  app.get("/allReview", (req, res) => {
    reviewCollection.find().toArray((err, documents) => res.send(documents));
  });
  // end of all review

  console.log("database connected");
});

//
app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
