const Message = require('../../model/message');

class MessageRepository {

    insert(obj) {

        return Message.create({ ...obj });

    }

    update(id, obj) {

        return Message.update({ ...obj }, {
            where: { id: id }
        });

    }

    delete(id) {

        Message.destroy({
            where: { id: id }
        });

    }

    findById(id) {

        return Message.findAll({
            where: { id: id }
        });

    }

    findByAuthor(author) {

        return Message.findAll({
            where: { author: author }
        });

    }

    findAll() {
        
        return Message.findAll();

    }

}

module.exports = MessageRepository;