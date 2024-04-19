import { password } from "bun";

async function hashPassword(clearPassword: string): Promise<{ hash: string }> {
  return Promise.resolve({
    hash: await password.hash(clearPassword, "argon2d"),
  });
}

async function comparePassword(
  inputPassword: string,
  hash: string
): Promise<boolean> {
  return Promise.resolve(await password.verify(inputPassword, hash, "argon2d"));
}

function sha256hash(text: string) {
  return password.hashSync(text);
}

export { hashPassword, comparePassword, sha256hash };
