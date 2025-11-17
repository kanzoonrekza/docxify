"use server";

type DataJSONType = { username: string; email: string } | null;

type FormState = {
  success?: boolean;
  error?: string;
  data?: DataJSONType;
};

export async function loginAction(
  _: FormState,
  formData: FormData
): Promise<FormState> {
  const username = formData.get("username") as string;
  const email = formData.get("email") as string;

  const formDataJSON: DataJSONType = {
    username,
    email,
  };

  if (username === "guest" && email === "guest@kocakhost.com") {
    return { success: true };
  }
  return { success: false, error: "Not a guest", data: formDataJSON };
}
