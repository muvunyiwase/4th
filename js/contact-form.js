// Contact Form Handler
$(document).ready(function() {
    // Get the current hostname to determine API URL
    const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    
    // Try to detect the backend port dynamically
    let API_URL;
    if (isLocalhost) {
        // Default to port 3000 (where simple server starts)
        API_URL = 'http://localhost:3000/api';
        
        // The simple server will auto-find ports: 3000 → 3001 → 3002 → etc.
        // If server starts on a different port, update this line
    } else {
        // Relative path for production on Render
        API_URL = '/api';
    }

    // Handle form submission
    $('#contactForm').on('submit', async function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = {
            name: $('#name').val().trim(),
            email: $('#email').val().trim(),
            website: $('#inlineCheckbox1').is(':checked') ? '1' : '0',
            branding: $('#inlineCheckbox2').is(':checked') ? '1' : '0',
            ecommerce: $('#inlineCheckbox3').is(':checked') ? '1' : '0',
            seo: $('#inlineCheckbox4').is(':checked') ? '1' : '0',
            message: $('#message').val().trim()
        };

        // Basic validation
        if (!formData.name || !formData.email || !formData.message) {
            showAlert('Please fill in all required fields (Name, Email, and Message).', 'danger');
            return;
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            showAlert('Please enter a valid email address.', 'danger');
            return;
        }

        // Show loading state
        const submitBtn = $(this).find('button[type="submit"]');
        const originalText = submitBtn.text();
        submitBtn.text('Sending...').prop('disabled', true);

        try {
            // Use detected port if available, otherwise use default
            const actualApiUrl = isLocalhost && window.detectedBackendPort 
                ? `http://localhost:${window.detectedBackendPort}/api`
                : API_URL;
            
            console.log('Sending to:', `${actualApiUrl}/contact`);
            console.log('Data:', formData);
            
            // Create abort controller for timeout
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
            
            // Send data to backend
            const response = await fetch(`${actualApiUrl}/contact`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
                signal: controller.signal
            });

            clearTimeout(timeoutId);
            
            console.log('Response status:', response.status);
            
            const result = await response.json();
            console.log('Response data:', result);

            if (result.success) {
                // Show success message
                showAlert(result.message, 'success');
                
                // Reset form
                $('#contactForm')[0].reset();
                
                // Scroll to form
                $('html, body').animate({
                    scrollTop: $('#contactForm').offset().top - 100
                }, 500);
            } else {
                showAlert(result.message || 'Failed to send message. Please try again.', 'danger');
            }
        } catch (error) {
            console.error('Error details:', error);
            
            if (error.name === 'AbortError') {
                showAlert('Request timeout. The server is taking too long to respond.', 'danger');
            } else if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
                showAlert('Cannot connect to server. Make sure backend is running on port 3000.', 'danger');
            } else {
                showAlert(`Error: ${error.message}. Please check your connection and try again.`, 'danger');
            }
        } finally {
            // Restore button state
            submitBtn.text(originalText).prop('disabled', false);
        }
    });

    // Function to show alert messages
    function showAlert(message, type) {
        // Remove any existing alerts
        $('.alert').remove();
        
        // Create alert element
        const alertClass = type === 'success' ? 'alert-success' : 'alert-danger';
        const alertHtml = `
            <div class="alert ${alertClass} alert-dismissible fade show mt-3" role="alert">
                ${message}
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>
        `;
        
        // Insert alert before the form
        $('#contactForm').before(alertHtml);
        
        // Auto-remove success alerts after 5 seconds
        if (type === 'success') {
            setTimeout(() => {
                $('.alert-success').alert('close');
            }, 5000);
        }
    }

    // Test backend connection on page load
    async function testBackendConnection() {
        if (!isLocalhost) return; // Only test on localhost
        
        const possiblePorts = [3000, 3001, 3002, 3003, 3004, 3005, 8080, 8081];
        let backendFound = false;
        
        for (const port of possiblePorts) {
            try {
                const testUrl = `http://localhost:${port}/api/health`;
                const response = await fetch(testUrl, { timeout: 1000 });
                
                if (response.ok) {
                    console.log(`✅ Backend found on port ${port}`);
                    // Update the API_URL to use this port
                    window.detectedBackendPort = port;
                    backendFound = true;
                    
                    // Update the displayed port info
                    if (port !== 3000) {
                        console.log(`💡 Note: Backend is running on port ${port}, not 3000`);
                        console.log(`   Update line 8 in contact-form.js if needed:`);
                        console.log(`   API_URL = 'http://localhost:${port}/api'`);
                    }
                    return;
                }
            } catch (error) {
                // Port not available, try next one
                continue;
            }
        }
        
        if (!backendFound) {
            console.warn('⚠️ Backend not found on common ports. Make sure backend is running.');
            console.log('   Start backend with: cd backend && npm run simple');
        }
    }

    // Test connection on page load
    testBackendConnection();
});