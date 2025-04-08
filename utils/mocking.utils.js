const { faker } = require("@faker-js/faker");

const generateMockProduct = () => ({
  name: faker.commerce.productName(),
  price: parseFloat(faker.commerce.price()),
  description: faker.commerce.productDescription(),
  category: faker.commerce.department(),
  thumbnails: [faker.image.imageUrl()],
});

const generateMockProducts = (amount = 100) =>
  Array.from({ length: amount }, () => generateMockProduct());

module.exports = { generateMockProducts };
