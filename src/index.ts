import express from "express";
import api from "./api";
import box from "./box";
import accountMiddleware from "./account";
import cookieParser from "cookie-parser";

import dotenv from "dotenv";
import { User, UserType } from "./db";
import axios from "axios";
dotenv.config();

const app = express();

app.set("view engine", "ejs");
app.use(cookieParser());
app.use(express.json());

app.use("/box", box);

app.get("/login", (_, res) => res.render("login.ejs"));

app.use(accountMiddleware);

app.use("/api", api);

app.use("/logout", (_, res) => {
  res.clearCookie("token");
  res.redirect("/login");
});

app.get("/", (_, res) => res.render("index.ejs"));

app.get("/dm/@/:id", async (req, res, next) => {
  const { id } = req.params;
  const user = (await User.findOne({ where: { id } }))?.toJSON<UserType>();
  if (user) {
    res.render("dm.ejs", { name: user.name, domain: user.domain, id: user.id });
  } else {
    next();
  }
});

app.get("/dm/:host/:id", async (req, res, next) => {
  const { host, id } = req.params;
  // もちろんtokenは除外されてます
  const user: UserType | null = await axios
    .get(`https://${host}/box/dm/${id}`)
    .then((x) => x.data)
    .catch(() => null);
  if (user) {
    res.render("dm.ejs", { name: user.name, domain: user.domain, id: user.id });
  } else {
    next();
  }
});

app.listen(Number(process.env.PORT));
