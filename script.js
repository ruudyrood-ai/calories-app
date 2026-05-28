// Переменные для хранения данных приложения
let dailyNorm = parseInt(localStorage.getItem("dailyNorm")) || 0;
let eatenFoods = JSON.parse(localStorage.getItem("eatenFoods")) || [];

// При загрузке страницы сразу обновляем интерфейс из памяти
window.onload = function () {
  updateInterface();
};

// Функция расчета нормы ккал
function calculateNorm() {
  const weight = parseFloat(document.getElementById("weight").value);
  const height = parseFloat(document.getElementById("height").value);
  const age = parseFloat(document.getElementById("age").value);
  const activity = parseFloat(document.getElementById("activity").value);

  if (!weight || !height || !age) {
    alert("Заполните все поля для расчета!");
    return;
  }

  // Формула Миффлина — Сан Жеора (мужская)
  const bmr = 10 * weight + 6.25 * height - 5 * age + 5;
  dailyNorm = Math.round(bmr * activity);

  localStorage.setItem("dailyNorm", dailyNorm);
  document.getElementById("norm-result").innerText =
    `Норма рассчитана: ${dailyNorm} ккал`;

  updateInterface();
}

// Функция добавления съеденного продукта
function addFood() {
  const nameInput = document.getElementById("food-name");
  const calInput = document.getElementById("food-calories");

  const name = nameInput.value.trim();
  const calories = parseInt(calInput.value);

  if (!name || isNaN(calories) || calories <= 0) {
    alert("Введите название продукта и калорийность!");
    return;
  }

  // Добавляем в массив
  eatenFoods.push({ name, calories });

  // Сохраняем в локальную память
  localStorage.setItem("eatenFoods", JSON.stringify(eatenFoods));

  // Очищаем поля ввода
  nameInput.value = "";
  calInput.value = "";

  updateInterface();
}

// Функция обновления всех цифр и списков на экране
function updateInterface() {
  // Считаем общее количество съеденных ккал
  const totalEaten = eatenFoods.reduce((sum, item) => sum + item.calories, 0);
  const timeLeft = dailyNorm - totalEaten;

  // Выводим в блок баланса
  document.getElementById("target-calories").innerText = dailyNorm;
  document.getElementById("total-eaten").innerText = totalEaten;

  const leftElement = document.getElementById("calories-left");
  leftElement.innerText = timeLeft;
  // Если перебор, красим в красный, если норм — в зеленый
  leftElement.style.color = timeLeft < 0 ? "#cf6679" : "#03dac6";

  // Обновляем список продуктов на экране
  const listElement = document.getElementById("food-list");
  listElement.innerHTML = "";

  eatenFoods.forEach((item) => {
    const li = document.createElement("li");
    li.innerHTML = `<span>${item.name}</span> <b>${item.calories} ккал</b>`;
    listElement.appendChild(li);
  });
}

// Очистка дневника (новый день)
function clearDay() {
  if (confirm("Сбросить съеденное за сегодня?")) {
    eatenFoods = [];
    localStorage.removeItem("eatenFoods");
    updateInterface();
  }
}
