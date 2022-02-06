const express = require('express');
const randomId = require('random-id');
const app = express(),
      bodyParser = require("body-parser");
      port = 3070;

// place holder for the data
// leave this const alone for now
const users = [
  {
    id: "1",
    firstName: "first1",
    lastName: "last1",
    email: "abc@gmail.com"
  },
  {
    id: "2",
    firstName: "first2",
    lastName: "last2",
    email: "abc@gmail.com"
  },
  {
    id: "3",
    firstName: "first3",
    lastName: "last3",
    email: "abc@gmail.com"
  }
];

// leave this alone; default users data will be deleted later
app.use(bodyParser.json());
app.use(express.static(process.cwd() + '/my-app/dist'));

app.get('/api/users', (req, res) => {
  console.log('api/users called')
  res.json(users);
});

app.post('/api/user', (req, res) => {
  const user = req.body.user;
  user.id = randomId(10);
  console.log('Adding user:::::', user);
  users.push(user);
  res.json("user addedd");
});

// placeholder for factory tools
const tools = [
  {
    bin: "MFG133A",
    customer: "TSMC",
    type: "Sabre 3D",
    sn: "001"
  },
  {
    bin: "MFG134B",
    customer: "Intel",
    type: "Gamma XPR",
    sn: "335"
  }
];

app.get('/api/tools', (req, res) => {
  console.log('api/tools called')
  res.json(tools);
});

// placeholder for error reports

const reports = [
  {
    bin: "MFG133A",
    fault: "Sample fault report.",
    status: "Review Required",
    dateAdded: "2021-11-20"
  }
]

app.get('/api/reports', (req, res) => {
  console.log('api/reports called')
  res.json(reports);
});

app.post('/api/reports', (req, res) => {
  const report = req.body.report;
  console.log('Adding report: ', report);
  try {
    reports.push(report);
    res.json("success");
  }
  catch (error) {
    console.log("Error in /api/reports: ", error)
    res.json("error")
  }

});

// placeholder for directions

const directions = [
  {
    bin: "MFG133A",
    directions: ["Step 1", "Step 2"]
  },
  {
    bin: "MFG134B",
    directions: ["Step 1", "Step 2"]
  }
]

app.put('/api/directions', (req, res) => {
  console.log('api/directions called PUT')
  let bin = req.body
  console.log("checking bin", bin);
  let result = directions.find(x => x.bin == bin.report.bin)
  console.log("Result: ", result);

  // return message is directions for a BIN aren't found
  if (result == undefined ) {
    console.log(`Unable to find tool directions for: ${req.body.report}`)
    result = { bin: `${req.body.report}`, directions: "Unable to find tool directions!", status: "401"}
    res.json(result)
  }

  // add a status code to compare later
  else {
    result.directions[req.body.report.step] = req.body.report.directions
    result.status = "200"
    res.json(result);

  }
});

app.post('/api/directions', (req, res) => {
  console.log('api/directions called POST')
  let bin = req.body
  let result = directions.find(x => x.bin == bin.report)
  console.log("Result: ", result);

  // return message is directions for a BIN aren't found
  if (result == undefined ) {
    console.log(`Unable to find tool directions for: ${req.body.report}`)
    result = { bin: `${req.body.report}`, directions: "Unable to find tool directions!", status: "401"}
    res.json(result)
  }

  // add a status code to compare later
  else {
    result.status = "200"
    res.json(result);

  }
});

// required binders for server; leave alone
app.get('/', (req,res) => {
  res.sendFile(process.cwd() + '/my-app/dist/index.html');
});

app.listen(port, () => {
    console.log(`Server listening on the port::${port}`);
});
