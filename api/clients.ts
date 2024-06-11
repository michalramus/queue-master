interface ClientNumber {
  number: number;
  category: string;
  status: string;
}

const apiPath = "/clients";

export function addClient(category: string): ClientNumber {
  let res: ClientNumber = {} as ClientNumber;

  fetch(process.env.API + apiPath, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },

    body: JSON.stringify({ category: category }),
  })
    .then((response) => response.json())
    .then((data) => {
      res.number = data.number;
      res.category = data.category;
      res.status = data.status;
    })
    .catch((error) => console.log(error));

  return res;
}
