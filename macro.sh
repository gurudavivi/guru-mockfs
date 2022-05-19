#!/bin/bash

clear


for i in {1..5}
do
   ts-node utils/library/src/commits.ts
   sleep 2
   git add .
    git commit -m "step $i"
    git push -f

   echo "Welcome $i times"
   sleep 2

   rm -rf ./data
done

