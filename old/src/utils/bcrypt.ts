import bcrypt from "bcrypt";

const saltRounds = 10;

export async function HashPassword(password: string) {
	return await bcrypt.hash(password, saltRounds);
}

export async function VerifyPassword(password: string, hash: string) {
	return await bcrypt.compare(password, hash);
}
