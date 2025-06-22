document.addEventListener('DOMContentLoaded', () => {
  const products = [
    {
      name: "Graphic Hoodie",
      price: 600.00,
      image: "images/item1.jpg",
      page: "product.html"
    },
    {
      name: "Denim Jacket",
      price: 750.00,
      image: "images/item2.jpg",
      page: "product.html"
    },
    {
      name: "Cargo Pants",
      price: 500.00,
      image: "images/item3.jpg",
      page: "product.html"
    },
    {
      name: "Denim Jeans",
      price: 780.00,
      image: "images/item2.jpg",
      page: "product.html"
    },
    {
      name: "Graphic Hoodie",
      price: 600.00,
      image: "images/item1.jpg",
      page: "product.html"
    },
    {
      name: "Denim Jacket",
      price: 750.00,
      image: "images/item2.jpg",
      page: "product.html"
    },
    {
      name: "Cargo Pants",
      price: 500.00,
      image: "images/item3.jpg",
      page: "product.html"
    },
    {
      name: "Denim Jeans",
      price: 780.00,
      image: "images/item2.jpg",
      page: "product.html"
    }
  ];

  localStorage.setItem("products", JSON.stringify(products));
});
