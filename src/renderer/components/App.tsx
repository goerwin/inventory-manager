import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import NumberFormat from 'react-number-format';
import { useMutation } from 'react-query';
import { useSortBy, useTable } from 'react-table';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  addItem,
  deleteItem,
  editItem,
  getItems,
  saveDatabase,
  searchProducts,
  sellProduct,
} from '../api';
import styles from './App.module.css';
import FormProductModal from './FormProductModal';
import OrdersModal from './OrdersModal';
import SellProductModal from './SellProductModal';

export default function App() {
  const { isLoading: databaseIsLoading, mutate: mutateDatabase } = useMutation(
    () =>
      saveDatabase()
        .then((data) =>
          toast.success(`Base de datos enviada a ${data.accepted.join(',')}`)
        )
        .catch((e) => toast.error(`Ocurrió un error. ${e.message}`))
  );
  const [formProduct, setFormProduct] = useState<any>(null);
  const [items, setItems] = useState<any[]>([]);
  const [productToSell, setProductToSell] = useState(null);
  const [isOrdersModalOpen, setIsOrdersModalOpen] = useState(false);
  const { register, handleSubmit } = useForm();

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
    toast.success('Producto agregado/modificado');
  };

  const handleDeleteItem = async (item: any) => {
    if (confirm(`Seguro que quieres eliminar el producto ${item.name}?`)) {
      await deleteItem(item.id);
      toast.success('Producto eliminado');

      return handleSetItems();
    }
  };

  const handleSellProduct = async (data: any) => {
    await sellProduct(data);
    toast.success('Producto vendido');
    return handleSetItems();
  };

  const handleSearchFormSubmit = async (data: any) => {
    const products = await searchProducts(data.search?.trim());
    setItems(products);
  };

  const columns = React.useMemo(
    () => [
      { Header: 'Producto', accessor: 'name' },
      { Header: 'Descripción', accessor: 'description' },
      { Header: 'Precio', accessor: 'price', id: 'price' },
      { Header: 'Unidades disponibles', accessor: 'availableUnits' },
      {
        Header: 'Acciones',
        Cell: ({ row }: any) => {
          return (
            <div className={styles.tableActionBtns}>
              <button
                className="is-icon"
                title="Editar"
                onClick={() => setFormProduct(row.original)}
              >
                <i className="icons icons-pen" />
              </button>
              <button
                className="is-icon"
                title="Vender"
                style={{ backgroundColor: 'green', minWidth: 40 }}
                onClick={() => setProductToSell(row.original)}
              >
                <i className="icons icons-money" />
              </button>
              <button
                className="is-icon"
                title="Eliminar"
                onClick={() => handleDeleteItem(row.original)}
              >
                <i className="icons icons-delete" />
              </button>
            </div>
          );
        },
      },
    ],
    []
  );

  const tableData = React.useMemo(() => items, [items]);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable(
    {
      columns,
      data: tableData,
      initialState: { sortBy: [{ id: 'name', desc: false }] },
    },
    useSortBy // TODO: Sorting should be done serverside
  );

  return (
    <div className={styles.container}>
      <div className={styles.topNav}>
        <form onSubmit={handleSubmit(handleSearchFormSubmit)}>
          <input
            placeholder="Ej. alcohol 120ml"
            type="text"
            name="search"
            ref={register}
          />
          <button>Buscar</button>
        </form>

        <div className={styles.topNavBtns}>
          <button onClick={() => setFormProduct({})}>Agregar producto</button>
          <button onClick={() => setIsOrdersModalOpen(true)}>Ver ventas</button>
          <button onClick={() => mutateDatabase()} disabled={databaseIsLoading}>
            {databaseIsLoading ? 'Enviando...' : 'Enviar base de datos'}
          </button>
        </div>
      </div>

      <div className={styles.tableContainer}>
        <table className={styles.table} {...getTableProps()}>
          <thead>
            {headerGroups.map((headerGroup: any) => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column: any) => (
                  <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                    {column.render('Header')}
                    <span>
                      {column.isSorted
                        ? column.isSortedDesc
                          ? ' ˅'
                          : ' ˄'
                        : ''}
                    </span>
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
                      <td {...cell.getCellProps()}>
                        {cell.column?.id === 'price' ? (
                          <NumberFormat
                            value={cell.value}
                            prefix="$"
                            displayType="text"
                          />
                        ) : (
                          cell.render('Cell')
                        )}
                      </td>
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

      <OrdersModal
        isOpen={isOrdersModalOpen}
        onRequestClose={() => setIsOrdersModalOpen(false)}
      />

      <ToastContainer position="bottom-center" />
    </div>
  );
}
