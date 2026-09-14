import { hash } from "argon2";
import { password as passwordPrompt } from "@inquirer/prompts";

const PASSWORD_MIN_LENGTH = 15;
const PASSWORD_MAX_LENGTH = 128;
const PASSWORD_PATTERN = /^[A-Za-z0-9!@#$%^&*]+$/;

const BASE64_PATTERN = /^[A-Za-z0-9+/]+={0,2}$/;
const MIN_PEPPER_BYTES = 32;

const isValidPassword = (value: string) =>
  value.length >= PASSWORD_MIN_LENGTH &&
  value.length <= PASSWORD_MAX_LENGTH &&
  PASSWORD_PATTERN.test(value);

const isValidPepper = (value: string) =>
  BASE64_PATTERN.test(value) &&
  Buffer.from(value, "base64").length >= MIN_PEPPER_BYTES;

const readPassword = async (): Promise<string> => {
  for (;;) {
    const value = await passwordPrompt({
      message: `Vault password (${PASSWORD_MIN_LENGTH}-${PASSWORD_MAX_LENGTH} chars: A-Z a-z 0-9 ! @ # $ % ^ & *)`,
      mask: "*",
      validate: (candidate) =>
        isValidPassword(candidate) ||
        `Must be ${PASSWORD_MIN_LENGTH}-${PASSWORD_MAX_LENGTH} characters from A-Z a-z 0-9 ! @ # $ % ^ & *`,
    });

    const confirmation = await passwordPrompt({
      message: "Confirm password",
      mask: "*",
    });

    if (value === confirmation) {
      return value;
    }

    console.error("Passwords do not match. Try again.");
  }
};

const readPepper = async (): Promise<string> => {
  const fromEnv = process.env.ARGON2_PEPPER?.trim() ?? "";

  if (fromEnv !== "") {
    if (!isValidPepper(fromEnv)) {
      throw new Error(
        "ARGON2_PEPPER must be base64 encoding at least 32 bytes (openssl rand -base64 32).",
      );
    }
    return fromEnv;
  }

  return await passwordPrompt({
    message: "ARGON2_PEPPER (leave empty if the endpoint has no pepper)",
    mask: "*",
    validate: (candidate) =>
      candidate === "" ||
      isValidPepper(candidate) ||
      "Pepper must be base64 encoding at least 32 bytes, or empty",
  });
};

if (!process.stdin.isTTY) {
  console.error(
    "This script is interactive. Run it in a terminal with `pnpm hash:vault`.",
  );
  process.exit(1);
}

try {
  const password = await readPassword();
  const pepper = await readPepper();

  const digest = await hash(password, {
    memoryCost: 19456,
    timeCost: 2,
    parallelism: 1,
    ...(pepper !== "" ? { secret: Buffer.from(pepper, "utf8") } : {}),
  });

  console.log(`\npasswordHash: "${digest}"`);
  console.log(
    "\nPaste this into the vault post's frontmatter (src/content/vault/<slug>.md).",
  );
} catch (error) {
  if ((error as { name?: string }).name === "ExitPromptError") {
    process.exit(0);
  }
  throw error;
}
