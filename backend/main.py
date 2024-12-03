from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from .models import Student, StudentResponse
from .database import students_collection
from bson import ObjectId
from fastapi.middleware.cors import CORSMiddleware



app = FastAPI()

# Add this after creating the FastAPI app
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Helper function to convert MongoDB document to JSON
def student_helper(student) -> dict:
    return {
        "id": str(student["_id"]),
        "name": student["name"],
        "age": student["age"],
        "address": student["address"]
    }

@app.get("/")
async def read_root():
    try:
        return {"message": "Welcome to Student Management API"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/students", response_model=StudentResponse)
async def create_student(student: Student):
    try:
        # Convert the student model to a dictionary
        student_data = student.dict()
        
        # Insert the student data into MongoDB
        new_student = await students_collection.insert_one(student_data)
        
        # Get the created student to verify
        created_student = await students_collection.find_one({"_id": new_student.inserted_id})
        
        if created_student is None:
            raise HTTPException(status_code=404, detail="Student not found after creation")
            
        # Return the ID of the created student
        return StudentResponse(id=str(created_student["_id"]))
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/students", response_model=dict)
async def list_students(country: str = None, age: int = None):
    query = {}
    if country:
        query["address.country"] = country
    if age:
        query["age"] = {"$gte": age}
    
    students = await students_collection.find(query).to_list(length=100)
    return {"data": [student_helper(student) for student in students]}

@app.get("/students/{id}", response_model=Student)
async def get_student(id: str):
    student = await students_collection.find_one({"_id": ObjectId(id)})
    if student is not None:
        return student_helper(student)
    raise HTTPException(status_code=404, detail="Student not found")

@app.patch("/students/{id}")
async def update_student(id: str, student: Student):
    update_data = {key: value for key, value in student.dict().items() if value is not None}
    result = await students_collection.update_one({"_id": ObjectId(id)}, {"$set": update_data})
    if result.modified_count == 1:
        return {"message": "Student updated successfully"}
    raise HTTPException(status_code=404, detail="Student not found")

@app.delete("/students/{id}")
async def delete_student(id: str):
    result = await students_collection.delete_one({"_id": ObjectId(id)})
    if result.deleted_count == 1:
        return {"message": "Student deleted successfully"}
    raise HTTPException(status_code=404, detail="Student not found")
