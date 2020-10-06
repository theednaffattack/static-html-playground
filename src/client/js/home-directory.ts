const directory = [
  {
    href: "connected-particle-text",
    order: 1,
  },
  {
    href: "particle-text",
    order: 2,
  },

  {
    href: "liquid-bubbles",
    order: 3,
  },

  {
    href: "text-animation-basics",
    order: 4,
  },
];

// var cars = "Saab,Volvo,BMW,GMC,Nissan,Ford".split(",");
// for (var c in cars) {
// var newElement = document.createElement("div");
// newElement.id = cars[c];
// newElement.className = "car";
// newElement.innerHTML = cars[c];
// }
// document.body.appendChild(newElement);

// function function1() {
//   var ul = document.getElementById("list");
//   var li = document.createElement("li");
//   li.appendChild(document.createTextNode("Four"));
//   li.setAttribute("id", "element4"); // added line
//   ul.appendChild(li);
//   alert(li.id);
// }

const myUl = document.getElementById("directory-items");

if (myUl) {
  for (const item of directory) {
    const myLi = document.createElement("li");

    const aTag = document.createElement("a");
    aTag.setAttribute("href", item.href);
    aTag.innerText = item.href;

    myLi.appendChild(aTag);
    myUl.appendChild(myLi);
  }
}
