let modalQtd = 1
let modalKey = 0;
let cartPizza = [];

//functions to select the html element
const selector = (el) => document.querySelector(el)
const selectorAll = (el) => document.querySelectorAll(el)

// surfing through the pizzas
pizzaJson.map((item, index) => {
  let pizzaitem = selector('.models .pizza-item').cloneNode(true)

  pizzaitem.setAttribute('data-key', index)
  pizzaitem.querySelector('.pizza-item--img img').src = item.img
  pizzaitem.querySelector('.pizza-item--price').innerHTML = `R$ ${item.price.toFixed(2)}`
  pizzaitem.querySelector('.pizza-item--name').innerHTML = item.name
  pizzaitem.querySelector('.pizza-item--desc').innerHTML = item.description
  pizzaitem.querySelector('a').addEventListener('click', (e) => {
    e.preventDefault()

    modalQtd = 1
    fillInfosPizzaModal(e)
    editElPizza()
  })

  //fullfill the infos on screen
  selector('.pizza-area').append(pizzaitem)
})

const editElPizza = () => {
  selector('.pizzaInfo--qt').innerHTML = modalQtd;
  selector('.pizzaWindowArea').style.opacity = 0
  selector('.pizzaWindowArea').style.display = 'flex'

  setTimeout(() => {
    selector('.pizzaWindowArea').style.opacity = 1
  }, 200)
}

const fillInfosPizzaModal = (e) => {
  let key = e.target.closest('.pizza-item').getAttribute('data-key')
  modalKey = key; // to check what was the pizza clicked

  selector('.pizzaBig img').src = pizzaJson[key].img
  selector('.pizzaInfo h1').innerHTML = pizzaJson[key].name
  selector('.pizzaInfo--desc').innerHTML = pizzaJson[key].description
  selector('.pizzaInfo--actualPrice').innerHTML = pizzaJson[key].price.toFixed(2)
  selector('.pizzaInfo--size.selected').classList.remove('selected');

  selectorAll('.pizzaInfo--size').forEach((size, sizeIndex) => {
    if (sizeIndex == 2) {
      size.classList.add('selected')
    }
    size.querySelector('span').innerHTML = pizzaJson[key].sizes[sizeIndex]
  })

  selectorAll('.pizzaInfo--size').forEach((size) => {
    size.addEventListener('click',() => {
      selector('.pizzaInfo--size.selected').classList.remove('selected')
      size.classList.add('selected');
    });
  })
}

const closeModalPizza = () => {
  selector('.pizzaWindowArea').style.opacity = 0
  setTimeout(() => {
    selector('.pizzaWindowArea').style.display = 'none'
  }, 500)
}

selectorAll('.pizzaInfo--cancelButton, .pizzaInfo--cancelMobileButton').forEach((item) => {
  item.addEventListener('click', closeModalPizza);
});

selector('.pizzaInfo--qtmenos').addEventListener('click', ()=>{
  if(modalQtd > 1){
  modalQtd--;
  selector('.pizzaInfo--qt').innerHTML = modalQtd;
  }
});

selector('.pizzaInfo--qtmais').addEventListener('click', ()=>{
  modalQtd++;
  selector('.pizzaInfo--qt').innerHTML = modalQtd;

});
//selecting the pizza and adding it to the cart
selector('.pizzaInfo--addButton').addEventListener('click', ()=>{
  let sizePizza = parseInt(selector('.pizzaInfo--size.selected').getAttribute('data-key'));
  //creating a identifier for the pizzas
  let idPizza = pizzaJson[modalKey].id+'@'+sizePizza;
  //checking inside the cart if there is the same identifier
  let keyPizza = cartPizza.findIndex((item) => item.idPizza  == idPizza);
  if(keyPizza > -1){
    cartPizza[keyPizza].qt += modalQtd;
  }else{
  cartPizza.push({
    idPizza,
    id: pizzaJson[modalKey].id,
    sizePizza,
    qt: modalQtd
  });
  }
  updateCartPizza();
  closeModalPizza();
});


selector('.menu-openner').addEventListener('click', () =>{
  if(cartPizza.length > 0){
    selector('aside').style.left = '0';
  }
});
selector('.menu-closer').addEventListener('click', () =>{
    selector('aside').style.left = '100vw';
});



const updateCartPizza = () =>{
  selector('.menu-openner span').innerHTML = cartPizza.length;


  if(cartPizza.length > 0){
    selector('aside').classList.add('show');
    //cleaning the cart before fill in
    selector('.cart').innerHTML = '';


    let subTotal = 0;
    let discount = 0;
    let total = 0;

    for(let i in cartPizza){

      let pizzaSizeName;
      switch(cartPizza[i].sizePizza){
        case 0:
        pizzaSizeName = 'P';
        break;
        case 1:
        pizzaSizeName = 'M';
        break;
        case 2:
        pizzaSizeName = 'G';
        break;
      }
      let pizzaItemResult = pizzaJson.find((item) => item.id == cartPizza[i].id);
      subTotal += pizzaItemResult.price * cartPizza[i].qt;



      let pizzaName =`${pizzaItemResult.name} (${pizzaSizeName})`;
      let cartItens = selector('.models .cart--item').cloneNode(true);

      cartItens.querySelector('img').src = pizzaItemResult.img
      cartItens.querySelector('.cart--item-nome').innerHTML = pizzaName
      cartItens.querySelector('.cart--item--qt').innerHTML = cartPizza[i].qt
      cartItens.querySelector('.cart--item-qtmenos').addEventListener('click', () =>
      {
      if(cartPizza[i].qt > 1){
          cartPizza[i].qt--;
       }else{
          cartPizza.splice(i, 1);
        }

        updateCartPizza();
      });
      cartItens.querySelector('.cart--item-qtmais').addEventListener('click', () =>
      {
        cartPizza[i].qt++;
        updateCartPizza();
      });



      selector('.cart').append(cartItens);
    }


    discount = subTotal * 0.1; // applying the discount factor
    total = subTotal - discount;

    selector('.subtotal span:last-child').innerHTML = `R${subTotal.toFixed(2)}`;
    selector('.discount span:last-child').innerHTML = `R${discount.toFixed(2)}`;
    selector('.total span:last-child').innerHTML = `R${total.toFixed(2)}`;

  }else{
    selector('aside').classList.remove('show');
    selector('aside').style.left = '100vw'; // closing the cart on both screens
  }
}