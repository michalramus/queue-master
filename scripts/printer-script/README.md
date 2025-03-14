# Example scripts that can be used to print the tickets

Example script call: ```python3 <print_tickets.py> '{"categoryShortName": string, "number": number, template: string}'```

```template``` is fetched from the server and it could be used to print the ticket.

```printingScriptAddPythonPrefix``` - if false then ```python3``` prefix will be skipped and it will be possible to call binary programs instead of using python. Can be set in kiosk app config

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

### Useful cups commands

- ```lpstat -a``` List installed printers
- ```lpinfo -v``` List available printers
- ```lpoptions -d <printer> -l``` List options of specified printer
