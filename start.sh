#!/bin/bash

# Start MongoDB if not running
if ! pgrep -x "mongod" > /dev/null; then
  echo "Starting MongoDB..."
  mongod --fork --logpath /var/log/mongodb.log
fi

# Start backend server
cd backend
npm install
PORT=12001 npm run dev &
echo "Backend server started on port 12001"

# Start socket server
cd ../socket
npm install
npm run dev &
echo "Socket server started on port 4000"

# Start frontend
cd ../frontend
npm install
PORT=12000 npm start &
echo "Frontend started on port 12000"

# Keep script running
wait