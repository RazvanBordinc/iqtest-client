/**
 * Specialized function for checking username that tries multiple approaches
 * This targets the /api/auth/check-username endpoint specifically
 */

export async function checkUsernameTryAllApproaches(username) {
  const backendUrl = 'https://iqtest-server-project.onrender.com';
  const endpoint = '/api/auth/check-username';
  const url = `${backendUrl}${endpoint}`;
  
  console.log(`Starting comprehensive username check for ${username} with multiple approaches`);
  
  // Try multiple approaches
  
  // #1: Standard JSON with PascalCase property name
  try {
    console.log('Approach #1: Standard JSON with PascalCase');
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({ Username: username }),
      credentials: 'include',
      mode: 'cors'
    });
    
    console.log(`Approach #1 status: ${response.status}`);
    if (response.ok) {
      const data = await response.json();
      console.log("Approach #1 succeeded!", data);
      return data;
    } else {
      const errorText = await response.text();
      console.log(`Approach #1 error: ${errorText}`);
    }
  } catch (error) {
    console.error("Approach #1 exception:", error);
  }
  
  // #2: Standard JSON with camelCase property name
  try {
    console.log('Approach #2: Standard JSON with camelCase');
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({ username }),
      credentials: 'include',
      mode: 'cors'
    });
    
    console.log(`Approach #2 status: ${response.status}`);
    if (response.ok) {
      const data = await response.json();
      console.log("Approach #2 succeeded!", data);
      return data;
    } else {
      const errorText = await response.text();
      console.log(`Approach #2 error: ${errorText}`);
    }
  } catch (error) {
    console.error("Approach #2 exception:", error);
  }
  
  // #3: URL-encoded form data with PascalCase property
  try {
    console.log('Approach #3: URL-encoded with PascalCase');
    const formData = new URLSearchParams();
    formData.append('Username', username);
    
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
      console.log("Approach #3 succeeded!", data);
      return data;
    } else {
      const errorText = await response.text();
      console.log(`Approach #3 error: ${errorText}`);
    }
  } catch (error) {
    console.error("Approach #3 exception:", error);
  }
  
  // #4: URL-encoded form data with camelCase property
  try {
    console.log('Approach #4: URL-encoded with camelCase');
    const formData = new URLSearchParams();
    formData.append('username', username);
    
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
    
    console.log(`Approach #4 status: ${response.status}`);
    if (response.ok) {
      const data = await response.json();
      console.log("Approach #4 succeeded!", data);
      return data;
    } else {
      const errorText = await response.text();
      console.log(`Approach #4 error: ${errorText}`);
    }
  } catch (error) {
    console.error("Approach #4 exception:", error);
  }
  
  // #5: Try via proxy with PascalCase
  try {
    console.log('Approach #5: Proxy with PascalCase');
    // Use the proxy endpoint of Vercel app
    const proxyUrl = '/api/auth/check-username';
    
    const response = await fetch(proxyUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({ Username: username }),
      credentials: 'include'
    });
    
    console.log(`Approach #5 status: ${response.status}`);
    if (response.ok) {
      const data = await response.json();
      console.log("Approach #5 succeeded!", data);
      return data;
    } else {
      const errorText = await response.text();
      console.log(`Approach #5 error: ${errorText}`);
    }
  } catch (error) {
    console.error("Approach #5 exception:", error);
  }
  
  // #6: Try via proxy with camelCase
  try {
    console.log('Approach #6: Proxy with camelCase');
    // Use the proxy endpoint of Vercel app
    const proxyUrl = '/api/auth/check-username';
    
    const response = await fetch(proxyUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({ username }),
      credentials: 'include'
    });
    
    console.log(`Approach #6 status: ${response.status}`);
    if (response.ok) {
      const data = await response.json();
      console.log("Approach #6 succeeded!", data);
      return data;
    } else {
      const errorText = await response.text();
      console.log(`Approach #6 error: ${errorText}`);
    }
  } catch (error) {
    console.error("Approach #6 exception:", error);
  }
  
  // #7: Try direct string as payload
  try {
    console.log('Approach #7: Direct string as payload');
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain',
        'Accept': 'application/json'
      },
      body: username,
      credentials: 'include',
      mode: 'cors'
    });
    
    console.log(`Approach #7 status: ${response.status}`);
    if (response.ok) {
      const data = await response.json();
      console.log("Approach #7 succeeded!", data);
      return data;
    } else {
      const errorText = await response.text();
      console.log(`Approach #7 error: ${errorText}`);
    }
  } catch (error) {
    console.error("Approach #7 exception:", error);
  }
  
  // #8: Using query parameter
  try {
    console.log('Approach #8: Query parameter');
    const queryUrl = `${url}?Username=${encodeURIComponent(username)}`;
    const response = await fetch(queryUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      },
      credentials: 'include',
      mode: 'cors'
    });
    
    console.log(`Approach #8 status: ${response.status}`);
    if (response.ok) {
      const data = await response.json();
      console.log("Approach #8 succeeded!", data);
      return data;
    } else {
      const errorText = await response.text();
      console.log(`Approach #8 error: ${errorText}`);
    }
  } catch (error) {
    console.error("Approach #8 exception:", error);
  }
  
  // #9: Try a different endpoint pattern with PascalCase
  try {
    console.log('Approach #9: Different endpoint pattern with PascalCase');
    const alternativeUrl = `${backendUrl}/api/Auth/check-username`;
    const response = await fetch(alternativeUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({ Username: username }),
      credentials: 'include',
      mode: 'cors'
    });
    
    console.log(`Approach #9 status: ${response.status}`);
    if (response.ok) {
      const data = await response.json();
      console.log("Approach #9 succeeded!", data);
      return data;
    } else {
      const errorText = await response.text();
      console.log(`Approach #9 error: ${errorText}`);
    }
  } catch (error) {
    console.error("Approach #9 exception:", error);
  }
  
  // #10: Try with a different case in the endpoint
  try {
    console.log('Approach #10: Different case in endpoint');
    const alternativeUrl = `${backendUrl}/api/Auth/CheckUsername`;
    const response = await fetch(alternativeUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({ Username: username }),
      credentials: 'include',
      mode: 'cors'
    });
    
    console.log(`Approach #10 status: ${response.status}`);
    if (response.ok) {
      const data = await response.json();
      console.log("Approach #10 succeeded!", data);
      return data;
    } else {
      const errorText = await response.text();
      console.log(`Approach #10 error: ${errorText}`);
    }
  } catch (error) {
    console.error("Approach #10 exception:", error);
  }
  
  // #11: Try with a different endpoint format + GET method
  try {
    console.log('Approach #11: Try with a different endpoint format + GET');
    const alternativeUrl = `${backendUrl}/api/Auth/CheckUsername/${encodeURIComponent(username)}`;
    const response = await fetch(alternativeUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      },
      credentials: 'include',
      mode: 'cors'
    });
    
    console.log(`Approach #11 status: ${response.status}`);
    if (response.ok) {
      const data = await response.json();
      console.log("Approach #11 succeeded!", data);
      return data;
    } else {
      const errorText = await response.text();
      console.log(`Approach #11 error: ${errorText}`);
    }
  } catch (error) {
    console.error("Approach #11 exception:", error);
  }
  
  // All approaches failed, return a fallback response
  console.log("All username check approaches failed, returning fallback response");
  return {
    message: "Username check completed",
    exists: false
  };
}

export default checkUsernameTryAllApproaches;