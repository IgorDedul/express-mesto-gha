const Card = require('../models/card');

const NotFoundError = require('../errors/NotFoundError');
const ValidationError = require('../errors/ValidationError');
const ForbiddenError = require('../errors/ForbiddenError');


//Возвращает все карточки
const getCards = (req, res) => {
  return Card.find({})
    .then((cards) => {
      return res.status(200).send(cards);
    })
    .catch((err) => {next(err)});
};

//Создаёт карточку
const createCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  return Card.create({ name, link, owner })
    .then((card) => {
      return res.status(201).send(card);
    })
    .catch((err) => {
      console.log(err);
      if (err.name === 'ValidationError') {
        return next(new ValidationError('Переданы некорректные данные'));
      }
      return next(err);
    });
};


//Удаляет карточку по идентификатору
const deleteCard = (req, res) => {
  const { cardId } = req.params;
  return Card.findById(cardId)
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Карта не найдена');
      }
      if (card.owner.toString() !== req.user._id) {
        throw new ForbiddenError('Удаление чужой карточки');
      }
      return Card.findByIdAndRemove(cardId)
      .then((card) => {
        res.send(card);
      })
      .catch((err) => {
        console.log(err);
        next(err);
      });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new ValidationError('Некорректный id карточки'));
      }
      return next(err);
     });
};

//Поставить лайк карточке
const likeCard = (req, res) => {
  Card.findByIdAndUpdate(req.params.cardId, { $addToSet: { likes: req.user._id } }, { new: true })
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Карточка не найдена');
      }
      res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new ValidationError('Некорректный id карточки'));
      }
      return next(err);
    });
};

//Убрать лайк с карточки
const dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(req.params.cardId, { $pull: { likes: req.user._id } }, { new: true })
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Карточка не найдена');
      }

      res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new ValidationError('Некорректный id карточки'));
      }

      return next(err);
    });
};


module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};