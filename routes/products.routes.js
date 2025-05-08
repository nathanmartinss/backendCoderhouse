const express = require("express");
const Product = require("../models/Product");
const { isAuthenticated } = require("../middlewares/auth.middleware");

/**
 * @swagger
 * tags:
 *   name: Produtos
 *   description: API para gerenciamento de produtos
 */

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Lista todos os produtos
 *     tags: [Produtos]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Lista de produtos
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 products:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Product'
 *
 *   post:
 *     summary: Cria um novo produto
 *     tags: [Produtos]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProductInput'
 *     responses:
 *       201:
 *         description: Produto criado
 *       400:
 *         description: Campos obrigatórios faltando
 *       500:
 *         description: Erro interno
 */

/**
 * @swagger
 * /api/products/{id}:
 *   put:
 *     summary: Atualiza um produto existente
 *     tags: [Produtos]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID do produto
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProductInput'
 *     responses:
 *       200:
 *         description: Produto atualizado com sucesso
 *       404:
 *         description: Produto não encontrado
 *       500:
 *         description: Erro interno
 *
 *   delete:
 *     summary: Remove um produto
 *     tags: [Produtos]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID do produto a ser deletado
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Produto removido
 *       404:
 *         description: Produto não encontrado
 *       500:
 *         description: Erro interno
 */

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     cookieAuth:
 *       type: apiKey
 *       in: cookie
 *       name: connect.sid
 *   schemas:
 *     Product:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         name:
 *           type: string
 *         price:
 *           type: number
 *         description:
 *           type: string
 *         category:
 *           type: string
 *         thumbnails:
 *           type: array
 *           items:
 *             type: string
 *     ProductInput:
 *       type: object
 *       required:
 *         - name
 *         - price
 *         - description
 *       properties:
 *         name:
 *           type: string
 *         price:
 *           type: number
 *         description:
 *           type: string
 *         category:
 *           type: string
 *         thumbnails:
 *           type: array
 *           items:
 *             type: string
 */

module.exports = (io) => {
  const router = express.Router();

  router.get("/", isAuthenticated, async (req, res) => {
    try {
      const products = await Product.find().lean();
      res.status(200).json({ products });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  router.post("/", isAuthenticated, async (req, res) => {
    try {
      const { name, price, description, category, thumbnails } = req.body;

      if (!name || !price || !description) {
        return res
          .status(400)
          .json({ message: "Campos obrigatórios faltando." });
      }

      const newProduct = new Product({
        name,
        price,
        description,
        category: category || "Geral",
        thumbnails: thumbnails || [],
      });

      await newProduct.save();

      const products = await Product.find().lean();
      io.emit("updateProducts", products);

      res.status(201).json({ message: "Produto criado!", product: newProduct });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  router.put("/:id", isAuthenticated, async (req, res) => {
    try {
      const updatedProduct = await Product.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );

      if (!updatedProduct) {
        return res.status(404).json({ message: "Produto não encontrado." });
      }

      const products = await Product.find().lean();
      io.emit("updateProducts", products);

      res.json({ message: "Produto atualizado!", product: updatedProduct });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  router.delete("/:id", isAuthenticated, async (req, res) => {
    try {
      const deletedProduct = await Product.findByIdAndDelete(req.params.id);

      if (!deletedProduct) {
        return res.status(404).json({ message: "Produto não encontrado." });
      }

      const products = await Product.find().lean();
      io.emit("updateProducts", products);

      res.json({ message: "Produto removido com sucesso!" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  return router;
};
