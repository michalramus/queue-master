# Example scripts that can be used to print the tickets

Example script call: ```cups-printer-script.py '{"categoryShortName": string, "number": number, queueLength: string,  template: string}'```

```template``` is fetched from the server and it could be used to print the ticket.
```queueLength```Count of tickets waiting with the same category as created ticket

## cups-printer-script.py

### Script configuration

- ```customWidth``` and ```customHeight``` - Pdf that will be generated will have this width and height
- ```pdfMargins``` - Margins of the pdf
- ```disablePrinting``` - If true then pdf will be generated but not printed. Path to the pdf will be printed in the console
- ```printerName``` - Name of the printer that will be used to print the pdf. Refer to the [Useful cups commands](#useful-cups-commands) section for more information.
- ```printerOptions``` - Options that will be used to print the pdf. Refer to the [Useful cups commands](#useful-cups-commands) section for more information.

### Variables that can be used in the template

These variables will be replaced with the actual values from the json. Check example template

- ```&categoryShortName``` - categoryShortName from json
- ```&number``` - number from json
- ```&queueLength``` - count of tickets waiting with the same category as created ticket
- ```&date``` - current date in format YYYY-MM-DD
- ```&time``` - current time in format HH:MM:SS

### Useful cups commands

- ```lpstat -a``` List installed printers
- ```lpinfo -v``` List available printers
- ```lpoptions -d <printer> -l``` List options of specified printer
