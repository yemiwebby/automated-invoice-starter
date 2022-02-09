var https = require("https");
var fs = require("fs");

const generateInvoice = (invoice, filename, success, error) => {
  var postData = JSON.stringify(invoice);
  var options = {
    hostname: "invoice-generator.com",
    port: 443,
    path: "/",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Content-Length": Buffer.byteLength(postData),
    },
  };

  var file = fs.createWriteStream(filename);

  var req = https.request(options, function (res) {
    res
      .on("data", function (chunk) {
        file.write(chunk);
      })
      .on("end", function () {
        file.end();

        if (typeof success === "function") {
          success();
        }
      });
  });
  req.write(postData);
  req.end();

  if (typeof error === "function") {
    req.on("error", error);
  }
};

let invoice = {
  logo: "http://invoiced.com/img/logo-invoice.png",
  from: "Invoiced\n701 Brazos St\nAustin, TX 78748",
  to: "Awesome Company / Client",
  currency: "usd",
  number: "INV-0001",
  payment_terms: "Due for payment",
  items: [
    {
      name: "Weekly technical content",
      quantity: 1,
      unit_cost: 500,
    },
    {
      name: "Employee Portal Management",
      quantity: 1,
      unit_cost: 1000,
    },
  ],
  fields: {
    tax: "%",
  },
  tax: 5,
  notes: "Thanks for being an awesome customer!",
  terms: "Looking forward to the payments",
};

generateInvoice(
  invoice,
  "invoice.pdf",
  () => console.log("Saved invoice to invoice.pdf"),
  (err) => console.log(err)
);
