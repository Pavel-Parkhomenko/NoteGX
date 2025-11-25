const btnAddNewNote = document.getElementById("btnAddNewNote");
const noteTextArea = document.getElementById("note");
const listNoteBox = document.getElementById("listNoteBox");
const btnDelNewNote = document.getElementById("btnDelNewNote");

let listNote = [];
let curNote = null;
let curNoteId = 0;

document.addEventListener("DOMContentLoaded", () => {
  chrome.runtime.sendMessage({ type: "popup_opened" }, (response) => {
    if (response.st === 200) {
      listNote = JSON.parse(response.data.gxNote).list || [];

      listNote.map((note, ind) => {
        const newP = document.createElement("p");
        newP.textContent = truncateText(note.text);
        newP.dataset.id = ind;
        listNoteBox.appendChild(newP);
      });
    }
  });
});

function truncateText(text) {
  if (text.length === 0) return "";
  return text.length > 24 ? text.slice(0, 24) + "..." : text;
}

listNoteBox.addEventListener("click", (event) => {
  let elem = event.target
  if (elem.tagName === "P") {

    listNoteBox.querySelectorAll("p").forEach(p => p.classList.remove("selected"))
    elem.classList.add("selected");

    noteTextArea.value = listNote[elem.dataset.id].text
    curNote = elem
    curNoteId = elem.dataset.id

    noteTextArea.focus()
  }
});

noteTextArea.addEventListener("input", (event) => {
  if (curNote === null) return;

  curNote.textContent = truncateText(event.target.value);
  listNote[curNoteId].text = event.target.value;

  chrome.storage.local.set({
      gxNote: JSON.stringify({ list: listNote }),
    },
    () => {}
  );
});

btnDelNewNote.addEventListener("click", () => {
  if(listNote.length === 0 || curNoteId === -1) return
  listNote.splice(curNoteId, 1);
  curNoteId = -1;
  curNote = null;

  // chrome.storage.local.set({ gxNote: JSON.stringify({ list: listNote }), }, () => {} );

  while (listNoteBox.firstChild) {
    listNoteBox.removeChild(listNoteBox.firstChild);
  }

  noteTextArea.value = ""

  listNote.map((note, ind) => {
    const newP = document.createElement("p");
    newP.textContent = truncateText(note.text);
    newP.dataset.id = ind
    listNoteBox.appendChild(newP);
  });
});

btnAddNewNote.addEventListener("click", () => {
  if(listNote.length + 1 > 30) {
    noteTextArea.value = "Too many notes!!!";
    return
  }

  noteTextArea.value = "";
  listNote.push({ text: "" });

  const newP = document.createElement("p");
  newP.textContent = "";
  newP.dataset.id = listNote.length - 1
  curNoteId = listNote.length - 1
  listNoteBox.appendChild(newP)
  curNote = newP
  noteTextArea.focus()

  listNoteBox.querySelectorAll("p").forEach(p => p.classList.remove("selected"))
  newP.classList.add("selected");
});
