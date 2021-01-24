import { ipcRenderer } from 'electron';

export function addItem(item: any) {
  return ipcRenderer.invoke('database-addItem', item);
}

export function getItems() {
  return ipcRenderer.invoke('database-getItems');
}

export function editItem(item: any) {
  return ipcRenderer.invoke('database-editItem', item);
}

export function deleteItem(itemId: number) {
  return ipcRenderer.invoke('database-deleteItem', itemId);
}

export function sellProduct(data: any) {
  return ipcRenderer.invoke('database-sellProduct', data);
}

export function searchProducts(searchStr: string) {
  return ipcRenderer.invoke('database-searchProduct', searchStr);
}

export function getOrders(filters?: { startDate?: Date; endDate?: Date }) {
  return ipcRenderer.invoke('database-getOrders', filters);
}
