import api from "./api";

export async function getProfile() {
  try {
    return await api.get("/api/profile");
  } catch (error) {
    console.error("Profile fetch error:", error);
    throw error;
  }
}

export async function updateAge(age) {
  try {
    return await api.put("/api/profile/age", { age });
  } catch (error) {
    console.error("Age update error:", error);
    throw error;
  }
}

export async function updateCountry(country) {
  try {
    return await api.put("/api/profile/country", { country });
  } catch (error) {
    console.error("Country update error:", error);
    throw error;
  }
}

export async function getTestHistory(page = 1, limit = 5, testType = null) {
  try {
    let url = `/api/profile/test-history?page=${page}&limit=${limit}`;
    if (testType) {
      url += `&testType=${testType}`;
    }
    const data = await api.get(url);
    
    // Log the response for debugging
    console.log("Test history API response:", data);
    
    // Handle the case where the response is empty or null
    if (!data) {
      console.warn("Empty response from test history API");
      return { results: [], pagination: { totalItems: 0, totalPages: 1, page: 1, limit } };
    }
    
    // Handle when the response is just an empty array (backward compatibility)
    if (Array.isArray(data) && data.length === 0) {
      return { results: [], pagination: { totalItems: 0, totalPages: 1, page: 1, limit } };
    }
    
    // Handle .NET capitalized property names (Results, Pagination)
    if (typeof data === 'object' && data.Results && data.Pagination) {
      return {
        results: data.Results,
        pagination: {
          totalItems: data.Pagination.TotalItems,
          totalPages: data.Pagination.TotalPages,
          page: data.Pagination.Page,
          limit: data.Pagination.Limit
        }
      };
    }
    
    // Handle when the response is an object but missing expected structure
    if (typeof data === 'object' && !data.results && !data.Results && !Array.isArray(data)) {
      console.warn("Unexpected response format from test history API");
      return { results: [], pagination: { totalItems: 0, totalPages: 1, page: 1, limit } };
    }
    
    // If data is an array (old format), convert to new format
    if (Array.isArray(data)) {
      return { 
        results: data, 
        pagination: { 
          totalItems: data.length, 
          totalPages: Math.max(1, Math.ceil(data.length / limit)), 
          page: 1, 
          limit 
        } 
      };
    }
    
    // If we get here, just return the data as is, assuming it's in the correct format
    return data;
  } catch (error) {
    console.error("Test history fetch error:", error);
    // Return a valid but empty response structure on error
    return { results: [], pagination: { totalItems: 0, totalPages: 1, page: 1, limit } };
  }
}