const model = require("../model/Category");
const Category = model.Category;

exports.fetchCategories = async (req, res) => {

  try {
    const categories = await Category.find({}).exec();
    res.status(201).json(categories);
  } catch (err) {
    console.error({ err });
    res.status(400).json(err);
  }
  }


exports.createCategory = async (req, res) => {
  const category = new Category(req.body);
  try {
    const doc = await category.save();
    res.status(201).json(doc);
  } catch (err) {
    console.error({ err });
    res.status(400).json(err);
  }
}
