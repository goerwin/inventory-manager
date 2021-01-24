import React, { useEffect, useState } from 'react';
import { useTable } from 'react-table';
import { addItem, deleteItem, editItem, getItems, sellProduct } from '../api';
import FormProductModal from './FormProductModal';
import styles from './App.module.css';
import SellProductModal from './SellProductModal';

export default function App() {
  const [formProduct, setFormProduct] = useState(null);
  const [items, setItems] = useState<any[]>([]);
  const [productToSell, setProductToSell] = useState(null);

  const handleSetItems = async () => {
    setItems(await getItems());
  };

  useEffect(() => {
    handleSetItems();
  }, []);

  const handleAddEditProduct = async (item: any) => {
    if (item?.id) await editItem(item);
    else await addItem(item);

    await handleSetItems();
  };

  const handleDeleteItem = async (item: any) => {
    if (confirm(`Seguro que quieres eliminar el producto ${item.name}?`)) {
      await deleteItem(item.id);
      return handleSetItems();
    }
  };

  const handleSellProduct = async (data: any) => {
    await sellProduct(data);
    return handleSetItems();
  };

  const columns = React.useMemo(
    () => [
      { Header: 'Producto', accessor: 'name' },
      { Header: 'Descripción', accessor: 'description' },
      { Header: 'Precio', accessor: 'price' },
      { Header: 'Unidades disponibles', accessor: 'availableUnits' },
      { Header: 'Vendidos hoy' },
      { Header: 'Vendidos total' },
      {
        Header: 'Acciones',
        Cell: ({ row }: any) => {
          return (
            <div className={styles.tableActionBtns}>
              <button
                title="Editar"
                onClick={() => setFormProduct(row.original)}
              >
                ✏️
              </button>
              <button
                title="Vender"
                onClick={() => setProductToSell(row.original)}
              >
                💰
              </button>
              <button
                title="Eliminar"
                onClick={() => handleDeleteItem(row.original)}
              >
                🗑️
              </button>
            </div>
          );
        },
      },
    ],
    []
  );

  const data = React.useMemo(() => items, [items]);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable({ columns, data });

  return (
    <div className={styles.container}>
      <div className={styles.topNav}>
        <form
          onSubmit={(e) => {
            e.preventDefault();
          }}
        >
          <input placeholder="Ej. alcohol 120ml" type="text" />
          <button>Buscar</button>
        </form>

        <button
          className={styles.topNavAddBtn}
          onClick={() => setFormProduct({})}
        >
          Agregar producto
        </button>
      </div>

      <div className={styles.tableContainer}>
        <table className={styles.table} {...getTableProps()}>
          <thead>
            {headerGroups.map((headerGroup: any) => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column: any) => (
                  <th {...column.getHeaderProps()}>
                    {column.render('Header')}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {rows.map((row: any) => {
              prepareRow(row);
              return (
                <tr {...row.getRowProps()}>
                  {row.cells.map((cell: any) => {
                    return (
                      <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <FormProductModal
        product={formProduct}
        onSubmit={handleAddEditProduct}
        onRequestClose={() => setFormProduct(null)}
      />

      <SellProductModal
        product={productToSell}
        onSubmit={handleSellProduct}
        onRequestClose={() => setProductToSell(null)}
      />
    </div>
  );
}
