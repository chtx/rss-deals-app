const express = require("express");
const app = express();
const cors = require("cors");
//const converter = require("./converter"); //swap this to
const pool = require("./db");
const PORT = process.env.PORT || 5000;
const path = require("path");

// middleware
app.use(cors());
app.use(express.json());

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "client/")));
}

//ROUTES//

// What I need are: 1. create condition, 2. get all conditions (to display them), 3. delete condition

//create a condition

app.post("/conditions", async (req, res) => {
  try {
    const { type } = req.body;
    const { value } = req.body;
    const newCondition = await pool.query(
      "INSERT INTO conditions (type, value) VALUES($1, $2) RETURNING *",
      [type, value]
    );

    res.json(newCondition.rows[0]);
  } catch (err) {
    console.error(err.message);
  }
});

//get all conditions

app.get("/conditions", async (req, res) => {
  try {
    const allConditions = await pool.query("SELECT * FROM conditions");
    res.json(allConditions.rows);
  } catch (err) {
    console.error(err.message);
  }
});

//get a specific condition

app.get("/conditions/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const condition = await pool.query(
      "SELECT * FROM conditions WHERE condition_id = $1",
      [id]
    );

    res.json(condition.rows[0]);
  } catch (err) {
    console.error(err.message);
  }
});

//update a condition -- Prolly don't need it for now - but it's written to work (tested)

app.put("/conditions/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { type } = req.body;
    const { value } = req.body;

    const updateCondition = await pool.query(
      "UPDATE conditions SET type = $1, value = $2 WHERE condition_id = $3",
      [type, value, id]
    );

    res.json("Todo was updated");
  } catch (err) {
    console.error(err.message);
  }
});

//delete a condition

app.delete("/conditions/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deleteCondition = await pool.query(
      "DELETE FROM conditions WHERE condition_id = $1",
      [id]
    );

    res.json("Todo was deleted.");
  } catch (error) {
    console.error(err.message);
  }
});

//"DEALS" ROUTES

//get all deals

app.get("/deals", async (req, res) => {
  try {
    const allDeals = await pool.query("SELECT * FROM deals");
    res.json(allDeals.rows);
  } catch (err) {
    console.error(err.message);
  }
});

//delete a deal

app.delete("/deals/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deleteDeal = await pool.query(
      "DELETE FROM deals WHERE deal_id = $1",
      [id]
    );

    res.json("Deal was deleted.");
  } catch (error) {
    console.error(err.message);
  }
});

//FINISH DEALS ROUTES

app.listen(PORT, () => {
  console.log(`server has started on port ${PORT}`);
});
