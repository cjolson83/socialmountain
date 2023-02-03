require("dotenv").config();
const { sequelize } = require("./util/database");
const { User } = require("./models/user");
const { Post } = require("./models/post");

const express = require("express");
const cors = require("cors");

const { SERVER_PORT } = process.env;

const {
  getAllPosts,
  getCurrentUserPosts,
  addPost,
  editPost,
  deletePost,
} = require("./controllers/posts");
const { login, register } = require("./controllers/auth");
const { isAuthenticated } = require("./middleware/isAuthenticated");

User.hasMany(Post);
Post.belongsTo(User);

const app = express();

app.use(express.json());
app.use(cors());

app.post("/register", register);
app.post("/login", login);

app.get("/posts", getAllPosts);

app.get("/userposts/:userId", getCurrentUserPosts);
app.post("/posts", isAuthenticated, addPost);
app.put("/posts/:id", isAuthenticated, editPost);
app.delete("/posts/:id", isAuthenticated, deletePost);

sequelize
  .sync()
  .then(() => {
    app.listen(SERVER_PORT, () =>
      console.log(`db sync successful & server running on port ${SERVER_PORT}`)
    );
  })
  .catch((err) => console.log(err));
