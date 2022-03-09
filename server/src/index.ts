import * as fs from "fs";
import * as http from "http";
import * as path from "path";
import express from "express";
import morgan from "morgan";
import rfs from "rotating-file-stream";
import socketIO from "socket.io";
import uuidv4 from "uuid/v4";
import "reflect-metadata";
import { createConnection } from "typeorm";
import { Message } from "./entity/Message";
import { Session } from "./entity/Session";
import expressSession from "express-session";
import { TypeormStore } from "typeorm-store";
import sslRedirect from "heroku-ssl-redirect";
import requestIp from "request-ip";

main();

async function main() {
  const connection = await createConnection();
  const manager = connection.manager;

  const port = process.env.PORT || 80;

  const app = express();

  if (process.env.NODE_ENV === "production") {
    app.set("trust proxy", 1);
  }

  app.use(sslRedirect());

  app.use([
    morgan("combined", {
      stream: rfs("access.log", {
        interval: "1d",
        path: path.join(__dirname, "..", "log")
      })
    }),
    morgan("dev")
  ]);

  const cwd = fs.realpathSync(process.cwd());
  app.use(express.static(path.join(cwd, "build")));

  const secret = process.env.NODE_SESSION_SECRET;
  if (!secret) throw new Error();
  const oneYearInMilliseconds = 1000 * 60 * 60 * 24 * 365;
  const oneWeekInMilliseconds = 1000 * 60 * 60 * 24 * 7;
  const repository = manager.getRepository(Session);
  const session = expressSession({
    name: "s",
    cookie: {
      maxAge: oneYearInMilliseconds,
      secure: process.env.NODE_ENV === "production"
    },
    resave: false,
    rolling: true,
    saveUninitialized: false,
    secret,
    store: new TypeormStore({
      repository,
      ttl: oneWeekInMilliseconds
    })
  });
  app.use(session);
  app.get("/api/signup", (req, res) => {
    if (!req.session) return res.json({});
    if (!req.session.userId) {
      req.session.userId = uuidv4();
    }
    return res.json({});
  });

  app.all("/*", (_, res, __) => {
    res.sendFile(path.join(cwd, "build", "index.html"));
  });

  const server = http.createServer(app);
  const io = socketIO(server);
  io.use((socket, next) => session(socket.request, socket.request.res, next));
  io.on("connection", async socket => {
    const userId = socket.request.session.userId;
    if (!userId) return;
    const ipAddress = getIpAddress(socket.request);
    const messages = await findMessages();
    socket.emit("messages", messages);
    socket.on("message", async ({ name, content }) => {
      const id = uuidv4();
      const time = Date.now().toString();
      await saveMessage(id, userId, ipAddress, name, content, time);
      const messages = await findMessages();
      io.emit("messages", messages);
    });
  });

  server.listen(port, () => {
    console.log(`express listening on port ${port}`);
  });

  function findMessages() {
    return manager.find(Message, {
      select: ["id", "userId", "name", "content", "time"],
      order: {
        time: "DESC"
      },
      take: 24
    });
  }

  function saveMessage(
    id: string,
    userId: string,
    ipAddress: string,
    name: string,
    content: string,
    time: string
  ) {
    const message = new Message(id, userId, ipAddress, name, content, time);
    return manager.save(message);
  }
}

function getIpAddress(request: requestIp.Request): string {
  const ipAddress = requestIp.getClientIp(request);
  if (!ipAddress) return "";
  return ipAddress;
}
