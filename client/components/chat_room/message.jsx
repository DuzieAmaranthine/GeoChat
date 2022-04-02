export const Message = ({ message }) => {
  return (
    <div className="message">
      <div className="user-name">{message.userName}: </div>
      {message.contents}
    </div>
  );
};