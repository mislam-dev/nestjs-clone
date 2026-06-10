import { createServer } from "./server";

async function main() {
  const port = process.env.PORT || 3000;
  const app = createServer();

  app.listen(port, () => {
    console.log(`api running on ${port}`);
  });
}

void main();
