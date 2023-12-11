import { Input } from "@nextui-org/input";

const QInput = ({
  type,
  label,
  placeholder,
  variant,
  color,
  className,
  onChange,
}) => {
  return (
    <Input
      type={type}
      label={label}
      placeholder={placeholder}
      variant={variant}
      color={color}
      className={className}
      onChange={onChange}
    />
  );
};

export default QInput;
