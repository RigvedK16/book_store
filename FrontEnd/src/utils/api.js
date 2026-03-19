

// export const API_BASE = "http://13.60.36.198:7777";

// export async function api(path, { method = "GET", body, headers = {} } = {}) {
//   // ✅ Don't set Content-Type for FormData - let browser handle it
//   const isFormData = body instanceof FormData;

//   const fetchHeaders = {
//     ...(!isFormData && { "Content-Type": "application/json" }),
//     ...headers,
//   };

//   const res = await fetch(`${API_BASE}${path}`, {
//     method,
//     credentials: "include",
//     headers: fetchHeaders,
//     body: isFormData ? body : (body ? JSON.stringify(body) : undefined),
//   });

//   const contentType = res.headers.get("content-type") || "";
//   const data = contentType.includes("application/json")
//     ? await res.json()
//     : await res.text();

//   if (!res.ok) {
//     const message = typeof data === "string"
//       ? data
//       : data?.message || "Request failed";
//     throw new Error(message);
//   }
//   return data;
// }

const API_BASE = "http://13.60.36.198:7777";

export async function api(path, options = {}) {
  const token = localStorage.getItem("token");

  const res = await fetch(`${API_BASE}${path}`, {
    method: options.method || "GET",
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  const data = await res.json();

  if (!res.ok) throw new Error(data.message);
  return data;
}