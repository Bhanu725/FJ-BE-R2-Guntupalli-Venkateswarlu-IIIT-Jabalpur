const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const apiRequest = async (
  endpoint,
  method = "GET",
  body = null,
  isFormData = false
) => {
  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("token")
      : null;

  const headers = isFormData
    ? { Authorization: `Bearer ${token}` }
    : {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      };

  const res = await fetch(`${API_URL}${endpoint}`, {
    method,
    headers,
    body: body
      ? isFormData
        ? body
        : JSON.stringify(body)
      : null
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Something went wrong");
  }

  return res.json();
};
