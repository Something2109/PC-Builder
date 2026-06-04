const appUser = process.env.APP_DATABASE_USERNAME;
const appPassword = process.env.APP_DATABASE_PASSWORD;
const dbName = process.env.MONGODB_INITDB_DATABASE;

// Switch database context explicitly to ensure the user is created in the target database
db = db.getSiblingDB(dbName);

// Create an application user
db.createUser({
  user: appUser,
  pwd: appPassword,
  roles: [{ role: "readWrite", db: dbName }],
});
