//functions to select the html element
const selector = (el) => document.querySelector(el);
const selectorAll = (el) => document.querySelectorAll(el);


// surfing through the pizzas
pizzaJson.map((item, index)=>{
  let pizzaitem = selector('.models .pizza-item').cloneNode(true);

  pizzaitem.setAttribute('data-key', index);
  pizzaitem.querySelector('.pizza-item--img img').src = item.img;
  pizzaitem.querySelector('.pizza-item--price').innerHTML = `R$ ${item.price.toFixed(2)}`;
  pizzaitem.querySelector('.pizza-item--name').innerHTML = item.name;
  pizzaitem.querySelector('.pizza-item--desc').innerHTML = item.description;
  pizzaitem.querySelector('a').addEventListener('click', (e) =>{
    e.preventDefault();

    fillInfosPizzaModal(e);
    editEl();
  });

  //fullfill the infos on screen
  selector('.pizza-area').append(pizzaitem);

});

const editEl = () => {
  selector('.pizzaWindowArea').style.opacity = 0;
  selector('.pizzaWindowArea').style.display = 'flex';

  setTimeout(() =>{
    selector('.pizzaWindowArea').style.opacity = 1;
  },200);
}

const fillInfosPizzaModal = (e) =>{
  let key = e.target.closest('.pizza-item').getAttribute('data-key');
  selector('.pizzaBig img').src = pizzaJson[key].img
  selector('.pizzaInfo h1').innerHTML = pizzaJson[key].name;
  selector('.pizzaInfo--desc').innerHTML = pizzaJson[key].description;
  selector('.pizzaInfo--actualPrice').innerHTML = pizzaJson[key].price.toFixed(2);


}
