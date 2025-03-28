import React from "react";

/**
 * Interface for component props with JSDoc documentation
 */
interface ExampleProps {
  /** The primary content of the component */
  children: React.ReactNode;
  /** Optional CSS class name */
  className?: string;
  /** Callback function triggered on click */
  onClick?: (event: React.MouseEvent<HTMLDivElement>) => void;
  /** Whether the component is disabled */
  disabled?: boolean;
}

/**
 * Example component demonstrating JSDoc commenting standards
 *
 * @component
 * @example
 * // Basic usage
 * <ExampleComponent>Hello World</ExampleComponent>
 *
 * @example
 * // With custom className and click handler
 * <ExampleComponent
 *   className="custom-class"
 *   onClick={(e) => console.log('Clicked', e)}
 * >
 *   Click Me
 * </ExampleComponent>
 */
export const ExampleComponent: React.FC<ExampleProps> = ({
  children,
  className = "",
  onClick,
  disabled = false,
}) => {
  /**
   * Handles the click event
   *
   * @param {React.MouseEvent<HTMLDivElement>} event - The click event
   * @returns {void}
   */
  const handleClick = (event: React.MouseEvent<HTMLDivElement>): void => {
    if (!disabled && onClick) {
      onClick(event);
    }
  };

  return (
    <div
      className={`example-component ${className} ${disabled ? "disabled" : ""}`}
      onClick={handleClick}
      role="button"
      tabIndex={disabled ? -1 : 0}
    >
      {children}
    </div>
  );
};

export default ExampleComponent;
