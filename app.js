const ex = require("express");

const fs = require("fs");
const path = require("path");
const multer = require("multer");

const user = require("./models/User");
const donate = require("./models/donate");
const ngo = require("./models/ngo");
const requ = require("./models/request");
const feedback = require("./models/feedback");

const db = require("./models/db");
const bp = require("body-parser");
const bcp = require("bcryptjs");

const isAuth = require("./middleware/is-auth");
const isNotAuth = require("./middleware/is-not-auth");

const session = require("express-session");
const { log } = require("console");
const app = ex();

// logged in user's contact
var userId;


app.use(ex.static("public"));
app.use(bp.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(bp.json());

const MongoDBStore = require("connect-mongodb-session")(session);
const store = new MongoDBStore({
  uri: "mongodb://0.0.0.0:27017/Sarv_DaanDB",
  collection: "sessions",
});

app.use(
  session({
    secret: "my secret",
    resave: false,
    saveUninitialized: false,
    store: store,
  })
);

app.get("/", isNotAuth, function (req, res) {
  res.render("home");
});

app.get("/index", isNotAuth, function (req, res) {
  res.render("index");
});

app.post("/index", async (req, res) => {
  const contact = req.body.contact;
  const pass = req.body.password;
  const cpass = req.body.cpassword;

  let existingUser;
  try {
    existingUser = await user.findOne({ contact });

    console.log(existingUser);

    if (existingUser) res.send("<h1>User Already Exists! Login Instead.</h1>");
    else if (pass != cpass)
      res.send("<h1>Try Again, Confirm Password does not match.</h1>");
    else {
      var salt = await bcp.genSalt(10);
      var secPass = await bcp.hash(req.body.password, salt);

      users = await user.create({
        name: req.body.name,
        contact: contact,
        password: secPass,
      });

      userId = users._id;

      req.session.isLoggedIn = true;
      const sessionUser = {
        contact: req.body.contact,
        password: req.body.password,
      };
      req.session.users = sessionUser;
      res.redirect("/secrets");

    }
  } catch (err) {
    res.send(err);
  }
});

app.get("/secrets", isAuth, function (req, res) {
  res.render("secrets");
});

app.post("/logout", function (req, res) {
  if (req.session) {
    req.session.destroy();
  }
  res.render("SignIn");
});

app.get("/SignIn", isNotAuth, function (req, res) {
  res.render("SignIn");
});

app.post("/SignIn", async (req, res) => {
  try {
    const contact = req.body.contact;
    const password = req.body.password;

                   

    const users = await user.findOne({ contact });

    // logged in user's contact
    userId = users._id 

    if (users) {
      if (bcp.compareSync(password, users.password)) {

        req.session.isLoggedIn = true;
        req.session.users = req.body;
        res.redirect("/secrets");

      } else res.send("<h1>Wrong Password</h1>");
    } else res.send("<h1>Oops!! Not An Existing User. Please Register.</h1>");
  } catch (err) {
    res.status(400).send("Error Occured.");
  }
});

app.get("/Feedback", function (req, res) {
  res.render("feedback");
});

app.post("/Feedback", async (req, res) => {
  let fb = req.body;
  let today = new Date().toLocaleDateString();

  try {
    fb = await feedback.create({
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      date: today,
      gender: req.body.gender,
      email: req.body.email,
      medium: req.body.medium,
      comment: req.body.comment,
    });
    res.render("successful")
  } catch (err) {
    res.send("<h1>Please fill all the fields.</h1>");
  }
});

app.get("/Donate", function (req, res) {
  res.render("donatePage");
});

const storage = multer.diskStorage({
  destination: "./public/image/",
  filename: (req, file, cb) => {
    cb(null, file.fieldname + "-" + Date.now());
  },
});

const upload = multer({
  storage: storage,
});

app.post("/Donate", upload.single("photo"), async (req, res) => {
  let d = req.body;
  try {
    const c = "yes";
    var img = fs.readFileSync(__dirname + "/public/image/" + req.file.filename);
    var encode_img = img.toString("base64");
    if (req.body.check == c) {
      d = await donate.create({
        address1: req.body.where1,
        address2: req.body.where2,
        city: req.body.where3,
        region: req.body.where4,
        pinCode: req.body.where5,
        food: req.body.food,
        timeFrom: req.body.timeFrom,
        timeTo: req.body.timeTo,
        date: req.body.date,
        medium: req.body.medium,
        photo: {
          contentType: req.file.mimetype,
          image: new Buffer(encode_img, "base64"),
        }
      });
      res.render("successful");
    } else res.send("<h1>Check the quality and hygiene of food.</h1>");
  } catch (err) {
    res.send("<h1>Please fill all the fields.</h1>" + err);
  }
});

app.get("/Request", function (req, res) {
  res.render("requestPage");
});

app.post("/Request", async (req, res) => {

  // existingUser = UserSearch;
  // try {
    // existingUser = await user.find(req.body.contact);
    // console.log(existingUser);
    // if (existingUser){
      // userId = await user.findOne( {contact:existingUser} );
      // console.log(userId._id);
      try {
        r = await requ.create({
          address1: req.body.where1,
          address2: req.body.where2,
          city: req.body.where3,
          region: req.body.where4,
          pinCode: req.body.where5,
          number: req.body.number,
          user: userId
        });
        console.log(userId);
        console.log(req.body);
        res.render("successful");
      } catch (err) {
        res.send("<h1>Please fill all the fields.</h1>"+'\n' +err);
      }
    // } 
    // else res.send("User not found! Please login first");
  // } catch(err) {
    // console.log(err)
  // }


//   let r = req.body;
//   try {
//     r = await requ.create({
//       address1: req.body.where1,
//       address2: req.body.where2,
//       city: req.body.where3,
//       region: req.body.where4,
//       pinCode: req.body.where5,
//       number: req.body.number,
//     });
//     res.render("successful")
//   } catch (err) {
//     res.send("<h1>Please fill all the fields.</h1>");
//   }
// });

// app.get("/NGO", function (req, res) {
//   res.render("ngoPage");
// });

// app.post("/NGO", async (req, res) => {
//   let n = req.body;
//   try {
//     const c = 'yes'
//     if (req.body.check == c) {
//       n = await ngo.create({
//         medium: req.body.medium,
//         name: req.body.name,
//         agent: req.body.agent,
//         address1: req.body.to1,
//         address2: req.body.to2,
//         city: req.body.to3,
//         region: req.body.to4,
//         pinCode: req.body.to5
//       });
//       res.render("successful");
//     }
//     else res.send("<h1>Check the quality and hygiene of food.</h1>");
//   } catch (err) {
//     res.send("<h1>Please fill all the fields.</h1>");
//   }
});

app.get("/AboutUs", function (req, res) {
  res.render("AboutUs");
});

app.get("/Home", function (req, res) {
  res.render("home");
});

app.get("/Settings", function (req, res) {
  res.render("settings");
});

app.get("/who_we_are", function (req, res) {
  res.render("who_we_are");
});

app.get("/Help", function (req, res) {
  res.render("help");
});

app.get("/email", function (req, res) {
  res.render("email");
});

app.get("/Forget", function (req, res) {
  res.render("forgetPassword");
});

app.get("/FMobile", function (req, res) {
  res.render("forgetMobile");
});

app.listen(9000, () => {
  console.log("Server running on port 9000");
});
