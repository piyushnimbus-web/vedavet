import "reflect-metadata";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./module";
import * as express from "express";
import { existsSync } from "fs";
import { join, resolve } from "path";
const PREFIX = "/beta/node";
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
  });
  // Browser assets use /beta/node/... URLs. Strip that prefix so the app works both behind the prefix-stripping Nginx proxy and when opened directly.
  app.use((req: any, _res: any, next: any) => {
    if (req.url === PREFIX || req.url.startsWith(PREFIX + "/"))
      req.url = req.url.slice(PREFIX.length) || "/";
    next();
  });
  app.use("/staff", express.static(join(process.cwd(), "portal")));
  // Serve the built public website (frontend/dist) when present, replacing the former Nginx web container.
  const web = resolve(
    process.env.FRONTEND_DIST || join(process.cwd(), "..", "frontend", "dist"),
  );
  if (existsSync(join(web, "index.html"))) {
    app.use(express.static(web));
    app.use((req: any, res: any, next: any) => {
      if (
        req.method !== "GET" ||
        req.path.startsWith("/api/") ||
        req.path.startsWith("/staff")
      )
        return next();
      res.sendFile(join(web, "index.html"));
    });
  }
  const port = Number(process.env.PORT || 4000);
  await app.listen(port, process.env.HOST || "0.0.0.0");
  console.log(
    `API http://localhost:${port}/api/v1/health • Portal http://localhost:${port}/staff/ • Website http://localhost:${port}${PREFIX}/`,
  );
}
bootstrap();
