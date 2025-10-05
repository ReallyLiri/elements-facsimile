#!/bin/bash

# Get list of directories that have files (excluding empty ones)
DIRS=()
for dir in docs/diagrams/*/; do
    if [ -d "$dir" ] && [ "$(find "$dir" -type f | head -1)" ]; then
        dirname=$(basename "$dir")
        # Skip already committed directories by checking if they're tracked
        if [ "$(git status --porcelain "$dir" 2>/dev/null | grep -v '^??')" = "" ] && [ "$(git status --porcelain "$dir" 2>/dev/null | grep '^??')" != "" ]; then
            DIRS+=("$dirname")
        fi
    fi
done

# Commit each directory
for dir in "${DIRS[@]}"; do
    echo "Processing directory: $dir"
    if [ -d "docs/diagrams/$dir" ]; then
        git add "docs/diagrams/$dir/" && git commit -m "Add diagrams for $dir"
        if [ $? -eq 0 ]; then
            echo "✓ Successfully committed $dir"
            git push
            if [ $? -eq 0 ]; then
                echo "✓ Successfully pushed $dir"
            else
                echo "✗ Failed to push $dir"
                break
            fi
        else
            echo "✗ Failed to commit $dir"
            break
        fi
    else
        echo "⚠ Directory $dir not found"
    fi
done

echo "Done committing directories!"