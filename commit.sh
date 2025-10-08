#!/bin/bash

# First, handle PDF files in batches
PDF_FILES=($(git status --porcelain docs/*.pdf 2>/dev/null | grep '^??' | cut -c4-))
if [ ${#PDF_FILES[@]} -gt 0 ]; then
    echo "Found ${#PDF_FILES[@]} new PDF files to commit in batches"
    BATCH_SIZE=10
    TOTAL_BATCHES=$(( (${#PDF_FILES[@]} + BATCH_SIZE - 1) / BATCH_SIZE ))

    for ((i=0; i<${#PDF_FILES[@]}; i+=BATCH_SIZE)); do
        BATCH_NUM=$(( i/BATCH_SIZE + 1 ))
        BATCH_FILES=("${PDF_FILES[@]:i:BATCH_SIZE}")

        echo "Processing PDF batch $BATCH_NUM/$TOTAL_BATCHES (${#BATCH_FILES[@]} files)"
        git add "${BATCH_FILES[@]}" && git commit -m "Added pdfs (#$BATCH_NUM/#$TOTAL_BATCHES)"
        if [ $? -eq 0 ]; then
            echo "✓ Successfully committed PDF batch $BATCH_NUM"
            git push
            if [ $? -eq 0 ]; then
                echo "✓ Successfully pushed PDF batch $BATCH_NUM"
            else
                echo "✗ Failed to push PDF batch $BATCH_NUM"
                break
            fi
        else
            echo "✗ Failed to commit PDF batch $BATCH_NUM"
            break
        fi
    done
    echo "Done committing PDF files!"
fi

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