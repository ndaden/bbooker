export const businessValidation = (prestations) => ({
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
  [`prestations[${prestations.length}].name`]: {
    required: {
      value: true,
      message: "Veuillez saisir le libellé de prestation.",
    },
  },
  [`prestations[${prestations.length}].description`]: {
    required: {
      value: true,
      message: "Veuillez saisir la description de la prestation.",
    },
  },
  [`prestations[${prestations.length}].durationInMinutes`]: {
    required: {
      value: true,
      message: "Veuillez saisir la durée de la prestation en minutes.",
    },
  },
  [`prestations[${prestations.length}].price`]: {
    required: { value: true, message: "Veuillez saisir le tarif." },
  },
});
