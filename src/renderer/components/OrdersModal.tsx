import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import Modal from 'react-modal';
import NumberFormat from 'react-number-format';
import { getOrders } from '../api';
import styles from './modal.module.css';

export interface Props {
  onRequestClose: () => void;
  [x: string]: any;
}

export default function OrdersModal({
  onSubmit,
  onRequestClose,
  ...props
}: Props) {
  const { handleSubmit, register, reset } = useForm();
  const [ordersRes, setOrdersRes] = useState<any>([]);

  useEffect(() => {
    getOrders({
      startDate: new Date('2021-01-24T03:15:04.000Z'),
      endDate: new Date('2021-01-24T03:20:04.000Z'),
    }).then((ordersRes) => setOrdersRes(ordersRes));
  }, []);

  const handleFormSubmit = (data: any) => {
    onRequestClose();
    onSubmit(data);
  };

  if (!ordersRes) {
    return null;
  }

  return (
    <Modal
      isOpen={true}
      ariaHideApp={false}
      className={styles.modal}
      overlayClassName={styles.modalOverlay}
      onRequestClose={onRequestClose}
      {...props}
    >
      <button className={styles.modalCloseBtn} onClick={onRequestClose}>
        ❌
      </button>
      <h2>Ventas</h2>
      <form>
        <label>
          <b>Fecha inicio: </b> <input type="date" />
        </label>
        <label>
          <b>Fecha final: </b> <input type="date" />
        </label>
      </form>
      <p>
        <b>Precio total: </b>
        <NumberFormat
          value={ordersRes.totalPrice}
          prefix="$"
          displayType="text"
        />
      </p>
      <table>
        <thead>
          <tr>
            <th>Producto</th>
            <th>Precio unidad</th>
            <th>Cantidad Vendidos</th>
            <th>Fecha</th>
          </tr>
        </thead>
        <tbody>
          {ordersRes.orders?.map((order: any) => (
            <tr key={order.id}>
              <td>{order.item?.name}</td>
              <td>{order.unitPrice}</td>
              <td>{order.quantity}</td>
              <td>{order.createdAt.toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </Modal>
  );
}
