const appUser = process.env.MONGODB_INITDB_ROOT_USERNAME;
const appPassword = process.env.MONGODB_INITDB_ROOT_PASSWORD;
const dbName = process.env.MONGODB_INITDB_DATABASE;
// Create an application user
db.createUser({
  user: appUser,
  pwd: appPassword,
  roles: [{ role: "readWrite", db: dbName }],
});
