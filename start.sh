#!/bin/sh
cd /app && node backend/index.js &
cd /app/project/backend && python3 -u main.py &
wait
