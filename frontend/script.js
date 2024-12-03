const API_URL = 'http://localhost:8000';

// Fetch and display students from API
async function fetchStudents() {
    try {
        const filterCountry = document.getElementById('filterCountry').value;
        const filterAge = document.getElementById('filterAge').value;
        
        let url = `${API_URL}/students`;
        const params = new URLSearchParams();
        if (filterCountry) params.append('country', filterCountry);
        if (filterAge) params.append('age', filterAge);
        if (params.toString()) url += `?${params.toString()}`;

        const response = await fetch(url);
        if (!response.ok) throw new Error('Failed to fetch students');
        
        const data = await response.json();
        const studentList = document.getElementById('studentList');
        studentList.innerHTML = '';
        
        data.data.forEach(student => {
            studentList.innerHTML += `
                <div class="student-item">
                    <div class="student-info">
                        <p><strong>Name:</strong> ${student.name}</p>
                        <p><strong>Age:</strong> ${student.age}</p>
                        <p><strong>City:</strong> ${student.address.city}</p>
                        <p><strong>Country:</strong> ${student.address.country}</p>
                    </div>
                    <div class="student-actions">
                        <button class="edit" onclick="showEditForm('${student.id}')">Edit</button>
                        <button class="delete" onclick="deleteStudent('${student.id}')">Delete</button>
                    </div>
                </div>
            `;
        });
    } catch (error) {
        alert('Error: ' + error.message);
    }
}

// Filter students
function filterStudents() {
    fetchStudents();
}

// Add a new student
async function addStudent(event) {
    event.preventDefault();
    try {
        const response = await fetch(`${API_URL}/students`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name: document.getElementById('name').value,
                age: parseInt(document.getElementById('age').value),
                address: {
                    city: document.getElementById('city').value,
                    country: document.getElementById('country').value
                }
            })
        });

        if (!response.ok) throw new Error('Failed to add student');
        
        const result = await response.json();
        if (result.id) {
            alert("Student added successfully!");
            hideForm('addStudentForm');
            fetchStudents();
            event.target.reset();
        }
    } catch (error) {
        alert('Error: ' + error.message);
    }
}

// Show edit form with student data
async function showEditForm(studentId) {
    try {
        const response = await fetch(`${API_URL}/students/${studentId}`);
        if (!response.ok) throw new Error('Failed to fetch student details');
        
        const student = await response.json();
        
        document.getElementById('editStudentId').value = studentId;
        document.getElementById('editName').value = student.name;
        document.getElementById('editAge').value = student.age;
        document.getElementById('editCity').value = student.address.city;
        document.getElementById('editCountry').value = student.address.country;
        
        document.getElementById('editStudentForm').style.display = 'block';
    } catch (error) {
        alert('Error: ' + error.message);
    }
}

// Update student
async function updateStudent(event) {
    event.preventDefault();
    const studentId = document.getElementById('editStudentId').value;
    
    try {
        const response = await fetch(`${API_URL}/students/${studentId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: document.getElementById('editName').value,
                age: parseInt(document.getElementById('editAge').value),
                address: {
                    city: document.getElementById('editCity').value,
                    country: document.getElementById('editCountry').value
                }
            })
        });

        if (!response.ok) throw new Error('Failed to update student');
        
        alert('Student updated successfully!');
        hideForm('editStudentForm');
        fetchStudents();
    } catch (error) {
        alert('Error: ' + error.message);
    }
}

// Delete student
async function deleteStudent(studentId) {
    if (confirm('Are you sure you want to delete this student?')) {
        try {
            const response = await fetch(`${API_URL}/students/${studentId}`, {
                method: 'DELETE'
            });

            if (!response.ok) throw new Error('Failed to delete student');
            
            alert('Student deleted successfully!');
            fetchStudents();
        } catch (error) {
            alert('Error: ' + error.message);
        }
    }
}

// Show/Hide forms
function showAddStudentForm() {
    document.getElementById('addStudentForm').style.display = 'block';
}

function hideForm(formId) {
    document.getElementById(formId).style.display = 'none';
}

// Initialize
window.onload = fetchStudents;
