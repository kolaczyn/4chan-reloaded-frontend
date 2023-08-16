export const isTripcodeValid = (tripcode: string) => {
  const [name, password] = tripcode.split("#");
  return name?.length > 0 && password?.length > 0;
};
