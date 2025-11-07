// src/components/ui/Input.jsx
import React from 'react';
import styles from './global-styles.module.css';

function Input({ label, name, type = 'text', value, onChange, required = false, ...props }) {
    return (
        <div className={styles.inputGroup}>
            {label && <label htmlFor={name}>{label}</label>}
            <input
                id={name}
                name={name}
                type={type}
                value={value}
                onChange={onChange}
                required={required}
                className={styles.inputField}
                {...props}
            />
        </div>
    );
}
export default Input;