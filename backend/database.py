from motor.motor_asyncio import AsyncIOMotorClient

try:
    # Replace this with your actual MongoDB Atlas connection string
    MONGODB_URL = "mongodb+srv://rachit:rachit@backend.rp1fx.mongodb.net/?retryWrites=true&w=majority&appName=Backend"
    
    client = AsyncIOMotorClient(MONGODB_URL)
    db = client.student_management  # your database name
    students_collection = db.students
    
    # Test the connection
    client.admin.command('ping')
    print("Successfully connected to MongoDB!")
    
except Exception as e:
    print(f"Error connecting to MongoDB: {e}")
    raise
