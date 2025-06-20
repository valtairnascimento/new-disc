const Joi = require("joi");

exports.answerSchema = Joi.object({
  answers: Joi.array()
    .items(
      Joi.object({
        questionId: Joi.string().required(),
        value: Joi.number().integer().min(1).max(5).required(),
      })
    )
    .min(24)
    .required(), // Exige 24 respostas
});
