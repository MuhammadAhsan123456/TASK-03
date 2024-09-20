// Import necessary Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-app.js";
import {
  getFirestore,
  collection,
  getDocs,
  doc,
  getDoc,
  updateDoc,
  deleteDoc,
  addDoc,
} from "https://www.gstatic.com/firebasejs/10.13.1/firebase-firestore.js";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCl7Y9gWDII9QUOY73UdndyCK1lTuJE6gQ",
  authDomain: "hackaton-bb671.firebaseapp.com",
  projectId: "hackaton-bb671",
  storageBucket: "hackaton-bb671.appspot.com",
  messagingSenderId: "286754102966",
  appId: "1:286754102966:web:72ef85c07ff4e024fe1017",
  measurementId: "G-9L0599MDV2",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

let currentEditStudentId = null; // Variable to store the ID of the student being edited

// Fetch students and populate the table
async function fetchStudents() {
  try {
    const querySnapshot = await getDocs(collection(db, "students"));
    const tableBody = document.getElementById("studentTableBody");
    tableBody.innerHTML = ""; // Clear existing rows

    querySnapshot.forEach((doc) => {
      const student = doc.data();
      let newRow = tableBody.insertRow();

      newRow.insertCell(0).innerText = student.firstName;
      newRow.insertCell(1).innerText = student.lastName;
      newRow.insertCell(2).innerText = student.email;
      newRow.insertCell(3).innerText = student.cnic;
      newRow.insertCell(4).innerText = student.userType;

      // Create Action buttons (Edit and Delete)
      let actionCell = newRow.insertCell(5);

      let editButton = document.createElement("button");
      editButton.innerText = "Edit";
      editButton.classList.add("edit");
      editButton.onclick = function () {
        editStudent(doc.id);
      };

      let marksButton = document.createElement("button");
      marksButton.innerText = "Add Marks";
      marksButton.classList.add("marks");
      marksButton.onclick = function () {
        editMarks(student);
      };

      let deleteButton = document.createElement("button");
      deleteButton.innerText = "Delete";
      deleteButton.classList.add("delete");
      deleteButton.onclick = function () {
        deleteStudent(doc.id); // Pass document ID for deletion
      };

      let createElementDiv = document.createElement("div");
      createElementDiv.classList.add("d-flex");
      createElementDiv.appendChild(marksButton);
      createElementDiv.appendChild(editButton);
      createElementDiv.appendChild(deleteButton);
      actionCell.appendChild(createElementDiv);
    });
  } catch (error) {
    console.error("Error fetching student data: ", error);
  }
}

// Function to handle the edit action
async function editStudent(studentId) {
  currentEditStudentId = studentId; // Store the ID of the student being edited
  try {
    const studentDoc = await getDoc(doc(db, "students", studentId));
    if (studentDoc.exists()) {
      const student = studentDoc.data();

      // Populate the form with the student's current data
      document.getElementById("editFirstName").value = student.firstName;
      document.getElementById("editLastName").value = student.lastName;
      document.getElementById("editEmail").value = student.email;
      document.getElementById("editCnic").value = student.cnic;
      document.getElementById("editUserType").value = student.userType;

      // Show the edit modal and overlay
      document.getElementById("editStudentModal").style.display = "block";
      document.getElementById("modalOverlay").style.display = "block";
    } else {
      console.log("No such document!");
    }
  } catch (error) {
    console.error("Error editing student: ", error);
  }
}

// Function to handle save action after editing
document.getElementById("saveButton").onclick = async function () {
  if (currentEditStudentId) {
    const updatedFirstName = document.getElementById("editFirstName").value;
    const updatedLastName = document.getElementById("editLastName").value;
    const updatedEmail = document.getElementById("editEmail").value;
    const updatedCnic = document.getElementById("editCnic").value;
    const updatedUserType = document.getElementById("editUserType").value;

    try {
      // Update the student document in Firestore
      await updateDoc(doc(db, "students", currentEditStudentId), {
        firstName: updatedFirstName,
        lastName: updatedLastName,
        email: updatedEmail,
        cnic: updatedCnic,
        userType: updatedUserType,
      });

      console.log("Student updated successfully!");

      // Close the modal and refresh the table
      closeEditModal();
      fetchStudents();
    } catch (error) {
      console.error("Error updating student: ", error);
    }
  }
};

// Function to handle delete action
async function deleteStudent(studentId) {
  try {
    if (confirm("Are you sure you want to delete this student?")) {
      await deleteDoc(doc(db, "students", studentId));
      console.log("Student deleted successfully!");

      // Refresh the table after deletion
      fetchStudents();
    }
  } catch (error) {
    console.error("Error deleting student: ", error);
  }
}

// Function to close the edit modal
function closeEditModal() {
  document.getElementById("editStudentModal").style.display = "none";
  document.getElementById("modalOverlay").style.display = "none";
  currentEditStudentId = null;
}

fetchStudents();

async function editMarks(marksValue) {
  console.log(marksValue, "marks");

  document
    .getElementById("uploadMarksForm")
    .addEventListener("submit", async (event) => {
      event.preventDefault();
      const course = document.getElementById("course").value;
      const studentId = document.getElementById("studentId").value;
      const marks = document.getElementById("marks").value;
      const totalMarks = document.getElementById("totalMarks").value;
      const grade = document.getElementById("grade").value;

      try {
        const response = await addDoc(collection(db, "marks"), {
          course: course,
          studentId: studentId,
          marks: marks,
          totalMarks: totalMarks,
          grade: grade,
          cnic: marksValue.cnic,
        });
        console.log(response)
        if (response.type === "document") {
          document.getElementById("editMarksModal").style.display = "none";
          document.getElementById("modalOverlay").style.display = "none";
        }
        document.getElementById("successMessage").style.display = "block";
        document.getElementById("uploadMarksForm").reset();
        console.log("Marks uploaded successfully!");
      } catch (error) {
        console.error("Error uploading marks: ", error);
      }
    });
  document.getElementById("editMarksModal").style.display = "block";
  document.getElementById("modalOverlay").style.display = "block";

  try {
  } catch (error) {
    console.error("Error editing student: ", error);
  }
}

document.getElementById("handlerSearch").onclick = async function () {
  const querySnapshot = await getDocs(collection(db, "marks"));
  const userNicc = document.getElementById("searchNic").value;
  const innerSingle = document.getElementById("innerSingle");
  const arraypush = [];
  querySnapshot.forEach((doc) => {
    const marks = doc.data();
    arraypush.push(marks);
  });

  const userNic = arraypush.filter((user) => user.cnic == userNicc);
  userNic.map((user) => {
    return (innerSingle.innerHTML += `
    <div>${user.course}</div>
    <div>${user.grade}</div>
    <div>${user.studentId}</div>
    <div>${user.marks}</div>
    <div>${user.totalMarks}</div>
    `);
  });

  console.log(userNic, "userNic");
};
