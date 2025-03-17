const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";
const SUPABASE_URL = process.env.NEXT_SUPABASE_URL ?? "";
const SUPABASE_KEY = process.env.NEXT_SUPABASE_KEY ?? "";
const SECRET_KEY = process.env.NEXT_PUBLIC_SECRET_KEY ?? ""; // 서버와 공유하는 키

export { BASE_URL, SUPABASE_URL, SUPABASE_KEY, SECRET_KEY };
