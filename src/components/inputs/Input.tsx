import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
}

export const Input: React.FC<InputProps> = ({ label, error, style, ...props }) => {
    return (
        <div style={{ marginBottom: '16px', width: '100%' }}>
            {label && (
                <label style={{
                    display: 'block',
                    marginBottom: '8px',
                    fontSize: 'var(--text-sm)',
                    fontWeight: 500,
                    color: 'var(--color-text-secondary)'
                }}>
                    {label}
                </label>
            )}
            <input
                style={{
                    width: '100%',
                    padding: '12px 16px',
                    borderRadius: 'var(--radius-sm)',
                    border: error ? '1px solid var(--color-error)' : '1px solid #e2e8f0',
                    fontSize: 'var(--text-base)',
                    outline: 'none',
                    transition: 'border-color 0.2s',
                    background: 'var(--color-surface)',
                    ...style,
                }}
                {...props}
            />
            {error && (
                <span style={{
                    display: 'block',
                    marginTop: '4px',
                    fontSize: 'var(--text-xs)',
                    color: 'var(--color-error)'
                }}>
                    {error}
                </span>
            )}
        </div>
    );
};
