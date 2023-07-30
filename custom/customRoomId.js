exports.getRoomId = () => {
  const id = 1000 + Math.floor(Math.random() * 8999);
  return `${id}`;
};