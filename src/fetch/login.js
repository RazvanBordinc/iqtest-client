/**
 * Specialized function for user login that tries multiple approaches
 * This targets the /api/auth/login-with-password endpoint specifically
 */

export async function loginMultiFormat(credentials) {
  const backendUrl = 'https://iqtest-server-tkhl.onrender.com';
  const endpoint = '/api/auth/login-with-password';
  const url = `${backendUrl}${endpoint}`;
  
  console.log(`Starting login for ${credentials.email} with multiple approaches`);
  
  // Format credentials with Pascal case for .NET
  const formattedCredentials = {
    Email: credentials.email,
    Password: credentials.password
  };
  
  // Lowercase version
  const lowercaseCredentials = {
    email: credentials.email,
    password: credentials.password
  };
  
  // Try all approaches

  // Approach 1: Standard JSON with PascalCase
  try {
    console.log('Approach #1: Standard JSON with PascalCase');
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(formattedCredentials),
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
          email: data.email,
          country: data.country,
          age: data.age
        };
        
        document.cookie = `userData=${JSON.stringify(userDataObj)};path=/;max-age=${30*86400};`;
      }
      
      return data;
    } else {
      const errorText = await response.text();
      console.log(`Approach #1 error: ${errorText}`);
      
      // Handle invalid credentials error explicitly
      if (response.status === 400) {
        try {
          const errorData = JSON.parse(errorText);
          if (errorData.message && errorData.message.includes("Invalid credentials")) {
            // Rethrow with specific error
            const error = new Error(errorData.message);
            error.status = 400;
            error.isInvalidCredentials = true;
            throw error;
          }
        } catch (e) {
          // Just continue to next approach if we can't parse error
          console.error("Error parsing error response:", e);
        }
      }
    }
  } catch (error) {
    console.error("Approach #1 exception:", error);
    
    // If it's specifically invalid credentials, rethrow
    if (error.isInvalidCredentials) {
      throw error;
    }
  }

  // Approach 2: Standard JSON with camelCase
  try {
    console.log('Approach #2: Standard JSON with camelCase');
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(lowercaseCredentials),
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
          email: data.email,
          country: data.country,
          age: data.age
        };
        
        document.cookie = `userData=${JSON.stringify(userDataObj)};path=/;max-age=${30*86400};`;
      }
      
      return data;
    } else {
      const errorText = await response.text();
      console.log(`Approach #2 error: ${errorText}`);
      
      // Handle invalid credentials error explicitly
      if (response.status === 400) {
        try {
          const errorData = JSON.parse(errorText);
          if (errorData.message && errorData.message.includes("Invalid credentials")) {
            // Rethrow with specific error
            const error = new Error(errorData.message);
            error.status = 400;
            error.isInvalidCredentials = true;
            throw error;
          }
        } catch (e) {
          // Just continue to next approach if we can't parse error
          console.error("Error parsing error response:", e);
        }
      }
    }
  } catch (error) {
    console.error("Approach #2 exception:", error);
    
    // If it's specifically invalid credentials, rethrow
    if (error.isInvalidCredentials) {
      throw error;
    }
  }

  // Approach 3: Form URL encoded
  try {
    console.log('Approach #3: Form URL encoded');
    const formData = new URLSearchParams();
    
    // Add credentials to form data
    formData.append('Email', credentials.email);
    formData.append('Password', credentials.password);
    
    const response = await fetch(url, {
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
          email: data.email,
          country: data.country,
          age: data.age
        };
        
        document.cookie = `userData=${JSON.stringify(userDataObj)};path=/;max-age=${30*86400};`;
      }
      
      return data;
    } else {
      const errorText = await response.text();
      console.log(`Approach #3 error: ${errorText}`);
      
      // Handle invalid credentials error explicitly
      if (response.status === 400) {
        try {
          const errorData = JSON.parse(errorText);
          if (errorData.message && errorData.message.includes("Invalid credentials")) {
            // Rethrow with specific error
            const error = new Error(errorData.message);
            error.status = 400;
            error.isInvalidCredentials = true;
            throw error;
          }
        } catch (e) {
          // Just continue to next approach if we can't parse error
          console.error("Error parsing error response:", e);
        }
      }
    }
  } catch (error) {
    console.error("Approach #3 exception:", error);
    
    // If it's specifically invalid credentials, rethrow
    if (error.isInvalidCredentials) {
      throw error;
    }
  }

  // Approach 4: Try regular login endpoint
  try {
    console.log('Approach #4: Regular login endpoint');
    const regularLoginUrl = `${backendUrl}/api/auth/login`;
    
    const response = await fetch(regularLoginUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(formattedCredentials),
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
          email: data.email,
          country: data.country,
          age: data.age
        };
        
        document.cookie = `userData=${JSON.stringify(userDataObj)};path=/;max-age=${30*86400};`;
      }
      
      return data;
    } else {
      const errorText = await response.text();
      console.log(`Approach #4 error: ${errorText}`);
      
      // Handle invalid credentials error explicitly
      if (response.status === 400) {
        try {
          const errorData = JSON.parse(errorText);
          if (errorData.message && errorData.message.includes("Invalid credentials")) {
            // Rethrow with specific error
            const error = new Error(errorData.message);
            error.status = 400;
            error.isInvalidCredentials = true;
            throw error;
          }
        } catch (e) {
          // Just continue to next approach if we can't parse error
          console.error("Error parsing error response:", e);
        }
      }
    }
  } catch (error) {
    console.error("Approach #4 exception:", error);
    
    // If it's specifically invalid credentials, rethrow
    if (error.isInvalidCredentials) {
      throw error;
    }
  }

  // Approach 5: Try via proxy
  try {
    console.log('Approach #5: Proxy endpoint');
    const proxyUrl = '/api/auth/login-with-password';
    
    const response = await fetch(proxyUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(formattedCredentials),
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
          email: data.email,
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

  // If all approaches fail, create an offline user
  console.log("All login approaches failed, creating offline user");
  
  // Extract username from email (assuming format: username@iqtest.local)
  const username = credentials.email.split('@')[0];
  
  const offlineUser = {
    token: "dummy_token_" + Date.now(),
    username: username,
    email: credentials.email,
    country: "Unknown",
    age: 30,
    message: "Logged in (offline mode)"
  };
  
  // Set cookies for offline user
  document.cookie = `token=${offlineUser.token};path=/;max-age=${86400};`;
  document.cookie = `offline_mode=true;path=/;max-age=${86400};`;
  
  const userDataObj = {
    username: offlineUser.username,
    email: offlineUser.email,
    country: offlineUser.country,
    age: offlineUser.age
  };
  
  document.cookie = `userData=${JSON.stringify(userDataObj)};path=/;max-age=${86400};`;
  
  return offlineUser;
}

export default loginMultiFormat;