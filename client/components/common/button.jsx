export const Button = ({ children, ...other }) => {
  return (
    <button className="lantern" {...other}>
      {children}
    </button>
  );
};