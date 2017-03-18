const uuid = require('uuid');


// EACH MODEL FOR ENDPOINTS FOR FAVORITES
const Games = {
  create: function(name, first_release_date) {
    console.log('Creating a new game');
    const item = {
      name: name,
      id: uuid.v4(),
      first_release_date: first_release_date
    };
    this.items[item.id] = item;
    return item;
  },
  get: function() {
    console.log('Retreiving favorite games');
    return Object.keys(this.items).map(key => this.items[key]);
  },
  delete: function(itemId) {
    console.log(`Deleting game with id \`${itemId}\``);
    delete this.items[itemId];
  },
  update: function(updatedItem) {
    console.log(`Updating game with id \`${updatedItem.id}\``);
    const {id} = updatedItem;
    if (!(id in this.items)) {
      throw StorageException(
        `Can't update item \`${id}\` because doesn't exist.`)
    }
    this.items[updatedItem.id] = updatedItem;
    return updatedItem;
  }
};

function createGames() {
  const storage = Object.create(Games);
  storage.items = {};
  return storage;
}

module.exports = {
  Games: createGames()
}