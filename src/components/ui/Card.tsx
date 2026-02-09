import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
    noPadding?: boolean;
}

export const Card: React.FC<CardProps> = ({
    children,
    noPadding = false,
    style,
    ...props
}) => {
    return (
        <div
            style={{
                background: 'var(--color-surface-alt)',
                borderRadius: 'var(--radius-md)',
                boxShadow: 'var(--shadow-sm)',
                padding: noPadding ? 0 : 'var(--space-4)',
                ...style,
            }}
            {...props}
        >
            {children}
        </div>
    );
};
