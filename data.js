// Seed product data with unique IDs and consistent image paths
const products = [
  { id: 1, 
   name: "Graphic Hoodie", 
   price: 600.00, 
   image: "images/item1.jpg", 
   page: "product1.html" },
  { id: 2, 
   name: "Denim Jacket", 
   price: 750.00, 
   image: "images/item2.jpg", 
   page: "product2.html" },
  { id: 3, 
   name: "Cargo Pants", 
   price: 500.00, 
   image: "images/item3.jpg", 
   page: "product3.html" },
  { id: 4, 
   name: "Denim Jeans", 
   price: 780.00, 
   image: "images/item4.jpg", 
   page: "product4.html" },
];

localStorage.setItem("products", JSON.stringify(products));
