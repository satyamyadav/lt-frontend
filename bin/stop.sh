#!/bin/bash

if [ !$NODE_LAUNCH_SCRIPT ]; then
  export NODE_LAUNCH_SCRIPT="$PWD/main.js"
fi

forever stop $NODE_LAUNCH_SCRIPT
