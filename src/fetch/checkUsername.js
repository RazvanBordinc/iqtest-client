/**
 * Special utility specifically for the check-username endpoint
 * This isolates just that functionality to make debugging easier
 */
 
// 10 different approaches to try to get the check-username endpoint working
export async function checkUsernameTryAllApproaches(username) {
  const backendUrl = 'https://iqtest-server-tkhl.onrender.com';
  const endpoint = '/api/auth/check-username';
  const url = `${backendUrl}${endpoint}`;
  
  console.log(`Starting username check for "${username}" with multiple approaches`);
  
  // #1: Standard JSON with uppercase Username property
  try {
    console.log("Approach #1: Standard JSON with uppercase Username property");
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
      console.log("Approach #1 succeeded!");
      return data;
    } else {
      const errorText = await response.text();
      console.log(`Approach #1 error: ${errorText}`);
    }
  } catch (error) {
    console.error("Approach #1 exception:", error);
  }
  
  // #2: Standard JSON with quotes around Username property value
  try {
    console.log('Approach #2: Standard JSON with quotes around Username value');
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({ "Username": username }),
      credentials: 'include',
      mode: 'cors'
    });
    
    console.log(`Approach #2 status: ${response.status}`);
    if (response.ok) {
      const data = await response.json();
      console.log("Approach #2 succeeded!");
      return data;
    } else {
      const errorText = await response.text();
      console.log(`Approach #2 error: ${errorText}`);
    }
  } catch (error) {
    console.error("Approach #2 exception:", error);
  }
  
  // #3: Standard JSON with lowercase username property
  try {
    console.log('Approach #3: Standard JSON with lowercase username property');
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({ username: username }),
      credentials: 'include',
      mode: 'cors'
    });
    
    console.log(`Approach #3 status: ${response.status}`);
    if (response.ok) {
      const data = await response.json();
      console.log("Approach #3 succeeded!");
      return data;
    } else {
      const errorText = await response.text();
      console.log(`Approach #3 error: ${errorText}`);
    }
  } catch (error) {
    console.error("Approach #3 exception:", error);
  }
  
  // #4: No Content-Type header with form-data
  try {
    console.log('Approach #4: No Content-Type header with form-data');
    const formData = new FormData();
    formData.append('Username', username);
    
    const response = await fetch(url, {
      method: 'POST',
      body: formData,
      credentials: 'include',
      mode: 'cors'
    });
    
    console.log(`Approach #4 status: ${response.status}`);
    if (response.ok) {
      const data = await response.json();
      console.log("Approach #4 succeeded!");
      return data;
    } else {
      const errorText = await response.text();
      console.log(`Approach #4 error: ${errorText}`);
    }
  } catch (error) {
    console.error("Approach #4 exception:", error);
  }
  
  // #5: Raw string as JSON
  try {
    console.log('Approach #5: Raw string as JSON');
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: `{"Username":"${username}"}`,
      credentials: 'include',
      mode: 'cors'
    });
    
    console.log(`Approach #5 status: ${response.status}`);
    if (response.ok) {
      const data = await response.json();
      console.log("Approach #5 succeeded!");
      return data;
    } else {
      const errorText = await response.text();
      console.log(`Approach #5 error: ${errorText}`);
    }
  } catch (error) {
    console.error("Approach #5 exception:", error);
  }
  
  // #6: Using fetch api with toString
  try {
    console.log('Approach #6: Using fetch api with toString');
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({ 'Username': username.toString() }),
      credentials: 'include',
      mode: 'cors'
    });
    
    console.log(`Approach #6 status: ${response.status}`);
    if (response.ok) {
      const data = await response.json();
      console.log("Approach #6 succeeded!");
      return data;
    } else {
      const errorText = await response.text();
      console.log(`Approach #6 error: ${errorText}`);
    }
  } catch (error) {
    console.error("Approach #6 exception:", error);
  }
  
  // #7: Using proxy URL (for CORS issues)
  try {
    console.log('Approach #7: Using proxy URL');
    // Use the proxy endpoint of your Vercel app
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
    
    console.log(`Approach #7 status: ${response.status}`);
    if (response.ok) {
      const data = await response.json();
      console.log("Approach #7 succeeded!");
      return data;
    } else {
      const errorText = await response.text();
      console.log(`Approach #7 error: ${errorText}`);
    }
  } catch (error) {
    console.error("Approach #7 exception:", error);
  }
  
  // #8: Wrap in object called "model"
  try {
    console.log('Approach #8: Wrap in object called "model"');
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({ 
        model: { 
          Username: username 
        } 
      }),
      credentials: 'include',
      mode: 'cors'
    });
    
    console.log(`Approach #8 status: ${response.status}`);
    if (response.ok) {
      const data = await response.json();
      console.log("Approach #8 succeeded!");
      return data;
    } else {
      const errorText = await response.text();
      console.log(`Approach #8 error: ${errorText}`);
    }
  } catch (error) {
    console.error("Approach #8 exception:", error);
  }
  
  // #9: Text/plain with raw string
  try {
    console.log('Approach #9: Text/plain with raw string');
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
    
    console.log(`Approach #9 status: ${response.status}`);
    if (response.ok) {
      const data = await response.json();
      console.log("Approach #9 succeeded!");
      return data;
    } else {
      const errorText = await response.text();
      console.log(`Approach #9 error: ${errorText}`);
    }
  } catch (error) {
    console.error("Approach #9 exception:", error);
  }
  
  // #10: XMLHttpRequest (old school)
  try {
    console.log('Approach #10: XMLHttpRequest');
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open('POST', url, true);
      xhr.setRequestHeader('Content-Type', 'application/json');
      xhr.withCredentials = true;
      
      xhr.onload = function() {
        console.log(`Approach #10 status: ${xhr.status}`);
        if (xhr.status >= 200 && xhr.status < 300) {
          console.log("Approach #10 succeeded!");
          resolve(JSON.parse(xhr.responseText));
        } else {
          console.log(`Approach #10 error: ${xhr.responseText}`);
          reject(new Error(`HTTP Error: ${xhr.status}`));
        }
      };
      
      xhr.onerror = function() {
        console.error("Approach #10 network error");
        reject(new Error('Network error'));
      };
      
      xhr.send(JSON.stringify({ Username: username }));
    });
  } catch (error) {
    console.error("Approach #10 exception:", error);
  }
  
  // If all approaches fail, return a dummy response
  console.warn("All approaches failed, returning dummy response");
  return { 
    message: "Username check completed", 
    exists: null 
  };
}

// Export the main function to be used in the app
export default checkUsernameTryAllApproaches;