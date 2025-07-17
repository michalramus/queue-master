#!/usr/bin/python3

import os
import pymupdf
import sys
import json
import cups
import datetime
from tempfile import gettempdir
import time

printerName = "printerName"  # Printer name provided by cups - check ReadMe
printerOptions = {
    # 'media': 'A4'
}

# Define custom paper size that pdf will be generated with
customWidth = 58  # in mm
customHeight = 70  # in mm

pdfMargins = (0, -13, 0, 0)  # Margins (left, top, right, bottom)

ticketPDFPath = os.path.join(
    gettempdir(), "ticket.pdf"
)  # Use temp directory, because file is not cleaned up after printing

disablePrint = False  # useful for debugging


def generatePDF(HTML: str):
    story = pymupdf.Story(html=HTML)
    writer = pymupdf.DocumentWriter(ticketPDFPath)

    mediabox = pymupdf.Rect(
        0, 0, customWidth * 2.83465, customHeight * 2.83465
    )  # 1 mm = 2.83465 points

    # Use predefined paper sizes
    # mediabox = pymupdf.paper_rect("a4")

    where = mediabox + pdfMargins

    # Write to the PDF file
    more = True
    while more:  # write on one or more PDF pages as required
        dev = writer.begin_page(mediabox)  # tell the writer our page size
        more, filled = story.place(where)  # compute layout
        story.draw(dev)  # write to the page
        writer.end_page()  # finish page
    writer.close()  # close the writer


def printPDF():
    conn = cups.Connection()

    print_job_id = conn.printFile(printerName, ticketPDFPath, "Ticket", printerOptions)
    print(f"Print job sent, Job ID: {print_job_id}")


def main():

    inputs = json.loads(sys.argv[1])

    HTML = (
        inputs["template"]
        .replace("&categoryShortName", str(inputs["categoryShortName"]))
        .replace("&number", str(inputs["number"]))
        .replace("&date", str(datetime.datetime.now().strftime("%Y-%m-%d")))
        .replace("&time", str(datetime.datetime.now().strftime("%H:%M:%S")))
    )

    generatePDF(HTML)

    if not disablePrint:
        printPDF()

        time.sleep(5) #Wait to ensure the print job is processed
        os.remove(ticketPDFPath)
    else:
        print("PDF path: ", ticketPDFPath)


if __name__ == "__main__":
    main()
