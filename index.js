import express from "express";
import cors from "cors";
import mongoose from "mongoose";

const app = express();
app.use(cors());
app.use(express.json());
mongoose
.connect(
  "mongodb+srv://lakshmi:lakshmi0606@cluster0.f9nrjee.mongodb.net/user"
  )
  .then(
    function success() {
      console.log("Database Connected");
    },
    function failiure() {
      console.log("Database did not connected..");
    }
  );

const registerSchema = new mongoose.Schema({
  Name: String,
  Email: String,
  Password: String,
  ConfirmPassword: String,
  Gender: {
    type: String,
    enum: ["Male", "Female", "Other"],
  },
  Dob: Date,
  Age: Number,
  Mobile: String,
});

const Register = mongoose.model("registers", registerSchema);

app.get("/", async (request, response) => {
  var user = await Register.findOne({
    Email: request.query.email,
    Password: request.query.password,
  });
  if (user) {
    return response.send({ message: "Succsfully", Email: request.query.email });
  } else {
    return response.send({ message: "UserNotFound" });
  }
});

app.get("/userget", async (request, response) => {
  var user = await Register.findOne({
    Email: request.query.email,
  });
  if (user) {
    return response.send({ user: user.Name });
  } else {
    return response.send({ user: "UserNotFound" });
  }
});

app.post("/register", async (request, response) => {
  console.log(request.body);
  var user = await Register.findOne({
    Email: request.body.email,
  });
  if (user) {
    return response.send({ message: "AlreadyRegistered" });
  } else{
    try{
      var register = new Register({
        Name: request.body.name,
        Email: request.body.email,
        Password: request.body.pass,
        ConfirmPassword: request.body.conPass,
      });
      register.save();
    }
    catch{
      console.log("errror");
    }
    response.send({
      message: "Registered Successfully!",
    });
  }
});
app.post("/profile", async (request, response) => {
  console.log(request.body.dob);
  var upd = await Register.updateOne(
    { Email: request.body.email },
    {
      $set: {
        Gender: request.body.gender,
        Dob: new Date(request.body.dob),
        Age: request.body.age,
        Mobile: request.body.mobileNumber,
      },
    }
  );
  response.send({
    message: "Registered Successfully",
  });
});

app.listen(3001, function (err) {
  console.log("Succsfully server started ....");
});
