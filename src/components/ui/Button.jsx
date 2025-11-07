// src/components/ui/Button.jsx
import React from 'react';
import styles from './global-styles.module.css'; // Use global styles

function Button({ variant = 'primary', onClick, children, type = 'button', ...props }) {
    const className = `${styles.btn} ${variant === 'secondary' ? styles.btnSecondary : styles.btnPrimary}`;
    
    return (
        <button 
            type={type} 
            className={className} 
            onClick={onClick}
            {...props}
        >
            {children}
        </button>
    );
}
export default Button;