# Base image
FROM python:3.9-slim

# Set the working directory
WORKDIR /app

# Copy the requirements file
COPY requirements.txt .

# Install the project dependencies
RUN pip install -r requirements.txt

# Copy the project files to the working directory
COPY . .

# Expose the port on which the application will run (8000 in this case)
EXPOSE 8000

# Command to run the application
CMD ["uvicorn", "Data_Preprocess:app", "--host", "0.0.0.0", "--port", "8000"]
