#!/bin/bash

# Check if the correct number of arguments is provided
if [ "$#" -ne 3 ]; then
    echo "Usage: $0 <project-name> <suffix: da|sonnet|none> <status: preedit|postedit|rewrite>"
    exit 1
fi

# Capture the project name, suffix, and status from the arguments
PROJECT_NAME=$1
SUFFIX=$2
STATUS=$3

# Validate the suffix
if [[ "$SUFFIX" != "da" && "$SUFFIX" != "sonnet" && "$SUFFIX" != "none" ]]; then
    echo "Error: Suffix must be 'da', 'sonnet', or 'none'"
    exit 1
fi

# Validate the status
if [[ "$STATUS" != "preedit" && "$STATUS" != "postedit" && "$STATUS" != "rewrite" ]]; then
    echo "Error: Status must be 'preedit', 'postedit', or 'rewrite'"
    exit 1
fi

# Determine the zip file name
if [ "$SUFFIX" = "none" ]; then
    ZIP_FILE="${PROJECT_NAME}_${STATUS}.zip"
else
    ZIP_FILE="${PROJECT_NAME}_${SUFFIX}_${STATUS}.zip"
fi

# Define directories and files to exclude
EXCLUDES=(
  "*.log"
  "*.tmp"
  "*.temp"
  "*.zip"
  ".venv/*"
  ".env/*"
  ".git/*"
  "__MACOSX/*"
  ".DS_Store"
  "node_modules/*"
  "packages/*"
  "vendor/*"
  ".next/*"
  ".cache/*"
  "dist/*"
  "build/*"
  "out/*"
  ".vscode/*"
  ".idea/*"
)

# Create the zip file excluding specified files and directories
zip -r "$ZIP_FILE" . -x "${EXCLUDES[@]}"

echo "Created $ZIP_FILE excluding specified files and directories."