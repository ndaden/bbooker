import { Button, Card, CardBody, Chip, Image, Spacer } from "@nextui-org/react";
import { BsClock } from "react-icons/bs";
import { useNavigate } from "react-router-dom";

const BusinessCard = ({
  id,
  name,
  description,
  image,
  growOnHover,
  isOwner,
}) => {
  const navigate = useNavigate();
  const goToBusiness = () => {
    navigate(`/business/${id}`);
  };

  const goToConfigureCalendar = () => {
    navigate(`/business/${id}/calendar`);
  };

  const truncate = (str, n, useWordBoundary) => {
    if (str.length <= n) {
      return str;
    }
    const subString = str.slice(0, n - 1); // the original check
    return useWordBoundary
      ? subString.slice(0, subString.lastIndexOf(" "))
      : subString;
  };

  return (
    <Card
      isBlurred
      isPressable={!isOwner}
      isHoverable
      className={`border-none bg-background/60 dark:bg-default-100/50 max-w-100 my-3 ${
        growOnHover && "hover:scale-105"
      }`}
      shadow="sm"
      onClick={isOwner ? () => {} : goToBusiness}
    >
      <CardBody>
        <div className="grid grid-cols-6 md:grid-cols-12 gap-6 md:gap-4 items-center justify-center">
          <div className="relative col-span-6 md:col-span-3 h-[200px]">
            <Image
              removeWrapper
              alt={name}
              className="object-cover z-0 w-full h-full"
              shadow="md"
              src={image}
            />
          </div>

          <div className="flex flex-col col-span-6 md:col-span-6">
            <div className="flex justify-between items-start">
              <div className="flex flex-col gap-0">
                <h1 className="text-large font-medium mt-2">{name}</h1>
                <h3 className="font-semibold text-foreground/90">
                  {truncate(description, 150, true)}...
                </h3>
                <div className="my-3 flex">
                  <Chip>Massage</Chip>
                  <Spacer x={2} />
                  <Chip>Onglerie</Chip>
                  <Spacer x={2} />
                  <Chip>Soins visage</Chip>
                </div>
                <div className="flex items-center">
                  <BsClock className="mr-3" /> Du lundi au vendredi de 10h à 19h
                </div>
              </div>
            </div>
            {isOwner && (
              <div className="my-4 md:flex md:flex-row md:items-baseline">
                <div className="mx-1">
                  <Button
                    color="primary"
                    onClick={goToConfigureCalendar}
                    fullWidth
                  >
                    Configurer le calendrier
                  </Button>
                </div>
                <div className="mt-2 mx-1">
                  <Button color="danger" variant="solid" fullWidth>
                    Supprimer
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </CardBody>
    </Card>
  );
};

export default BusinessCard;
