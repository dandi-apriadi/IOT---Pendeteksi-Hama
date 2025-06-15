import { Sequelize } from "sequelize";

const db = new Sequelize('kartika', 'root', '', {
    host: "localhost",
    dialect: "mysql"
});

export default db;