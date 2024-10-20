#!/bin/bash

# Directory containing the original manifests
MANIFESTS_DIR="./manifests"

# Directory to store Linkerd-injected manifests
LINKERD_MANIFESTS_DIR="./linkerd-manifests"

# Create the directory for Linkerd-injected manifests if it doesn't exist
mkdir -p "$LINKERD_MANIFESTS_DIR"

# Loop through all YAML files in the manifests directory
for file in "$MANIFESTS_DIR"/*.yaml; do
    # Get the filename without the path
    filename=$(basename "$file")
    
    # Inject Linkerd into the manifest
    linkerd inject "$file" > "$LINKERD_MANIFESTS_DIR/$filename"
    
    echo "Injected Linkerd into $filename"
done

echo "Linkerd injection complete. Injected manifests are in $LINKERD_MANIFESTS_DIR"
