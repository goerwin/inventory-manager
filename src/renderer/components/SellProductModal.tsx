import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import Modal from 'react-modal';
import styles from './modal.module.css';
import NumberFormat from 'react-number-format';

export interface Props {
  product: any;
  onRequestClose: () => void;
  onSubmit: (data: any) => void;
  [x: string]: any;
}

export default function SellProductModal({
  onSubmit,
  onRequestClose,
  ...props
}: Props) {
  const { handleSubmit, register, reset, watch } = useForm();

  useEffect(() => {
    reset({
      ...props.product,
      id: undefined,
      itemId: props.product?.id,
      quantity: 1,
    });
  }, [props.product]);

  const handleFormSubmit = (data: any) => {
    onRequestClose();
    onSubmit(data);
  };

  const watchQuantity = watch('quantity');
  const watchPrice = watch('price');

  if (!props.product) {
    return null;
  }

  return (
    <Modal
      isOpen={Boolean(props.product)}
      ariaHideApp={false}
      className={styles.modal}
      overlayClassName={styles.modalOverlay}
      onRequestClose={onRequestClose}
      {...props}
    >
      <button className={styles.modalCloseBtn} onClick={onRequestClose}>
        X
      </button>
      <h2>Vender producto</h2>
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <input type="hidden" name="itemId" ref={register} />

        <label>
          <b>Nombre: </b>
          <span>{props.product.name}</span>
        </label>
        <label>
          <b>Descripción: </b>
          <span>{props.product.description}</span>
        </label>
        <label>
          <b>Unidades disponibles: </b>
          <span>{props.product.availableUnits}</span>
        </label>
        <label>
          <b>Precio unidad: </b>
          <input
            type="number"
            name="price"
            ref={register({ required: true })}
          />
        </label>
        <label>
          <b>Cantidad: </b>
          <input
            type="number"
            name="quantity"
            autoFocus
            ref={register({ required: true })}
          />
        </label>
        <label>
          <b>Precio total: </b>
          <NumberFormat
            style={{ fontSize: 36 }}
            value={watchPrice * watchQuantity}
            prefix="$"
            displayType="text"
          />
        </label>
        <button>Vender</button>
      </form>
    </Modal>
  );
}
