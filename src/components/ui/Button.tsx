import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
    fullWidth?: boolean;
    isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
    children,
    variant = 'primary',
    size = 'md',
    fullWidth = false,
    isLoading = false,
    style,
    ...props
}) => {
    const baseStyles: React.CSSProperties = {
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: 500,
        borderRadius: 'var(--radius-full)',
        transition: 'var(--transition-fast)',
        opacity: props.disabled || isLoading ? 0.7 : 1,
        cursor: props.disabled || isLoading ? 'not-allowed' : 'pointer',
        width: fullWidth ? '100%' : 'auto',
    };

    const variants = {
        primary: {
            background: 'var(--color-accent)',
            color: 'var(--color-primary)',
        },
        secondary: {
            background: 'transparent',
            border: '1px solid var(--color-text-secondary)',
            color: 'var(--color-text-main)',
        },
        ghost: {
            background: 'transparent',
            color: 'var(--color-text-main)',
        },
    };

    const sizes = {
        sm: { padding: '8px 16px', fontSize: 'var(--text-xs)' },
        md: { padding: '12px 24px', fontSize: 'var(--text-sm)' },
        lg: { padding: '16px 32px', fontSize: 'var(--text-base)' },
    };

    return (
        <button
            style={{
                ...baseStyles,
                ...variants[variant],
                ...sizes[size],
                ...style,
            }}
            disabled={props.disabled || isLoading}
            {...props}
        >
            {isLoading ? '...' : children}
        </button>
    );
};
