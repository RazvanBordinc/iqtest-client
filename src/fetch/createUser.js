/**
 * Specialized function for creating a user that tries multiple approaches
 * This targets the /api/auth/create-user endpoint specifically
 */

export async function createUserMultiFormat(userData) {
  const backendUrl = 'https://iqtest-server-tkhl.onrender.com';
  const endpoint = '/api/auth/create-user';
  const url = `${backendUrl}${endpoint}`;
  
  console.log(`Starting user creation for ${userData.username} with multiple approaches`);
  
  // Ensure all required fields are present
  const formattedData = {
    Username: userData.username,
    Password: userData.password,
    Email: userData.email || `${userData.username}@iqtest.local`,
    Country: userData.country,
    Age: userData.age
  };
  
  // Lowercase version for testing
  const lowercaseData = {
    username: userData.username,
    password: userData.password,
    email: userData.email || `${userData.username}@iqtest.local`,
    country: userData.country,
    age: userData.age
  };
  
  // Try all the approaches

  // Approach 1: Standard JSON with PascalCase
  try {
    console.log('Approach #1: Standard JSON with PascalCase');
    const response = await fetch(url, {
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
    }
  } catch (error) {
    console.error("Approach #1 exception:", error);
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
    }
  } catch (error) {
    console.error("Approach #2 exception:", error);
  }

  // Approach 3: Form URL encoded
  try {
    console.log('Approach #3: Form URL encoded');
    const formData = new URLSearchParams();
    
    // Add all fields to form data
    Object.entries(formattedData).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.append(key, value.toString());
      }
    });
    
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
    }
  } catch (error) {
    console.error("Approach #3 exception:", error);
  }

  // Approach 4: Try via proxy
  try {
    console.log('Approach #4: Proxy with PascalCase');
    // Use the proxy endpoint of Vercel app
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
    }
  } catch (error) {
    console.error("Approach #4 exception:", error);
  }

  // Approach 5: Use XMLHttpRequest
  try {
    console.log('Approach #5: XMLHttpRequest');
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open('POST', url, true);
      xhr.setRequestHeader('Content-Type', 'application/json');
      xhr.withCredentials = true;
      
      xhr.onload = function() {
        console.log(`Approach #5 status: ${xhr.status}`);
        if (xhr.status >= 200 && xhr.status < 300) {
          console.log("Approach #5 succeeded!");
          try {
            const data = JSON.parse(xhr.responseText);
            
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
            
            resolve(data);
          } catch (e) {
            console.error("Error parsing response:", e);
            reject(e);
          }
        } else {
          console.log(`Approach #5 error: ${xhr.responseText}`);
          reject(new Error(`HTTP Error: ${xhr.status}`));
        }
      };
      
      xhr.onerror = function() {
        console.error("Approach #5 network error");
        reject(new Error('Network error'));
      };
      
      xhr.send(JSON.stringify(formattedData));
    });
  } catch (error) {
    console.error("Approach #5 exception:", error);
  }

  // If all approaches fail, create an offline user
  console.log("All user creation approaches failed, creating offline user");
  
  const offlineUser = {
    token: "dummy_token_" + Date.now(),
    username: userData.username,
    email: userData.email || `${userData.username}@iqtest.local`,
    country: userData.country,
    age: userData.age,
    message: "User created in offline mode"
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

export default createUserMultiFormat;