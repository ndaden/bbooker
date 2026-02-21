interface Prestation {
  name: string;
  description: string;
  durationInMinutes: string;
  price: string;
}

export const businessValidation = (prestations: Prestation[]) => {
  const fieldName = `prestations[${prestations.length}]`;
  return {
  businessName: {
    required: { value: true, message: "Veuillez saisir la raison sociale." },
  },
  businessDescription: {
    required: {
      value: true,
      message: "Veuillez saisir la description de votre centre.",
    },
  },
  businessImage: {
    required: {
      value: true,
      message:
        "Ajoutez une photo de votre centre afin d'améliorer sa visibilité sur Beauty Booker",
    },
  },
  [fieldName + '.name']: {
    required: {
      value: true,
      message: "Veuillez saisir le libellé de prestation.",
    },
  },
  [fieldName + '.description']: {
    required: {
      value: true,
      message: "Veuillez saisir la description de la prestation.",
    },
  },
  [fieldName + '.durationInMinutes']: {
    required: {
      value: true,
      message: "Veuillez saisir la durée de la prestation en minutes.",
    },
  },
  [fieldName + '.price']: {
    required: { value: true, message: "Veuillez saisir le tarif." },
  },
  };
};
