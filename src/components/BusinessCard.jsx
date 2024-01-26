import { Button, Card, CardBody, Chip, Image, Spacer } from "@nextui-org/react";
import { BsClock } from "react-icons/bs";
import { useNavigate } from "react-router-dom";

const BusinessCard = ({ id, name, description }) => {
  const navigate = useNavigate();
  const goToBusiness = () => {
    navigate(`/business/${id}`);
  };
  return (
    <Card
      isBlurred
      isPressable
      isHoverable
      className="border-none bg-background/60 dark:bg-default-100/50 max-w-100 my-3 hover:scale-105"
      shadow="sm"
      onClick={goToBusiness}
    >
      <CardBody>
        <div className="grid grid-cols-6 md:grid-cols-12 gap-6 md:gap-4 items-center justify-center">
          <div className="relative col-span-6 md:col-span-3 h-[200px]">
            <Image
              removeWrapper
              alt={name}
              className="object-cover z-0 w-full h-full"
              shadow="md"
              src="/images/topform_banner.jpg"
            />
          </div>

          <div className="flex flex-col col-span-6 md:col-span-6">
            <div className="flex justify-between items-start">
              <div className="flex flex-col gap-0">
                <h1 className="text-large font-medium mt-2">{name}</h1>
                <h3 className="font-semibold text-foreground/90">
                  {description}
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
          </div>
        </div>
      </CardBody>
    </Card>
  );
};

export default BusinessCard;
