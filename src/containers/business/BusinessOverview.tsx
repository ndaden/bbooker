import React from "react";

const BusinessOverview = ({ data }) => {
  return (
    <div>
      <div>Vérifiez les informations puis appuyez sur Finaliser et Créer</div>
      <div>{JSON.stringify(data, null, 100)}</div>
    </div>
  );
};

export default BusinessOverview;
