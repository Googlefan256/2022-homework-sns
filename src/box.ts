import { Router } from "express";
import { User, UserType } from "./db";

const router = Router();

router.get("/toid/:name", async (req, res, next) => {
  const user = (
    await User.findOne({ where: { name: req.params.name } })
  )?.toJSON<UserType>();
  if (user) {
    return res.end(user.id);
  } else {
    return res.end();
  }
});

router.get("/dm/:id", async (req, res, next) => {
  const user = (
    await User.findOne({ where: { id: req.params.id } })
  )?.toJSON<UserType>();
  if (user) {
    return res.end({ name: user.name, domain: user.domain });
  } else {
    return res.end();
  }
});

export default router;
