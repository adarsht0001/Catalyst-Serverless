"use strict";
const catalyst = require("zcatalyst-sdk-node");
const express = require("express");
const bcrypt = require("bcrypt");
const expressApp = express();

const admin = { name: "admin@123", password: "123" };

expressApp.use(express.json());

expressApp.get("/", (req, res) => {
  var app = catalyst.initialize(req);
  res.json("hello");
});

expressApp.post("/admin-login", (req, res) => {
  const { email, password } = req.body;
  if (email === admin.name && password === admin.password) {
    return res.status(200).json("login successful");
  }
  res.status(401).json("Invalid email or Password");
});

expressApp.get("/users", async (req, res) => {
  const adminApp = catalyst.initialize(req, { scope: "admin" });
  let query = "SELECT * FROM users";
  const users = await adminApp.zcql().executeZCQLQuery(query);
  res.status(201).json(users);
});

expressApp.post("/create-user", async (req, res) => {
  const { email, password } = req.body;
  const adminApp = catalyst.initialize(req, { scope: "admin" });
  var searchQuery = {
    search: email,
    search_table_columns: {
      users: ["email"],
    },
  };
  adminApp
    .search()
    .executeSearchQuery(searchQuery)
    .then(async ({ users }) => {
      if (users) {
        return res.status(401).json("Email Already Exist");
      }
      req.body.password = await bcrypt.hash(password, 10);
      const inserted = await adminApp
        .datastore()
        .table("users")
        .insertRow(req.body);
      let mail = adminApp.email();
      let config = {
        from_email: "adarsht00002@gmail.com",
        to_email: ["adarsht00001@gmail.com"],
        subject: "Greetings from Test!",
        content: "welcome to The App,Thanks for joining",
      };
      await mail.sendMail(config);
      return res.status(201).json({ msg: "user created", inserted });
    })
    .catch((err) => {
      console.log(err, "err");
      return res.status(401).json(err.message);
    });
});

expressApp.delete("/user/:id", (req, res) => {
  const adminApp = catalyst.initialize(req, { scope: "admin" });
  const rowPromise = adminApp
    .datastore()
    .table("users")
    .deleteRow(req.params.id);
  rowPromise
    .then(() => {
      return res.status(201).json({ msg: "user deleted" });
    })
    .catch((err) => {
      console.log(err);
    });
});

expressApp.post("/create-ticket", async (req, res) => {
  const adminApp = catalyst.initialize(req, { scope: "admin" });
  try {
    const inserted = await adminApp
      .datastore()
      .table("Tickets")
      .insertRow({ name: req.body.ticket });
    return res.status(201).json({ msg: "ticket created", inserted });
  } catch (error) {
    return res.status(401).json(err.message);
  }
});

expressApp.get("/tickets", async (req, res) => {
  const adminApp = catalyst.initialize(req, { scope: "admin" });
  try {
    let query = "SELECT * FROM Tickets";
    const tickets = await adminApp.zcql().executeZCQLQuery(query);
    res.status(201).json(tickets);
  } catch (error) {
    console.log(error);
    return res.status(401).json(err.message);
  }
});

expressApp.delete("/ticket/:id", (req, res) => {
  const adminApp = catalyst.initialize(req, { scope: "admin" });
  const rowPromise = adminApp
    .datastore()
    .table("Tickets")
    .deleteRow(req.params.id);
  rowPromise
    .then(() => {
      return res.status(201).json({ msg: "ticket deleted" });
    })
    .catch((err) => {
      console.log(err);
      return res.status(401).json(err.message);
    });
});

expressApp.get("/unused-ticket", async (req, res) => {
  try {
    const userApp = catalyst.initialize(req, { scope: "admin" });
    let query = "SELECT * FROM Tickets WHERE status = false";
    const tickets = await userApp.zcql().executeZCQLQuery(query);
    res.status(201).json(tickets);
  } catch (error) {
    console.log(error);
    return res.status(401).json(err.message);
  }
});

expressApp.put("/add-ticket", async (req, res) => {
  const { ticketId, userId } = req.body;
  const userApp = catalyst.initialize(req, { scope: "admin" });
  const table = userApp.datastore().table("users");
  const user = await table.getRow(userId);
  const ticket = await userApp.datastore().table("Tickets").getRow(ticketId);

  ticket.status = true;
  user.Tickets = ticketId;
  let mail = userApp.email();
  let config = {
    from_email: "adarsht00002@gmail.com",
    to_email: ["adarsht00001@gmail.com"],
    subject: "Ticket Assiged!",
    content: "New Ticket assigned",
  };
  await mail.sendMail(config);
  table
    .updateRow(user)
    .then(async (response) => {
      console.log(response);
      await userApp.datastore().table("Tickets").updateRow(ticket);
      return res.status(201).json({ msg: "ticket assigned" });
    })
    .catch((err) => {
      console.log(err);
      return res.status(401).json(err.message);
    });
});

expressApp.post("/user-login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const userApp = catalyst.initialize(req, { scope: "admin" });
    let query = `SELECT * FROM users WHERE email = '${email}'`;
    const users = await userApp.zcql().executeZCQLQuery(query);
    if (users) {
      const user = users[0].users;
      const valid = await bcrypt.compare(password, user.password);
      if (valid) {
        return res
          .status(200)
          .json({ msg: "login successful", id: user.ROWID });
      } else {
        res.status(401).json("Incorrect password");
      }
    }
    res.status(401).json("user doesn't Exist");
  } catch (error) {
    console.log(error);
    return res.status(401).json(error.message);
  }
});

expressApp.get("/assigned-ticket/:id", async (req, res) => {
  const userRowID = req.params.id;
  const userApp = catalyst.initialize(req, { scope: "admin" });
  try {
    const user = await userApp.datastore().table("users").getRow(userRowID);
    if (user.Tickets) {
      const ticket = await userApp
        .datastore()
        .table("Tickets")
        .getRow(user.Tickets);
      return res.status(200).json({ ticket: ticket, status: true });
    }
    return res.status(200).json({ msg: "no tickets assigned", status: false });
  } catch (error) {
    console.log(error);
    return res.status(401).json(error.message);
  }
});

expressApp.post("/reset-password", async (req, res) => {
  const { userId, password } = req.body;
  const userApp = catalyst.initialize(req, { scope: "admin" });

  const hash = await bcrypt.hash(password, 10);
  try {
    let query = `UPDATE users SET password='${hash}' WHERE ROWID = '${userId}'`;
    const users = await userApp.zcql().executeZCQLQuery(query);
    res.status(200).json("password reset");
    console.log(users);
  } catch (error) {
    console.log(error);
    return res.status(401).json(error.message);
  }
});

module.exports = expressApp;
