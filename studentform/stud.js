// Import necessary Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-auth.js";
import { getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-firestore.js";

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCl7Y9gWDII9QUOY73UdndyCK1lTuJE6gQ",
    authDomain: "hackaton-bb671.firebaseapp.com",
    projectId: "hackaton-bb671",
    storageBucket: "hackaton-bb671.appspot.com",
    messagingSenderId: "286754102966",
    appId: "1:286754102966:web:72ef85c07ff4e024fe1017",
    measurementId: "G-9L0599MDV2"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore(app);

document.getElementById('studentForm').addEventListener('click', function(event) {
    event.preventDefault(); // Prevent default form submission
    // Retrieve the form data
    let studentData = {
        firstName: document.getElementById('firstName').value,
        lastName: document.getElementById('lastName').value,
        email: document.getElementById('email').value,
        password: document.getElementById('password').value,
        cnic: document.getElementById('cnic').value,
        userType: document.getElementById('userType').value
    };

    // Create a new user with email and password
    createUserWithEmailAndPassword(auth, studentData.email, studentData.password)
        .then((userCredential) => {
            // Get user ID from the result
            const userId = userCredential.user.uid;

            // Save additional student data to Firestore
            const userDoc = doc(db, "students", userId);
            setDoc(userDoc, {
                firstName: studentData.firstName,
                lastName: studentData.lastName,
                email: studentData.email,
                cnic: studentData.cnic,
                userType: studentData.userType,
                uid: userId
            }).then(() => {
                console.log("Student data saved to Firestore.");
                // Redirect to the student list page
                window.location.href = './studentform/studentlist.html';
            }).catch((error) => {
                console.error("Error saving student data to Firestore: ", error);
            });
        })
        .catch((error) => {
            console.error("Error during signup: ", error);
            alert("Signup failed: " + error.message);
        });
});





