const Joi = require("joi");

module.exports = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  next();
};

const createTestLinkSchema = Joi.object({
  testName: Joi.string().required().messages({
    "string.empty": "Nome do usuário é obrigatório",
  }),
});

const validate = (schema) => async (req, res, next) => {
  try {
    await schema.validateAsync(req.body);
    next();
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

module.exports = { validate, createTestLinkSchema };
