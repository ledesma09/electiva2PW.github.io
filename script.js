// Cargar jsPDF desde CDN
const script = document.createElement("script");
script.src = "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js";
document.head.appendChild(script);

document.addEventListener("DOMContentLoaded", () => {
  loadTasks();
});

function addTask() {
  const input = document.getElementById("taskInput");
  const taskText = input.value.trim();
  if (taskText === "") return;

  const li = createTaskElement(taskText);
  document.getElementById("taskList").appendChild(li);

  saveTasks();
  input.value = "";
}

function createTaskElement(text, completed = false) {
  const li = document.createElement("li");
  li.textContent = text;

  if (completed) li.classList.add("completed");

  li.addEventListener("click", () => {
    li.classList.toggle("completed");
    saveTasks();
  });

  const deleteBtn = document.createElement("button");
  deleteBtn.textContent = "X";
  deleteBtn.style.marginLeft = "10px";
  deleteBtn.style.background = "#ff4d88";
  deleteBtn.style.color = "white";
  deleteBtn.style.border = "none";
  deleteBtn.style.borderRadius = "6px";
  deleteBtn.style.cursor = "pointer";

  deleteBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    li.remove();
    saveTasks();
  });

  li.appendChild(deleteBtn);
  return li;
}

function clearTasks() {
  document.getElementById("taskList").innerHTML = "";
  saveTasks();
}

function saveTasks() {
  const tasks = [];
  document.querySelectorAll("#taskList li").forEach((li) => {
    tasks.push({
      text: li.firstChild.textContent,
      completed: li.classList.contains("completed"),
    });
  });
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function loadTasks() {
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks.forEach((t) => {
    const li = createTaskElement(t.text, t.completed);
    document.getElementById("taskList").appendChild(li);
  });
}

async function generatePDF() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];

  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.text("Lista de Tareas", 20, 20);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(12);
  let y = 40;
  tasks.forEach((t, i) => {
    const status = t.completed ? "[✔]" : "[ ]";
    doc.text(`${i + 1}. ${status} ${t.text}`, 20, y);
    y += 10;
  });

  doc.save("tareas.pdf");
}
