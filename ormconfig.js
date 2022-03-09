module.exports =
  process.env.NODE_ENV === "production"
    ? productionConfig()
    : developmentConfig();

function productionConfig() {
  return {
    type: "postgres",
    url: process.env.DATABASE_URL,
    ssl: true,
    entities: ["server/src/entity/**/*.ts"],
    migrations: ["server/src/migration/**/*.ts"],
    subscribers: ["server/src/subscriber/**/*.ts"],
    cli: {
      entitiesDir: "server/src/entity",
      migrationsDir: "server/src/migration",
      subscribersDir: "server/src/subscriber"
    }
  };
}

function developmentConfig() {
  return {
    type: "sqlite",
    database: "development.sqlite",
    entities: ["server/src/entity/**/*.ts"],
    migrations: ["server/src/migration/**/*.ts"],
    subscribers: ["server/src/subscriber/**/*.ts"],
    cli: {
      entitiesDir: "server/src/entity",
      migrationsDir: "server/src/migration",
      subscribersDir: "server/src/subscriber"
    }
  };
}
