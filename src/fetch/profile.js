import api from "./api";

export async function getProfile() {
  try {
    return await api.get("/profile");
  } catch (error) {
    console.error("Profile fetch error:", error);
    throw error;
  }
}

export async function updateAge(age) {
  try {
    return await api.put("/profile/age", { age });
  } catch (error) {
    console.error("Age update error:", error);
    throw error;
  }
}

export async function updateCountry(country) {
  try {
    return await api.put("/profile/country", { country });
  } catch (error) {
    console.error("Country update error:", error);
    throw error;
  }
}