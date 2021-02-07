import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import Modal from 'react-modal';
import styles from './modal.module.css';

export interface Props {
  product: any;
  onRequestClose: () => void;
  onSubmit: (data: any) => void;
  [x: string]: any;
}

export default function FormProductModal({
  onSubmit,
  onRequestClose,
  ...props
}: Props) {
  const { handleSubmit, register, reset } = useForm();

  useEffect(() => {
    reset(props.product);
  }, [props.product]);

  const handleFormSubmit = (data: any) => {
    onRequestClose();
    onSubmit(data);
  };

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
        <i className="icons icons-close" />
      </button>
      <h2>{props.product?.id ? 'Editar' : 'Agregar'} producto</h2>
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <input type="hidden" name="id" ref={register} />
        <label className={styles.smallSize}>
          <b>Nombre: </b>
          <input
            type="text"
            name="name"
            autoFocus
            ref={register({ required: true })}
          />
        </label>
        <label className={styles.smallSize}>
          <b>Descripción: </b>
          <input
            type="text"
            name="description"
            ref={register({ required: true })}
          />
        </label>
        <label>
          <b>Precio: </b>
          <input
            type="number"
            name="price"
            ref={register({ required: true })}
          />
        </label>
        <label>
          <b>Unidades disponibles: </b>
          <input
            type="number"
            name="availableUnits"
            ref={register({ required: true })}
          />
        </label>
        <button>Aceptar</button>
      </form>
    </Modal>
  );
}
