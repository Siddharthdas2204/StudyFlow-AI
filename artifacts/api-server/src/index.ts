import app from "./app.js";

const rawPort = process.env["PORT"] || "5000";
const port = Number(rawPort);

// Only listen if not running as a Vercel function
if (process.env.NODE_ENV !== "production" || !process.env.VERCEL) {
  app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
  });
}

export default app;
