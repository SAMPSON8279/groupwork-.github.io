const API_URL = "http://localhost:3000/ingredients";
const ingredientForm = document.getElementById("ingredientForm");
const ingredientName = document.getElementById("ingredientName");
const ingredientType = document.getElementById("ingredientType");
const ingredientQuantity = document.getElementById("quantity");
const ingredientTableBody = document.getElementById("ingredientTableBody");

async function fetchIngredients() {
  const res = await fetch(API_URL);
  const ingredients = await res.json();
  renderIngredients(ingredients);
}

function renderIngredients(ingredients) {
  ingredientTableBody.innerHTML = "";
  ingredients.forEach(ingredient => {
    console.log(ingredient);
    const tr = document.createElement("tr");

    const tdId = document.createElement("td");
    tdId.textContent = ingredient.id;

    const tdName = document.createElement("td");
    tdName.textContent = ingredient.name;

    const tdIngredientType = document.createElement("td");
    tdIngredientType.textContent = ingredient.ingredient_type;
   

    const tdQuantity = document.createElement("td");
    tdQuantity.textContent = ingredient.quantity;

    const tdActions = document.createElement("td");

    const editBtn = document.createElement("button");
    editBtn.textContent = "Edit";
    editBtn.onclick = async () => {
      const newName = prompt("Edit ingredient:", ingredient.name);
      const newIngredientType = prompt("Edit ingredient_type:", ingredient.ingredient_type);
      const newQuantity = prompt("Edit quantity:", ingredient.quantity);
      if (newName, newIngredientType, newQuantity) {
        await fetch(`${API_URL}/${ingredient.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: newName, ingredient_type: newIngredientType, quantity: newQuantity })
        });
        fetchIngredients();
      }
    };

    const delBtn = document.createElement("button");
    delBtn.textContent = "Delete";
    delBtn.onclick = async () => {
      const confirmed = confirm(`Are you sure you want to delete "${ingredient.name}"?`);
      if (!confirmed) return;
      
      await fetch(`${API_URL}/${ingredient.id}`, { method: "DELETE" });
      fetchIngredients();
    };

    tdActions.appendChild(editBtn);
    tdActions.appendChild(delBtn);

    tr.appendChild(tdId);
    tr.appendChild(tdName);
    tr.appendChild(tdIngredientType);
    tr.appendChild(tdQuantity);
    tr.appendChild(tdActions);

    ingredientTableBody.appendChild(tr);
  });
}

ingredientForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name: ingredientName.value, ingredient_type: ingredientType.value, quantity: ingredientQuantity.value })
  });
  ingredientName.value = "";
  ingredientType.value = "";
  ingredientQuantity.value = "";

  fetchIngredients();
});

fetchIngredients();
