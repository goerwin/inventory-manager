import React, { ChangeEvent, useEffect, useState } from 'react';
import Modal from 'react-modal';
import NumberFormat from 'react-number-format';
import { getOrders } from '../api';
import styles from './modal.module.css';
import format from 'date-fns/fp/format';
import subDays from 'date-fns/fp/subDays';
import startOfDay from 'date-fns/fp/startOfDay';
import endOfDay from 'date-fns/fp/endOfDay';
import addMinutes from 'date-fns/fp/addMinutes';

const gCurrDate = new Date();
const gCurrTzOs = gCurrDate.getTimezoneOffset();
const gEndDate = gCurrDate;

export interface Props {
  isOpen: boolean;
  onRequestClose: () => void;
  [x: string]: any;
}

export default function OrdersModal({
  isOpen,
  onRequestClose,
  ...props
}: Props) {
  if (!isOpen) {
    return null;
  }

  const [ordersRes, setOrdersRes] = useState<any>([]);
  const [dateRange, setDateRange] = useState({
    startDate: format('yyyy-MM-dd', gCurrDate),
    endDate: format('yyyy-MM-dd', gEndDate),
    range: 'today',
  });

  const handleRangeChange = (evt: ChangeEvent<HTMLSelectElement>) => {
    const range = evt.target.value;

    if (!range) return;

    let startDate = '';
    let endDate = format('yyyy-MM-dd', gEndDate);

    if (range === 'today') {
      startDate = format('yyyy-MM-dd', gCurrDate);
    } else if (range === 'last7days') {
      startDate = format('yyyy-MM-dd', subDays(7, gEndDate));
    } else if (range === 'last30days') {
      startDate = format('yyyy-MM-dd', subDays(30, gEndDate));
    } else {
      endDate = '';
    }

    setDateRange({ range, startDate, endDate });
  };

  const handleInputDateChange = (
    type: string,
    evt: ChangeEvent<HTMLInputElement>
  ) => {
    setDateRange({ ...dateRange, range: '', [type]: evt.target.value } as any);
  };

  useEffect(() => {
    const { startDate, endDate } = dateRange;

    const parsedStartDate =
      (startDate && startOfDay(addMinutes(gCurrTzOs, new Date(startDate)))) ||
      undefined;
    const parsedEndDate =
      (endDate && endOfDay(addMinutes(gCurrTzOs, new Date(endDate)))) ||
      undefined;

    getOrders({
      startDate: parsedStartDate,
      endDate: parsedEndDate,
    }).then((ordersRes) => setOrdersRes(ordersRes));
  }, [dateRange]);

  if (!ordersRes) {
    return null;
  }

  return (
    <Modal
      isOpen={isOpen}
      ariaHideApp={false}
      className={styles.modal + ' ' + styles.modalSells}
      overlayClassName={styles.modalOverlay}
      onRequestClose={onRequestClose}
      {...props}
    >
      <button className={styles.modalCloseBtn} onClick={onRequestClose}>
        <i className="icons icons-close" />
      </button>
      <h2>Ventas</h2>
      <form>
        <label className={styles.smallSize}>
          <b>Fecha inicio:</b>
          <input
            value={dateRange.startDate}
            type="date"
            onChange={handleInputDateChange.bind(null, 'startDate')}
          />
        </label>
        <label className={styles.smallSize}>
          <b>Fecha final:</b>
          <input
            value={dateRange.endDate}
            type="date"
            onChange={handleInputDateChange.bind(null, 'endDate')}
          />
        </label>
        <label className={styles.smallSize}>
          <b>Rango de fechas:</b>
          <select value={dateRange.range} onChange={handleRangeChange}>
            <option value=""></option>
            <option value="today">Hoy</option>
            <option value="last7days">Últimos 7 días</option>
            <option value="last30days">Últimos 30 días</option>
            <option value="all">Todo</option>
          </select>
        </label>
      </form>
      <p style={{ fontSize: 18, marginBottom: 10 }}>
        <b>Precio total en el rango: </b>
        <NumberFormat
          value={ordersRes.totalPrice}
          prefix="$"
          displayType="text"
        />
      </p>

      <div>
        <table>
          <thead>
            <tr>
              <th>Producto</th>
              <th>Vendidos</th>
              <th>Precio unidad</th>
              <th>Precio total</th>
              <th>Fecha</th>
            </tr>
          </thead>
          <tbody>
            {ordersRes.orders?.map((order: any) => (
              <tr key={order.id}>
                <td>{order.item?.name}</td>
                <td>{order.quantity}</td>
                <td>
                  <NumberFormat
                    value={order.unitPrice}
                    prefix="$"
                    displayType="text"
                  />
                </td>
                <td>
                  <NumberFormat
                    value={order.unitPrice * order.quantity}
                    prefix="$"
                    displayType="text"
                  />
                </td>
                <td>{format('yyyy-MM-dd HH:mm', order.createdAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Modal>
  );
}
