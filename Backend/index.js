import express from "express";
import cors from "cors";
import nodemailer from "nodemailer";
import { MongoClient, ServerApiVersion } from "mongodb";
import mongoose, { model } from "mongoose";

const app = express();
app.use(cors());
const Port = 8080;

app.use(express.json());

const uri =
  "mongodb+srv://mukilanmukilan174:px8sJA9RBiySN26T@cluster1.nqalwsf.mongodb.net/?retryWrites=true&w=majority&appName=Cluster1";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("Bulkmail").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
  }
}

const usercreditionals = client.db("Bulkmail").collection("usercreditionals");

// const userschema=new mongoose.Schema({mailId:String,password:String})

// Create a test account or replace with real credentials.

app.post("/sendmail", async (req, res) => {
  console.log(req.body);
  const { mailids, subject, message } = req.body;
  console.log(mailids);

  // console.log(mailids)

  const user=await usercreditionals.findOne()
  const{mailId,password}=user

  if(!user){
    res.status(404).send({msg:"No user credentials Found"})
  }



  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: mailId,
      pass: password,
    },
  });

  for (const mail of mailids) {
    try {
      const info = await transporter.sendMail({
        from: "mukilanmukilan174@gmail.com",
        to: mail,
        subject: subject,
        text: message,
      });
      console.log(`message sent sucessfully to ${mail}`);
    } catch (err) {
      // res.status(500).send({
      //   message:"Internal Server Error",
      //   status:"ERROR 500"
      // })
      res.status(404).send({
        message: "User not found!",
        status: 404,
      });
      console.error(`❌ Failed to send to ${mail}: ${err.message}`);
    }
  }

  res.status(200).send({
    message: "Mail Sent successfully!",
    status: "ok",
  });
});
// Wrap in an async IIFE so we can use await.
// (async () => {
//   const info = await transporter.sendMail({
//     from: '"Maddison Foo Koch" <maddison53@ethereal.email>',
//     to: "bar@example.com, baz@example.com",
//     subject: "Hello ✔",
//     text: "Hello world?", // plain‑text body
//     html: "<b>Hello world?</b>", // HTML body
//   });

//   console.log("Message sent:", info.messageId);
// })();

app.listen(Port, () => {
  console.log("Server is started");
  run().catch(console.dir);
});
