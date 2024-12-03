# Student Management System

A full-stack web application for managing student records with CRUD operations.

## Features

- Create new student records
- Read/View all students with filtering options
- Update existing student information
- Delete student records
- Filter students by country and age
- Responsive UI design

## Tech Stack

### Backend
- FastAPI (Python web framework)
- MongoDB (Database)
- Motor (Async MongoDB driver)
- Pydantic (Data validation)

### Frontend
- HTML5
- CSS3
- JavaScript (Vanilla)

## API Endpoints

- `GET /` - Welcome message
- `GET /students` - List all students (with optional filters)
- `POST /students` - Create a new student
- `GET /students/{id}` - Get specific student details
- `PATCH /students/{id}` - Update student information
- `DELETE /students/{id}` - Delete a student

## Setup and Installation

### Prerequisites
- Python 3.7+
- MongoDB
- Web browser

### Backend Setup
1. Clone the repository
