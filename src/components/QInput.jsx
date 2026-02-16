import { Input } from "@heroui/input";

const QInput = ({
  type,
  label,
  placeholder,
  variant,
  color,
  className,
  onChange,
  endContent,
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
      endContent={endContent}
    />
  );
};

export default QInput;
