import {
  Between,
  createConnection,
  LessThan,
  Like,
  MoreThanOrEqual,
  Raw,
} from 'typeorm';
import { Item } from './Item';
import { Order } from './Order';
import { ipcMain } from 'electron';

function parseDateForSql(date: Date) {
  // YYYY-MM-DD hh:mm:ss
  return date
    .toISOString()
    .replace('T', ' ')
    .replace(/\.\d+Z$/, '');
}

const connectionPromise = createConnection({
  type: 'sqlite',
  database: 'database',
  entities: [Item, Order],
  synchronize: true,
});

ipcMain.handle('database-addItem', async (_, item) => {
  const connection = await connectionPromise;
  const newItem = new Item();
  newItem.name = item.name;
  newItem.price = item.price;
  newItem.description = item.description;
  newItem.availableUnits = item.availableUnits;
  return connection.getRepository(Item).save(newItem);
});

ipcMain.handle('database-getItems', async (_) => {
  const connection = await connectionPromise;
  return connection.getRepository(Item).find();
});

ipcMain.handle('database-editItem', async (_, item) => {
  const connection = await connectionPromise;
  const repository = await connection.getRepository(Item);
  const itemToEdit = await repository.findOne(item.id);
  delete item.id;
  return repository.save({ ...itemToEdit, ...item });
});

ipcMain.handle('database-deleteItem', async (_, itemId) => {
  const connection = await connectionPromise;
  const repository = await connection.getRepository(Item);
  const item = await repository.findOne(itemId);
  return repository.remove(item);
});

ipcMain.handle('database-sellProduct', async (_, data) => {
  const { itemId, quantity, price } = data;
  const connection = await connectionPromise;
  const itemRepository = await connection.getRepository(Item);
  const item = await itemRepository.findOne(itemId);
  const newOrder = new Order();
  newOrder.item = item;
  newOrder.unitPrice = price;
  newOrder.quantity = quantity;
  await connection.getRepository(Order).save(newOrder);
  item.availableUnits = item.availableUnits - Number(quantity);
  return itemRepository.save(item);
});

ipcMain.handle('database-searchProduct', async (_, searchStr) => {
  const connection = await connectionPromise;
  const repository = await connection.getRepository(Item);
  const newSearchStr = `%${searchStr}%`;
  return repository.find({
    where: [{ name: Like(newSearchStr) }, { description: Like(newSearchStr) }],
  });
});

ipcMain.handle('database-getOrders', async (_, filters) => {
  const connection = await connectionPromise;
  const orderRepository = await connection.getRepository(Order);
  const { startDate, endDate } = filters || {};
  const conditions =
    startDate &&
    endDate &&
    'order.createdAt >= :startDate AND order.createdAt < :endDate';
  const parameters = {
    startDate: startDate && parseDateForSql(startDate),
    endDate: endDate && parseDateForSql(endDate),
  };

  console.log(conditions, parameters);

  const totalPriceRes = await orderRepository
    .createQueryBuilder('order')
    .select('SUM(order.unitPrice * order.quantity)', 'totalPrice')
    .where(conditions)
    .setParameters(parameters)
    .getRawOne();

  const orders = await orderRepository
    .createQueryBuilder('order')
    .leftJoinAndSelect('order.item', 'item')
    .where(conditions)
    .setParameters(parameters)
    .getMany();

  return { totalPrice: totalPriceRes.totalPrice, orders };
});
