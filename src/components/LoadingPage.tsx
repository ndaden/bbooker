import React, { useEffect, useState } from "react";
import Container from "./Container";
import { Button, CircularProgress } from "@heroui/react";

const LoadingPage = () => {
  const [displayTooLongBtn, setDisplayTooLongBtn] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setDisplayTooLongBtn(true);
    }, 5000);
  }, []);

  return (
    <Container>
      <div className="h-screen flex flex-col items-center justify-center">
        <CircularProgress size="lg" color="warning" />

        <div className="my-4">Un petit instant s'il vous plaît...</div>

        {displayTooLongBtn && (
          <div>
            <Button color="warning" variant="light" size="md">
              C'est trop long ? Cliquez ici
            </Button>
          </div>
        )}
      </div>
    </Container>
  );
};

export default LoadingPage;
