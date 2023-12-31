let dragged;

let calfunc = {
  "+": ([a, b]) => { return +a + +b },
  "-": ([a, b]) => { return +a - +b },
  "*": ([a, b]) => { return +a * +b },
  "/": ([a, b]) => { return +a / +b },
  "NAND": ([a, b]) => { return (!(a==="true" && b==="true")).toString() },
  "NOT": ([a]) => { return (!(a==="true")).toString() },
}

var addnum = (event, value) => {
  const newDiv = document.createElement('div');
  newDiv.className = 'jagenbox draggable';
  newDiv.setAttribute('draggable', 'true');

  const paragraph = document.createElement('p');
  paragraph.className = 'num';
  paragraph.textContent = value;

  newDiv.appendChild(paragraph);

  canvas.appendChild(newDiv);

  newDiv.addEventListener("drag", (event) => {
    console.log("dragging");
  });

  newDiv.addEventListener("dragstart", (event) => {
    // store a ref. on the dragged elem
    dragged = event.target;
    // make it half transparent
    event.target.classList.add("dragging");
  });

  newDiv.addEventListener("dragend", (event) => {
    // reset the transparency
    event.target.classList.remove("dragging");
  });
}

var addopr = (event, opr, testparam=true) => {
  a = document.createElement("div");
  a.className = "deokenbox draggable "+opr;
  a.setAttribute('draggable', 'true');
  if (testparam) {
    b = document.createElement("div");
    b.className = "dropzone";
  }
  // dropzones(b);
  d = document.createElement("div");
  d.className = "dropzone";
  // dropzones(d);
  c = document.createElement("p");
  c.className = "do";
  c.appendChild(document.createTextNode(opr));
  if (testparam)
    a.appendChild(b);
  a.appendChild(c);
  a.appendChild(d);

  a.addEventListener("drag", (event) => {
    console.log("dragging");
  });

  a.addEventListener("dragstart", (event) => {
    dragged = event.target;
    event.target.classList.add("dragging");
  });

  a.addEventListener("dragend", (event) => {
    event.target.classList.remove("dragging");
  });
  
  dropzones(a);
  document.getElementById("canvas").appendChild(a)
}

// /* events fired on the draggable target */
// const source = document.querySelectorAll(".draggable");
// source.forEach((target) => {
//   target.addEventListener("drag", (event) => {
//     console.log("dragging");
//   });

//   target.addEventListener("dragstart", (event) => {
//     dragged = event.target;
//     event.target.classList.add("dragging");
//   });

//   target.addEventListener("dragend", (event) => {
//     event.target.classList.remove("dragging");
//   });
// });

/* events fired on the drop targets */
const dropzones = (target) => {
  target.addEventListener("dragover", (event) => {
    // prevent default to allow drop
    event.preventDefault();
  });

  target.addEventListener("dragenter", (event) => {
    // highlight potential drop target when the draggable element enters it
    event.target.classList.add("dragover");
  });

  target.addEventListener("dragleave", (event) => {
    // reset background of potential drop target when the draggable element leaves it
    event.target.classList.remove("dragover");
  });

  target.addEventListener("drop", (event) => {
    // prevent default action (open as link for some elements)
    event.preventDefault();
    // move dragged element to the selected drop target
    event.target.classList.remove("dragover");
    if (event.target.tagName !== "P") {
      dragged.style.position = "relative";
      dragged.style.top = "0px";
      dragged.style.left = "0px";
      event.target.appendChild(dragged);
    }
    event.stopPropagation();
  });
};

const canvas = document.getElementById("canvas");
canvas.addEventListener("drop", (event) => {
    event.preventDefault();
    console.log(".,har")
    dragged.style.position = "absolute";
    dragged.style.top = event.layerY - dragged.offsetHeight/2 + "px";
    dragged.style.left = event.layerX - dragged.offsetHeight/2 + "px";
    event.target.appendChild(dragged);
});
  
canvas.addEventListener("dragover", (event) => {
    event.preventDefault();
});

const calvas = document.getElementById("calvas");

dropzones(calvas);
  
const dotext = document.querySelectorAll(".do");
dotext.forEach((target) => {
  target.innerHTML = target.parentElement.id;
});

// const button = document.querySelectorAll(".calbutton");
// button.forEach((target) => {
//   target.addEventListener("click", (event) => {
//     console.log(eval(dragged.children[0].innerHTML+dragged.parentElement.parentElement.id));
//     dragged.children[0].innerHTML = eval(dragged.children[0].innerHTML+dragged.parentElement.parentElement.id);
//     canvas.appendChild(dragged);
//     // if (target.parentElement.children[0].children.length !== 0) {
//     //   console.log(target.parentElement.children[0].children[0]);
//     // }
//   })
// });

const add1 = document.getElementById("add1")
add1.addEventListener("click", (event) => { return addnum(event, "1"); })

const addtrue = document.getElementById("addtrue")
addtrue.addEventListener("click", (event) => { return addnum(event, "true"); })

const addfalse = document.getElementById("addfalse")
addfalse.addEventListener("click", (event) => { return addnum(event, "false"); })

const addadd = document.getElementById("addadd");
addadd.addEventListener("click", (event) => { return addopr(event, "+"); })

const addNAND = document.getElementById("addNAND");
addNAND.addEventListener("click", (event) => { return addopr(event, "NAND"); })

const addNOT = document.getElementById("addNOT");
addNOT.addEventListener("click", (event) => { return addopr(event, "NOT", false); })

function evalhagi(expr) {
  if (expr.classList.contains("deokenbox")) {
    // const [operand1, operator, operand2] = expr.children;
    // const num1 = evalhagi(operand1.children[0]);
    // const num2 = evalhagi(operand2.children[0]);
    const operand = Array.from(expr.children).filter((child) => {
      return child.tagName !== "P"
    }).map((child) => {
      return evalhagi(child.children[0])
    });
    console.log(operand);

    return calfunc[expr.classList[2]](operand);
  }

  return expr.children[0].innerHTML
}

calc = document.getElementById("calc")
calc.addEventListener("click", (event) => {
  addnum(event, evalhagi(calvas.children[0]));
})