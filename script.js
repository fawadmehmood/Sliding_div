const tbody = document.getElementById("tbody");

const tableRows = Array.from(document.getElementsByClassName("row"));
const btn = document.querySelector(".btn");

const calculateClamp = (
  elem,
  minWidth,
  minFontSize,
  maxWidth,
  maxFontSize,
  fontTag
) => {
  const slope = (maxFontSize - minFontSize) / (maxWidth - minWidth);
  const yAxisIntersection = (-minWidth * slope + minFontSize).toFixed(4);
  const preferredValue = `${yAxisIntersection}rem + ${(slope * 100).toFixed(
    4
  )}vw`;
  console.log(fontTag);
  elem.innerText = `${fontTag} {font-size: clamp(${minFontSize}rem, ${preferredValue}, ${maxFontSize}rem);}`;
};

const iterateRows = (selects, outputElem, fontTag) => {
  let values = [];
  selects.forEach((select) => {
    const siblingInputVal = Number(
      select.parentElement.previousElementSibling.value
    );
    select.value === "px"
      ? values.push(siblingInputVal / 16)
      : values.push(siblingInputVal);
  });
  const [minWidth, minFontSize, maxWidth, maxFontSize] = values;
  calculateClamp(
    outputElem,
    minWidth,
    minFontSize,
    maxWidth,
    maxFontSize,
    fontTag
  );
};

tableRows.forEach((row) => {
  const fontTag = row.firstElementChild.innerText;
  const outputElem = row.querySelector("#pre");
  const selects = Array.from(row.querySelectorAll("select"));
  iterateRows(selects, outputElem, fontTag);
});

tbody.addEventListener("change", (e) => {
  if (e.target.tagName === "SELECT") {
    let siblingInputVal = e.target.parentElement.previousElementSibling.value;
    let font =
      e.target.parentElement.parentElement.parentElement.lastElementChild
        .firstElementChild;

    console.log(font);

    const targetVal = e.target.value;

    targetVal === "px"
      ? (e.target.parentElement.previousElementSibling.value =
          siblingInputVal * 16)
      : (e.target.parentElement.previousElementSibling.value =
          siblingInputVal / 16);
  }
});

tbody.addEventListener("input", (e) => {
  if (e.target.tagName === "INPUT") {
    const tableCellElement = e.target.parentElement;
    const tableRowElement = tableCellElement.parentElement;

    const fontTag = tableRowElement.firstElementChild.innerText;

    const tableCellSelects = tableRowElement.querySelectorAll("select");
    const outputElem = tableRowElement.querySelector("#pre");

    iterateRows(tableCellSelects, outputElem, fontTag);
  }
});
console.log(btn);

btn.addEventListener("click", async (e) => {
  const snackbar = document.getElementById("snackbar");
  const text =
    e.target.parentElement.previousElementSibling.firstElementChild.innerText;
  try {
    await navigator.clipboard.writeText(text);
    snackbar.className = "show";
    setTimeout(function () {
      snackbar.className = snackbar.className.replace("show", "");
    }, 2000);
    console.log("Content copied to clipboard");
  } catch (err) {
    console.error("Failed to copy: ", err);
  }
});
