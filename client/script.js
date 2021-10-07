async function getConditions() {
  try {
    await fetch("http://localhost:5000/conditions", {
      //http://localhost:5000
      method: "GET",
      headers: { "Content-Type": "application/json" },
      //body: JSON.stringify({ string: stringa }),
    }).then(async (response) => {
      const jsonData = await response.json();

      let condition1 = document
        .querySelector(".condition1")
        .querySelectorAll("td");
      condition1[0].innerText = jsonData[0].condition_id;
      condition1[1].innerText = jsonData[0].type;
      condition1[2].innerText = jsonData[0].value;

      let condition2 = document
        .querySelector(".condition2")
        .querySelectorAll("td");
      condition2[0].innerText = jsonData[1].condition_id;
      condition2[1].innerText = jsonData[1].type;
      condition2[2].innerText = jsonData[1].value;
    });
  } catch (err) {
    console.error(err.message);
  }
}
getConditions();

async function getDeals() {
  try {
    await fetch("http://localhost:5000/deals", {
      //http://localhost:5000
      method: "GET",
      headers: { "Content-Type": "application/json" },
    }).then(async (response) => {
      const jsonData = await response.json();
      console.log(jsonData);

      jsonData
        .slice()
        .reverse()
        .forEach((el) => {
          // Instantiate the table with the existing HTML tbody
          // and the row with the template
          var tbody = document.querySelector(".deals");
          var template = document.querySelector("#dealrow");

          // Clone the new row and insert it into the table
          var clone = template.content.cloneNode(true);
          var td = clone.querySelectorAll("td");
          td[0].textContent = el.deal_id;
          td[1].querySelector("a").textContent = el.title;
          td[1].querySelector("a").href = el.link;
          td[2].textContent = el.pubdate;

          tbody.appendChild(clone);
        });
    });
  } catch (err) {
    console.error(err.message);
  }
}
getDeals();
