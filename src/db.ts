import { randomBytes } from "node:crypto";
import { DataTypes, Model, Sequelize } from "sequelize";
import { v4 } from "uuid";

const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: "db.sqlite",
  logging: false,
});

export interface UserType {
  name: string;
  id?: string;
  domain?: string;
  followers?: string;
  token?: string;
  password: string;
}

class User extends Model<UserType> {}

User.init(
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    id: {
      type: DataTypes.UUIDV4,
      allowNull: false,
      unique: true,
      primaryKey: true,
      defaultValue: v4,
    },
    domain: {
      type: DataTypes.STRING,
      defaultValue: () => process.env.HOSTNAME,
      allowNull: false,
    },
    followers: {
      type: DataTypes.STRING,
    },
    token: {
      type: DataTypes.STRING,
      defaultValue: () => randomBytes(256).toString("base64url"),
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
  },
  {
    sequelize,
    modelName: "User",
  }
);

export { User };

User.sync({ force: false });
