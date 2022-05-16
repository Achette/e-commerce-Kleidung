let cart = [];
let modalQt;
let key = 0;
const c = (el) => document.querySelector(el);
const cs = (el) => document.querySelectorAll(el);

modelsJson.map((item, index) => {
  let modelsItem = c(".models .models-item").cloneNode(true);
  modelsItem.setAttribute("data-key", index);

  modelsItem.querySelector(".models-item-img img").src = item.img;
  modelsItem.querySelector(
    ".models-item-price"
  ).innerHTML = `R$ ${item.price[0].toFixed(2)}`;
  modelsItem.querySelector(".models-item-name").innerHTML = item.name;
  modelsItem.querySelector(".models-item-desc").innerHTML = item.description;

  modelsItem.querySelector("a").addEventListener("click", (e) => {
    e.preventDefault();
    key = e.target.closest(".models-item").getAttribute("data-key");
    modalQt = 1;
    c(".modelsBig img").src = modelsJson[key].img;
    c(".modelsInfo h1").innerHTML = modelsJson[key].name;
    c(".modelsInfo-desc").innerHTML = modelsJson[key].description;
    c(".modelsInfo-size.selected").classList.remove("selected");
    cs(".modelsInfo-size").forEach((el, sizeIndex) => {
      if (sizeIndex == 2) {
        el.classList.add("selected");
        c(".modelsInfo-atualPrice").innerHTML =
          modelsJson[key].price[0].toFixed(2);
      }
      //el.innerHTML = modelsJson[key].sizes[sizeIndex]
      el.querySelector("span").innerHTML = modelsJson[key].sizes[sizeIndex];
    });
    c(".modelsInfo-qt").innerHTML = modalQt;
    c(".modelsWindowArea").style.opacity = "0";
    c(".modelsWindowArea").style.display = "flex";
    setTimeout(() => {
      c(".modelsWindowArea").style.opacity = "1";
    }, 300);
  });
  c(".models-area").append(modelsItem);
});

// Controle janela modal -> FECHAR

function closeModal() {
  c(".modelsWindowArea").style.opacity = "0";
  setTimeout(() => {
    c(".modelsWindowArea").style.display = "none";
  }, 500);
}

cs(".modelsInfo-cancelButton, .modelsInfo-cancelMobileButton").forEach(
  (item) => {
    item.addEventListener("click", closeModal);
  }
);

c(".modelsInfo-qtmenos").addEventListener("click", () => {
  if (modalQt > 1) {
    modalQt--;
    c(".modelsInfo-qt").innerHTML = modalQt;
  }
});

c(".modelsInfo-qtmais").addEventListener("click", () => {
  modalQt++;
  c(".modelsInfo-qt").innerHTML = modalQt;
});

cs(".modelsInfo-size").forEach((el, sizeIndex) => {
  el.addEventListener("click", (e) => {
    c(".modelsInfo-size.selected").classList.remove("selected");
    el.classList.add("selected");
    c(".modelsInfo-atualPrice").innerHTML =
      modelsJson[key].price[0].toFixed(2);
  });
});

c(".modelsInfo-addButton").addEventListener("click", () => {
  let size = parseInt(c(".modelsInfo-size.selected").getAttribute("data-key"));
  let identifier = modelsJson[key].id + "@" + size;
  let locaId = cart.findIndex((item) => item.identifier.id == identifier);

  if (locaId > -1) {
    cart[locaId].qt += modalQt;
  } else {
    cart.push({
      identifier,
      id: modelsJson[key].id,
      size,
      qt: modalQt,
    });
  }
  updateCart();
  closeModal();
});

//ajustando o mobile
c('.menu-openner').addEventListener('click', ()=>{
  if(cart.length > 0){
    c('aside').style.left = '0';
    
  }
});

c('.menu-closer').addEventListener('click', ()=>{
  c('aside').style.left='100vw';
});

function updateCart() {
  if (cart.length > 0) {
    c("aside").classList.add("show");
    c(".cart").innerHTML = "";

    let subtotal = 0;
    const frete = 18.90;
    let total = 0;
    let counter = 0;
    cart.map((itemCart, index) => {
      let modelItem = modelsJson.find((itemBD) => itemBD.id == itemCart.id);
      subtotal += modelItem.price[0] * itemCart.qt;

      counter += itemCart.qt;

      let cartItem = c(".models .cart-item").cloneNode(true);

      let modelSizeName;
      switch (itemCart.size) {
        case 0:
          modelSizeName = "P";
          break;
        case 1:
          modelSizeName = "M";
          break;
        case 2:
          modelSizeName = "G";
      }

      cartItem.querySelector("img").src = modelItem.img;
      cartItem.querySelector(".cart-item-name").innerHTML = `${
        modelItem.name
      } - ${modelItem.sizes[itemCart.size]}`;
      //cartItem.querySelector('.cart-item-name').innerHTML = ` ${modelItem.name} (${modelSizeName})`
      cartItem.querySelector(".cart-item-qt").innerHTML = itemCart.qt;

      cartItem
        .querySelector(".cart-item-qtmenos")
        .addEventListener("click", () => {
          if (itemCart.qt > 1) {
            itemCart.qt--;
          } else {
            cart.splice(index, 1);
          }
          updateCart();
        });
      cartItem
        .querySelector(".cart-item-qtmais")
        .addEventListener("click", () => {
          itemCart.qt++;
          updateCart();
        });
      c(".cart").append(cartItem);
    });
    desconto = subtotal * 0.05;
    total = subtotal + frete;
    c(".subtotal span:last-child").innerHTML = `R$ ${subtotal.toFixed(2)}`;
    c(".desconto span:last-child").innerHTML = `R$ ${frete.toFixed(2)}`;
    c(".total span:last-child").innerHTML = `R$ ${total.toFixed(2)}`;
    c('.cart-mobile').innerHTML = `${counter}`
    
  } else {
    c("aside").classList.remove("show");
    c('aside').style.left = '100vw';
  }
}
