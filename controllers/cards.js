const Card = require('../models/card');


//Возвращает все карточки
const getCards = (req, res) => {
  return Card.find({})
    .then((cards) => {
      return res.status(200).send(cards);
    })
    .catch((err) => res.status(500).send('Ошибка сервера'));
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
      return res.status(500).send('Ошибка сервера');
    });
};


//Удаляет карточку по идентификатору
const deleteCard = (req, res) => {
  const { cardId } = req.params;
  return Card.findById(cardId)
    .then((card) => {
      if (!card) {
        return res.status(404).send('Карта не найдена');
      }
      if (card.owner.toString() !== req.user._id) {
        return res.status(403).send('Удаление чужой карточки');
      }
      return Card.findByIdAndRemove(cardId)
      .then((card) => {
        res.send(card);
      })
      .catch((err) => {
        console.log(err);
        return res.status(500).send('Ошибка сервера');
      });
    })
    .catch((err) => res.status(500).send('Ошибка сервера'));
};

//Поставить лайк карточке
const likeCard = (req, res) => {
  Card.findByIdAndUpdate(req.params.cardId, { $addToSet: { likes: req.user._id } }, { new: true })
    .then((card) => {
      if (!card) {
        return res.status(404).send('Карточка не найдена');
      }

      res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(404).send('Некорректный id карточки');
      }

      return res.status(500).send('Ошибка сервера');
    });
};

//Убрать лайк с карточки
const dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(req.params.cardId, { $pull: { likes: req.user._id } }, { new: true })
    .then((card) => {
      if (!card) {
        return res.status(404).send('Карточка не найдена');
      }

      res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(404).send('Некорректный id карточки');
      }

      return res.status(500).send('Ошибка сервера');
    });
};


module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};