#!/bin/bash
zip -r -FS ../my-extension.zip * --exclude '*.git*' --exclude "packme.sh" --exclude "*.DS_Store*"
