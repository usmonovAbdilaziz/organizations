import * as argon2 from "argon2";
import { translateText } from "../src/utils/translate";

async function main() {
  const hash = await argon2.hash("123456", {
    type: argon2.argon2id,
    memoryCost: 65536,
    timeCost: 3,
    parallelism: 1,
  });

  console.log(hash);
  const result = await translateText("Milliy taomlar", "ru");
  console.log(result);
}

main();