import { hash } from "argon2";

const pepper = process.env.ARGON2_PEPPER;
const password = process.argv[2] ?? process.env.VAULT_PASSWORD;

if (password === undefined || password === "") {
  console.error("Usage: ARGON2_PEPPER=<pepper> pnpm hash:vault <password>");
  process.exit(1);
}

const digest = await hash(password, {
  memoryCost: 19456,
  timeCost: 2,
  parallelism: 1,
  ...(pepper !== undefined && pepper !== ""
    ? { secret: Buffer.from(pepper, "utf8") }
    : {}),
});

console.log(digest);
