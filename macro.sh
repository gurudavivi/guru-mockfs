#!/bin/bash

clear


for i in {1..100}
do
    ts-node utils/library/src/commits.ts
    sleep 2

    echo "  "
    git add .
    git commit -m "step $i"
    echo "  "
    sleep 1


    echo "  "
    git push -f
    sleep 1

    echo "  "
    echo "  "
    echo "Welcome $i times"
    echo "  "
    echo "  "
    sleep 2

    rm -rf ./data
    sleep 2
done

