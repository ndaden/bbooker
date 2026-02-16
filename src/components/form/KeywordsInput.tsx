import React, { useState } from "react";
import { Input, Chip, Button } from "@heroui/react";
import { Control, Controller, FieldErrors, FieldValues } from "react-hook-form";

interface KeywordsInputProps<T extends FieldValues = FieldValues> {
  control: Control<T>;
  errors: FieldErrors<T>;
  keywords: string[];
  onAddKeyword: (keyword: string) => void;
  onRemoveKeyword: (keyword: string) => void;
}

const KeywordsInput: React.FC<KeywordsInputProps> = ({
  control,
  errors,
  keywords,
  onAddKeyword,
  onRemoveKeyword,
}) => {
  const [inputValue, setInputValue] = useState("");

  const handleAddKeyword = () => {
    const trimmedValue = inputValue.trim();
    if (trimmedValue && !keywords.includes(trimmedValue)) {
      onAddKeyword(trimmedValue);
      setInputValue("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddKeyword();
    }
  };

  return (
    <div>
      <div className="mb-3">
        <Controller
          name="keywords"
          control={control}
          render={({ field }) => (
            <div>
              <div className="flex gap-2">
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ajouter un mot-clé (ex: coiffure, beauté, massage)"
                  size="sm"
                  className="flex-1"
                />
                <Button
                  onClick={handleAddKeyword}
                  size="sm"
                  color="primary"
                  type="button"
                >
                  Ajouter
                </Button>
              </div>
              {errors.keywords && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.keywords.message as string}
                </p>
              )}
            </div>
          )}
        />
      </div>

      {keywords.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {keywords.map((keyword, index) => (
            <Chip
              key={`${keyword}-${index}`}
              onClose={() => onRemoveKeyword(keyword)}
              variant="flat"
              color="primary"
              className="cursor-pointer"
            >
              {keyword}
            </Chip>
          ))}
        </div>
      )}

      <p className="text-sm text-gray-500 mt-2">
        Ajoutez des mots-clés pour décrire votre activité (ex: coiffure, barbier, massage, esthétique)
      </p>
    </div>
  );
};

export default KeywordsInput;
