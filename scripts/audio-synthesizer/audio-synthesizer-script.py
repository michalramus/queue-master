#!/usr/bin/python3

import os
import sys
import json
import subprocess


def main():
    inputs = json.loads(sys.argv[1])

    categoryShortName = str(inputs["categoryShortName"])
    number = str(inputs["number"])
    seat = str(inputs["seat"])


    textToSay = categoryShortName + number + ", Desk " + seat

    result = subprocess.run(["espeak", textToSay], capture_output=True, text=True)
    print(result.stdout)

if __name__ == "__main__":
    main()
