import { Toaster as Sonner, toast } from "sonner";

const Toaster = (props) => {
  return (
    <Sonner
      theme="dark"
      className="toaster group"
      {...props}
    />
  );
};

export { Toaster, toast };