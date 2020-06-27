// without this mock we get this warning in unit tests:
// "Warning: An invalid container has been provided. This may indicate that another renderer is being used in addition to the test renderer"

// @ts-ignore
export const Modal = ({children}) => children;
