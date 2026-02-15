#!/usr/bin/env bash

OUTPUT="chat_context.txt"
CONFIG_FILE="scripts/chat-files.txt"

rm -f "$OUTPUT"

echo "===== PROJECT CONTEXT =====" >> "$OUTPUT"
echo "Generated on: $(date)" >> "$OUTPUT"
echo "" >> "$OUTPUT"

if [ ! -f "$CONFIG_FILE" ]; then
  echo "❌ Missing $CONFIG_FILE"
  exit 1
fi

CURRENT_SECTION=""

while IFS= read -r line; do
  # Skip comments and empty lines
  [[ -z "$line" || "$line" =~ ^# ]] && continue

  # Section header
  if [[ "$line" =~ ^\[(.*)\]$ ]]; then
    CURRENT_SECTION="${BASH_REMATCH[1]}"
    echo "" >> "$OUTPUT"
    echo "===== $CURRENT_SECTION =====" >> "$OUTPUT"
    echo "" >> "$OUTPUT"
    continue
  fi

  # File
  if [ -f "$line" ]; then
    echo "--- $line ---" >> "$OUTPUT"
    sed 's/^/    /' "$line" >> "$OUTPUT"
    echo "" >> "$OUTPUT"
  else
    echo "⚠️ File not found: $line" >> "$OUTPUT"
    echo "" >> "$OUTPUT"
  fi

done < "$CONFIG_FILE"

echo "===== END =====" >> "$OUTPUT"

echo "✅ Context file generated: $OUTPUT"
