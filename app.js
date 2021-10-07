let Parser = require("rss-parser");
let parser = new Parser();

const pool = require("./db");

async () => {
  let feed = await parser.parseURL("https://www.secretflying.com/feed/");

  feed.items.forEach((item) => {
    if (
      item.title.includes("🔥") &&
      item.categories.includes("Depart Mainland Europe")
    ) {
      let guid = item.guid.split("p=")[1];
      console.log(guid);
      console.log(item.title + "\n" + item.link);
    }
  });
};

(async () => {
  //get conditions from DB
  let conditionsDb = await pool.query("SELECT * FROM conditions");
  let conditions = conditionsDb.rows;
  let num = conditionsDb.rows.length;

  //get deals from DB
  let dealsDb = await pool.query("SELECT * FROM deals");
  let deals = dealsDb.rows;

  console.error(conditions, num);

  //get feed
  let feed = await parser.parseURL("https://www.secretflying.com/feed/");

  //evaluate feed items
  feed.items.forEach((item) => {
    let checkSum = 0;
    conditions.forEach((cond) => {
      if (cond.type === "category") {
        if (item.categories.includes(cond.value)) {
          checkSum++;
        }
      }
      if (cond.type === "title") {
        if (item.title.includes(cond.value)) {
          checkSum++;
        }
      }

      //check if there was a match on all conditions:
      if (checkSum === num) {
        let guid = item.guid.split("p=")[1];
        console.log("MATCH:\n" + item.title + "\n" + item.link + "\n" + guid);

        //check if match already exists in "Deals" db
        let dealFoundInDB = 0;
        deals.forEach((deal) => {
          if (deal.deal_id === guid) {
            dealFoundInDB++;
            console.log("Deal found - duplicate");
          }
        });

        //add deal to "Deals" DB if not found
        if (dealFoundInDB === 0) {
          console.log("Adding a newfound deal");
          (async () => {
            let newCondition = await pool.query(
              "INSERT INTO deals (deal_id, title, link, pubdate) VALUES($1, $2, $3, $4) RETURNING *",
              [guid, item.title, item.link, item.pubDate]
            );
          })();
        }
      }
    });
  });
})();
