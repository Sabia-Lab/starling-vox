from contextlib import asynccontextmanager
from fastapi import FastAPI, UploadFile, File, HTTPException, Request
from motor.motor_asyncio import AsyncIOMotorClient
from pymongo.errors import PyMongoError
from pathlib import Path
import shutil
import uvicorn


from course_data_processor import parse_and_convert_course_evaluation

BASE_DIR = Path(__file__).resolve().parent
DATA_DIR = BASE_DIR / "data"
DATA_DIR.mkdir(exist_ok=True)

MONGODB_URL = "mongodb://localhost:27017"
DATABASE_NAME = "course_db"
COLLECTION_NAME = "parsed_files"
ALLOWED_EXTENSIONS = {".xlsx"}


@asynccontextmanager
async def lifespan(app: FastAPI):
    client = AsyncIOMotorClient(MONGODB_URL, serverSelectionTimeoutMS=2000)
    app.state.mongo_client = client
    app.state.collection = client[DATABASE_NAME][COLLECTION_NAME]

    try:
        yield
    finally:
        client.close()


app = FastAPI(lifespan=lifespan)


def safe_file_name(name: str | None) -> str:
    if not name:
        raise HTTPException(status_code=400, detail="File name is required")

    file_name = Path(name).name
    if file_name != name or Path(file_name).suffix.lower() not in ALLOWED_EXTENSIONS:
        raise HTTPException(status_code=400, detail="Invalid file name")

    return file_name


def get_file_path(name: str) -> Path:
    return DATA_DIR / safe_file_name(name)


def serialize_document(document):
    return {
        "id": str(document["_id"]),
        "fileName": document["fileName"],
        "data": document["data"],
    }


@app.get("/files/{name}")
async def get_file_by_name(request: Request, name: str):
    file_name = safe_file_name(name)

    try:
        document = await request.app.state.collection.find_one(
            {"fileName": file_name},
            sort=[("_id", -1)],
        )
    except PyMongoError as exc:
        raise HTTPException(status_code=503, detail="MongoDB is unavailable") from exc

    if not document:
        raise HTTPException(status_code=404, detail="Parsed file not found")

    return serialize_document(document)


@app.post("/files/{name}/parse")
async def parse_file_by_name(request: Request, name: str):
    file_name = safe_file_name(name)
    file_path = get_file_path(file_name)

    if not file_path.exists():
        raise HTTPException(status_code=404, detail="File not found in backend/data")

    parsed_json = parse_and_convert_course_evaluation(str(file_path))
    document = {
        "fileName": file_name,
        "data": parsed_json,
    }

    try:
        result = await request.app.state.collection.insert_one(document)
    except PyMongoError as exc:
        raise HTTPException(status_code=503, detail="MongoDB is unavailable") from exc

    return {
        "id": str(result.inserted_id),
        "fileName": file_name,
        "data": parsed_json,
    }


@app.post("/files/upload")
async def upload_and_convert_file(request: Request, file: UploadFile = File(...)):
    file_name = safe_file_name(file.filename)
    file_path = get_file_path(file_name)

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    parsed_json = parse_and_convert_course_evaluation(str(file_path))

    document = {
        "fileName": file_name,
        "data": parsed_json,
    }

    try:
        result = await request.app.state.collection.insert_one(document)
    except PyMongoError as exc:
        raise HTTPException(status_code=503, detail="MongoDB is unavailable") from exc

    return {
        "id": str(result.inserted_id),
        "fileName": file_name,
        "data": parsed_json,
    }


if __name__ == "__main__":
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
