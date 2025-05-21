/**
 * Specialized function for creating a user that tries multiple approaches
 * This targets the /api/auth/create-user endpoint specifically
 */

export async function createUserMultiFormat(userData) {
  const backendUrl = 'https://iqtest-server-tkhl.onrender.com';
  const baseEndpoint = '/api/auth';
  const primaryUrl = `${backendUrl}${baseEndpoint}/create-user`;
  const fallbackUrl = `${backendUrl}${baseEndpoint}/register`;
  
  console.log(`Starting user creation for ${userData.username} with multiple approaches`);
  
  // Ensure all required fields are present
  const formattedData = {
    Username: userData.username,
    Password: userData.password,
    Country: userData.country,
    Age: userData.age
  };
  
  // Lowercase version for testing
  const lowercaseData = {
    username: userData.username,
    password: userData.password,
    country: userData.country,
    age: userData.age
  };
  
  // Try all the approaches

  // Approach 1: Standard JSON with PascalCase to create-user
  try {
    console.log('Approach #1: Standard JSON with PascalCase to create-user');
    const response = await fetch(primaryUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(formattedData),
      credentials: 'include',
      mode: 'cors'
    });
    
    console.log(`Approach #1 status: ${response.status}`);
    if (response.ok) {
      const data = await response.json();
      console.log("Approach #1 succeeded!");
      
      // Set cookies for the user session
      if (data.token) {
        document.cookie = `token=${data.token};path=/;max-age=${86400};`;
        
        if (data.refreshToken) {
          document.cookie = `refreshToken=${data.refreshToken};path=/;max-age=${7*86400};`;
        }
        
        const userDataObj = {
          username: data.username,
          country: data.country,
          age: data.age
        };
        
        document.cookie = `userData=${JSON.stringify(userDataObj)};path=/;max-age=${30*86400};`;
      }
      
      return data;
    } else {
      const errorText = await response.text();
      console.log(`Approach #1 error: ${errorText}`);
    }
  } catch (error) {
    console.error("Approach #1 exception:", error);
  }

  // Approach 2: Standard JSON with camelCase to create-user
  try {
    console.log('Approach #2: Standard JSON with camelCase to create-user');
    const response = await fetch(primaryUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(lowercaseData),
      credentials: 'include',
      mode: 'cors'
    });
    
    console.log(`Approach #2 status: ${response.status}`);
    if (response.ok) {
      const data = await response.json();
      console.log("Approach #2 succeeded!");
      
      // Set cookies for the user session
      if (data.token) {
        document.cookie = `token=${data.token};path=/;max-age=${86400};`;
        
        if (data.refreshToken) {
          document.cookie = `refreshToken=${data.refreshToken};path=/;max-age=${7*86400};`;
        }
        
        const userDataObj = {
          username: data.username,
          country: data.country,
          age: data.age
        };
        
        document.cookie = `userData=${JSON.stringify(userDataObj)};path=/;max-age=${30*86400};`;
      }
      
      return data;
    } else {
      const errorText = await response.text();
      console.log(`Approach #2 error: ${errorText}`);
    }
  } catch (error) {
    console.error("Approach #2 exception:", error);
  }

  // Approach 3: Form URL encoded to create-user
  try {
    console.log('Approach #3: Form URL encoded to create-user');
    const formData = new URLSearchParams();
    
    // Add all fields to form data
    Object.entries(formattedData).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.append(key, value.toString());
      }
    });
    
    const response = await fetch(primaryUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json'
      },
      body: formData.toString(),
      credentials: 'include',
      mode: 'cors'
    });
    
    console.log(`Approach #3 status: ${response.status}`);
    if (response.ok) {
      const data = await response.json();
      console.log("Approach #3 succeeded!");
      
      // Set cookies for the user session
      if (data.token) {
        document.cookie = `token=${data.token};path=/;max-age=${86400};`;
        
        if (data.refreshToken) {
          document.cookie = `refreshToken=${data.refreshToken};path=/;max-age=${7*86400};`;
        }
        
        const userDataObj = {
          username: data.username,
          country: data.country,
          age: data.age
        };
        
        document.cookie = `userData=${JSON.stringify(userDataObj)};path=/;max-age=${30*86400};`;
      }
      
      return data;
    } else {
      const errorText = await response.text();
      console.log(`Approach #3 error: ${errorText}`);
    }
  } catch (error) {
    console.error("Approach #3 exception:", error);
  }

  // Approach 4: Try fallback to register endpoint
  try {
    console.log('Approach #4: Standard JSON with PascalCase to register endpoint');
    const response = await fetch(fallbackUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(formattedData),
      credentials: 'include',
      mode: 'cors'
    });
    
    console.log(`Approach #4 status: ${response.status}`);
    if (response.ok) {
      const data = await response.json();
      console.log("Approach #4 succeeded!");
      
      // Set cookies for the user session
      if (data.token) {
        document.cookie = `token=${data.token};path=/;max-age=${86400};`;
        
        if (data.refreshToken) {
          document.cookie = `refreshToken=${data.refreshToken};path=/;max-age=${7*86400};`;
        }
        
        const userDataObj = {
          username: data.username,
          country: data.country,
          age: data.age
        };
        
        document.cookie = `userData=${JSON.stringify(userDataObj)};path=/;max-age=${30*86400};`;
      }
      
      return data;
    } else {
      const errorText = await response.text();
      console.log(`Approach #4 error: ${errorText}`);
    }
  } catch (error) {
    console.error("Approach #4 exception:", error);
  }

  // Approach 5: Try via proxy to create-user
  try {
    console.log('Approach #5: Proxy with PascalCase to create-user');
    // Use the proxy endpoint via Vercel app
    const proxyUrl = '/api/auth/create-user';
    
    const response = await fetch(proxyUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(formattedData),
      credentials: 'include'
    });
    
    console.log(`Approach #5 status: ${response.status}`);
    if (response.ok) {
      const data = await response.json();
      console.log("Approach #5 succeeded!");
      
      // Set cookies for the user session
      if (data.token) {
        document.cookie = `token=${data.token};path=/;max-age=${86400};`;
        
        if (data.refreshToken) {
          document.cookie = `refreshToken=${data.refreshToken};path=/;max-age=${7*86400};`;
        }
        
        const userDataObj = {
          username: data.username,
          country: data.country,
          age: data.age
        };
        
        document.cookie = `userData=${JSON.stringify(userDataObj)};path=/;max-age=${30*86400};`;
      }
      
      return data;
    } else {
      const errorText = await response.text();
      console.log(`Approach #5 error: ${errorText}`);
    }
  } catch (error) {
    console.error("Approach #5 exception:", error);
  }

  // Approach 6: Proxy to register endpoint
  try {
    console.log('Approach #6: Proxy with register endpoint');
    // Use the proxy endpoint via Vercel app
    const proxyUrl = '/api/auth/register';
    
    const response = await fetch(proxyUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(formattedData),
      credentials: 'include'
    });
    
    console.log(`Approach #6 status: ${response.status}`);
    if (response.ok) {
      const data = await response.json();
      console.log("Approach #6 succeeded!");
      
      // Set cookies for the user session
      if (data.token) {
        document.cookie = `token=${data.token};path=/;max-age=${86400};`;
        
        if (data.refreshToken) {
          document.cookie = `refreshToken=${data.refreshToken};path=/;max-age=${7*86400};`;
        }
        
        const userDataObj = {
          username: data.username,
          country: data.country,
          age: data.age
        };
        
        document.cookie = `userData=${JSON.stringify(userDataObj)};path=/;max-age=${30*86400};`;
      }
      
      return data;
    } else {
      const errorText = await response.text();
      console.log(`Approach #6 error: ${errorText}`);
    }
  } catch (error) {
    console.error("Approach #6 exception:", error);
  }
  
  // If all approaches fail, create an offline user
  console.log("All user creation approaches failed, creating offline user");
  
  const offlineUser = {
    token: "dummy_token_" + Date.now(),
    username: userData.username,
    country: userData.country,
    age: userData.age,
    message: "User created in offline mode"
  };
  
  // Set cookies for offline user
  document.cookie = `token=${offlineUser.token};path=/;max-age=${86400};`;
  document.cookie = `offline_mode=true;path=/;max-age=${86400};`;
  
  const userDataObj = {
    username: offlineUser.username,
    country: offlineUser.country,
    age: offlineUser.age
  };
  
  document.cookie = `userData=${JSON.stringify(userDataObj)};path=/;max-age=${86400};`;
  
  return offlineUser;
}

export default createUserMultiFormat;