import os
import pymupdf
import sys
import json
import cups
from tempfile import gettempdir
import subprocess


#TODO use RHVoice instead of espeak
def main():

    inputs = json.loads(sys.argv[1])

    categoryShortName = str(inputs["categoryShortName"])
    number = str(inputs["number"])
    seat = str(inputs["seat"])


    textToSay = categoryShortName + number + " Seat " + seat

    result = subprocess.run(["espeak", textToSay], capture_output=True, text=True)
    print(result.stdout)




if __name__ == "__main__":
    main()
