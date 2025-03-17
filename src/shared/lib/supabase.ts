import { createClient } from "@supabase/supabase-js";
import { SUPABASE_KEY, SUPABASE_URL } from "../constants/env";

class SupabaseService {
  private supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
    auth: {
      autoRefreshToken: false,
    },
  });

  getClient() {
    return this.supabase;
  }

  async isValidToken(token: string) {
    let isValid = false;
    const { data } = await this.supabase.auth.getUser(token);

    if (data) {
      isValid = true;
    }

    return isValid;
  }

  async reissueToken(refreshToken: string) {
    const { data, error } = await this.supabase.auth.refreshSession({
      refresh_token: refreshToken,
    });

    return { data, error };
  }

  async logout() {
    return this.supabase.auth.signOut({ scope: "global" });
  }
}

export const supabaseService = new SupabaseService();
