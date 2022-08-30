import { Router } from "express";
import { User, UserType } from "./db";
import axios from "axios";

const router = Router();

router.post("/login", async (req, res, next) => {
  if (!req.body.name) {
    return res.json({
      text: "名前を入力してください",
    });
  }
  if (!req.body.password) {
    return res.json({
      text: "パスワードを入力してください",
    });
  }
  const datauser = await User.findOne({ where: { name: req.body.name } });
  if (datauser) {
    const user = datauser.toJSON<UserType>();
    if (user.password === req.body.password) {
      return res.json({
        ok: true,
        token: user.token,
      });
    } else {
      return res.json({
        text: "パスワードが間違えています。または、そのユーザー名が使用済みです。",
      });
    }
  } else {
    if (req.body.name.length > 16 || req.body.name.length < 4)
      return res.json({
        text: "名前は4~16文字で指定してください。",
      });
    if (req.body.name.match(/[a-zA-Z0-9]/).length !== req.body.name.length)
      return res.json({
        text: "使用できない文字が含まれています。",
      });
    if (req.body.password.length > 32 || req.body.password.length < 8)
      return res.json({
        text: "パスワードは8-32文字で指定してください。",
      });
    User.create({
      name: req.body.name as string,
      password: req.body.password as string,
    }).then((u) =>
      res.json({
        ok: true,
        token: u.toJSON().token as string,
      })
    );
  }
});

router.get("/opendm/:name", async (req, res, next) => {
  const name = (req.params.name as string).split("@");
  if (
    name.length === 1 ||
    (name.length === 2 && name[1] === process.env.HOSTNAME)
  ) {
    const user = (
      await User.findOne({ where: { name: name[0] } })
    )?.toJSON<UserType>();
    if (user) {
      return res.json({
        ok: true,
        domain: "@",
        id: user.id,
      });
    } else {
      return res.json({
        text: "ユーザーが存在しません",
      });
    }
  } else if (name.length === 2) {
    const data = await axios
      .get(`https://${name[1]}/box/toid/${name[0]}`)
      .then((x) => x.data)
      .catch(() => null);
    if (data?.id) {
      return res.json({
        ok: true,
        domain: name[1],
        id: data.id,
      });
    } else {
      return res.json({
        text: "ユーザーが存在しません",
      });
    }
  } else {
    return res.json({
      text: "有効な形式でありません。",
    });
  }
});

export default router;
