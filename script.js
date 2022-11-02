// const { assign } = require("mocha/lib/utils");
const buttonEmptyCart = document.querySelector('.empty-cart');

const selectShoppingCart = () => document.querySelector('ol.cart__items');

const createProductImageElement = (imageSource) => {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
};

const createCustomElement = (element, className, innerText) => {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
};

const createProductItemElement = ({ id: sku, title: name, thumbnail: image }) => {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  return section;
};

const getSkuFromProductItem = (item) => item.querySelector('span.item__sku').innerText;

const cartItemClickListener = ({ target }) => {
  if (target.tagName === 'LI') target.parentNode.removeChild(target);
};

const createCartItemElement = ({ id: sku, title: name, price: salePrice }) => {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  return li;
};

const createProductList = async () => {
  const itensContainer = document.querySelector('.items');
  const { results } = await fetchProducts('computador');
  console.log(results);
  results.map((element) => itensContainer.appendChild(createProductItemElement(element)));
};

const addItemsToCart = async ({ target }) => {
  if (target.classList.contains('item__add')) {
    const id = getSkuFromProductItem(target.parentNode);
    const cart = selectShoppingCart();
    cart.appendChild(createCartItemElement(await fetchItem(id)));
  }
};

const collectThePrices = async () => ([...await document.getElementsByClassName('cart__item')]
  .map(({ innerText }) => Number(innerText.match(/\d+(\.\d+)?$/g)))
);

const sumPrices = async () => {
  const pricesList = await collectThePrices();
  return pricesList.reduce((valueA, valueB) => {
    let a = valueA; a += valueB; return a;
  }, 0);
};

const addTotalPrice = async () => {
  const elementTotalPrice = document.querySelector('.total-price');
  elementTotalPrice.innerText = `${await sumPrices()}`;
};

const emptyCart = () => {
  selectShoppingCart().innerHTML = '';
  localStorage.removeItem('cartItems');
  addTotalPrice();
};

const addLoading = () => {
  const itensContainer = document.querySelector('.items');
  const element = document.createElement('p');
  element.innerText = 'carregando...';
  element.classList.add('loading');
  itensContainer.append(element);
};

const removeLoading = () => {
  const itensContainer = document.querySelector('.items');
  const loading = document.querySelector('.loading');
  itensContainer.removeChild(loading);
};

const byClickingTheAddToCartButton = async (event) => {
  await addItemsToCart(event);
  saveCartItems(selectShoppingCart().innerHTML);
  addTotalPrice();
};

const whenClickingOnItemInTheCart = async (event) => {
  await cartItemClickListener(event);
  saveCartItems(selectShoppingCart().innerHTML);
  addTotalPrice();
};

const addSavedItemsToCard = () => {
  selectShoppingCart().innerHTML = getSavedCartItems();
  addTotalPrice();
};

const events = () => {
  const itensContainer = document.querySelector('.items');
  const cart = selectShoppingCart();

  itensContainer.addEventListener('click', byClickingTheAddToCartButton);
  cart.addEventListener('click', whenClickingOnItemInTheCart);
  buttonEmptyCart.addEventListener('click', emptyCart);
};

events();

window.onload = async () => {
  addLoading();
  await createProductList();
  removeLoading();
  addSavedItemsToCard();
};