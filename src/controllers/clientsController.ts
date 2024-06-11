import express, { Express, Request, Response } from "express";

//DATABASE---------------------
let counter = 0;

interface Number {
  number: number;
  category: string;
  status: string;
}

let numbers: Array<Number> = [];
//--------------------------

export const addClient = (req: Request, res: Response) => {
  if (req.body.category == undefined) {
    res.status(400).send("Incorrect category");
    return;
  }

  counter = counter + 1;
  let number: Number = {
    number: counter,
    category: req.body.category,
    status: "Waiting",
  };

  numbers.push(number);

  res.json(number);
};
