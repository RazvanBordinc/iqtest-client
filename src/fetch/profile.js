import api from "./api";

export async function getProfile() {
  try {
    return await api.get("api/profile");
  } catch (error) {
    console.error("Profile fetch error:", error);
    throw error;
  }
}

export async function updateAge(age) {
  try {
    return await api.put("api/profile/age", { age });
  } catch (error) {
    console.error("Age update error:", error);
    throw error;
  }
}

export async function updateCountry(country) {
  try {
    return await api.put("api/profile/country", { country });
  } catch (error) {
    console.error("Country update error:", error);
    throw error;
  }
}