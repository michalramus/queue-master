import express, { Express, Request, Response } from "express";

import { io } from "../io";

//DATABASE---------------------
let counter = 0;

interface ClientNumber {
    number: number;
    category: string;
    status: string;
    creationDate: string;
    seat: number | undefined;
}

let numbers: Array<ClientNumber> = [];
//--------------------------
export function addClient(req: Request, res: Response) {
    if (req.body.category == undefined) {
        res.status(400).send("Incorrect category");
        return;
    }

    counter = counter + 1;
    let date = new Date();
    // let dateString = date.toLocaleDateString('pl-PL') + "\n" + date.toLocaleTimeString('en-EN', { hour12: false });
    let dateString = date.toLocaleTimeString('en-EN', { hour12: false });
    
    let number: ClientNumber = {
        number: counter,
        category: req.body.category,
        status: "Waiting",
        seat: undefined,
        creationDate: dateString,
    };

    numbers.push(number);
    io.emit("newClient", number);

    res.json(number);
}

export function getClients(req: Request, res: Response) {
    res.json(numbers);
}

export function setClientAsInService(req: Request, res: Response) {
    let client: ClientNumber = req.body;

    // let index = numbers.findIndex((n) => n.number == client.number);
    const index = numbers.map((e) => e.number).indexOf(client.number);

    if (index == -1) {
        res.status(404).send("Client not found");
        return;
    }

    numbers.splice(index, 1);
    io.emit("clientInService", client);
    res.json(client);
}
