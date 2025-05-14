import { initializeApp } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-app.js";
import { getAuth, RecaptchaVerifier, signInWithPhoneNumber } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-auth.js";

// Your Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyA32MwEStnN50GWJtFISAbVR2vJNPRLNvo",
    authDomain: "saloonmanagement-4197a.firebaseapp.com",
    databaseURL: "https://saloonmanagement-4197a-default-rtdb.firebaseio.com",
    projectId: "saloonmanagement-4197a",
    storageBucket: "saloonmanagement-4197a.firebasestorage.app",
    messagingSenderId: "701864793769",
    appId: "1:701864793769:web:2bbe372dc2c77ff8403bb8",
    measurementId: "G-6ZVVWZW4GR"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Get references to HTML elements
const phoneInput = document.getElementById('phone');
const sendOtpBtn = document.getElementById('send-otp-btn');
const verifyOtpBtn = document.getElementById('verify-otp-btn');
const verificationCodeInput = document.getElementById('verification-code');
const step1Element = document.getElementById('step1');
const step2Element = document.getElementById('step2');
const statusMessage = document.getElementById('status-message');

// Initialize recaptcha verifier
let recaptchaVerifier;
let confirmationResult;

// Set up recaptcha verifier
function setupRecaptcha() {
    recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        'size': 'normal',
        'callback': (response) => {
            // reCAPTCHA solved, enable button
            sendOtpBtn.disabled = false;
        },
        'expired-callback': () => {
            // Response expired. Ask user to solve reCAPTCHA again.
            sendOtpBtn.disabled = true;
        }
    });
    recaptchaVerifier.render();
}

// Initialize the page
window.onload = function() {
    setupRecaptcha();
};

// Send OTP function
sendOtpBtn.addEventListener('click', async () => {
    const phoneNumber = phoneInput.value.trim();
console.log(phoneNumber);

    if (!phoneNumber) {
        alert('Please enter a valid phone number');
        return;
    }

    try {
        sendOtpBtn.disabled = true;
        sendOtpBtn.textContent = 'Sending...';

        // Send verification code
        confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, recaptchaVerifier);

        // Move to verification step
        step1Element.style.display = 'none';
        step2Element.style.display = 'block';
        statusMessage.textContent = 'OTP sent successfully!';
        statusMessage.style.color = 'green';
    } catch (error) {
        console.error('Error sending OTP:', error);
        statusMessage.textContent = `Error: ${error.message}`;
        statusMessage.style.color = 'red';
        sendOtpBtn.disabled = false;
        sendOtpBtn.textContent = 'Send OTP';
        // Reset reCAPTCHA
        recaptchaVerifier.clear();
        setupRecaptcha();
    }
});

// Verify OTP function
verifyOtpBtn.addEventListener('click', async () => {
    const code = verificationCodeInput.value.trim();

    if (!code || code.length !== 6) {
        alert('Please enter a valid 6-digit OTP');
        return;
    }

    try {
        verifyOtpBtn.disabled = true;
        verifyOtpBtn.textContent = 'Verifying...';

        // Verify the code
        const result = await confirmationResult.confirm(code);

        // User signed in successfully
        statusMessage.textContent = 'Phone number verified successfully!';
        statusMessage.style.color = 'green';

        // You can redirect or show success message here
        console.log('User signed in:', result.user);
    } catch (error) {
        console.error('Error verifying OTP:', error);
        statusMessage.textContent = `Error: ${error.message}`;
        statusMessage.style.color = 'red';
        verifyOtpBtn.disabled = false;
        verifyOtpBtn.textContent = 'Verify OTP';
    }
});