#!/usr/bin/env bash

# This script is used to fix the permissions of the files and directories created by Playwright
# It is necessary to run this script after running the Playwright tests in the Docker container

# Check if ./test-results directory exists, then chown and chmod
if [ -d "./test-results" ]; then
  sudo chown -R "$USER":docker ./test-results
  sudo chmod -R 777 ./test-results
fi

# Check if ./playwright-report directory exists, then chown and chmod
if [ -d "./playwright-report" ]; then
  sudo chown -R "$USER":docker ./playwright-report
  sudo chmod -R 777 ./playwright-report
fi

# Check if ./state.json file exists, then chown and chmod
if [ -f "./state.json" ]; then
  sudo chown "$USER":docker ./state.json
  sudo chmod 777 ./state.json
fi

# Check if ./before-clicking-invoice.png file exists, then chown and chmod
if [ -f "./before-clicking-invoice.png" ]; then
  sudo chown "$USER":docker ./before-clicking-invoice.png
  sudo chmod 777 ./before-clicking-invoice.png
fi

# Check if ./trace.har file exists, then chown and chmod
if [ -f "./trace.har" ]; then
  sudo chown "$USER":docker ./trace.har
  sudo chmod 777 ./trace.har
fi

# Check if ./network_logs.json file exists, then chown and chmod
if [ -f "./network_logs.json" ]; then
  sudo chown "$USER":docker ./network_logs.json
  sudo chmod 777 ./network_logs.json
fi
