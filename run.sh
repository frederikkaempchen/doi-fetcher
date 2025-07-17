#!/bin/bash

rm -f .input.txt.swp 2>/dev/null   # removes any swap/lock nano files and silences error msgs
nano input.txt                     # Opens the input editor
node fetch-dois.js                 # Runs the fetch script

echo "" > input.txt                # clears the input file after usage