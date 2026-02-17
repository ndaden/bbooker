import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  Chip,
  Divider,
} from "@heroui/react";
import Container from "../components/Container";
import { BsCheck, BsStarFill, BsLightningFill, BsRocketFill } from "react-icons/bs";

interface PricingPlan {
  name: string;
  icon: React.ReactNode;
  description: string;
  price: string;
  priceLabel: string;
  features: string[];
  recommended?: boolean;
  color: "default" | "primary" | "secondary";
}

const Pricing: React.FC = () => {
  const navigate = useNavigate();

  const plans: PricingPlan[] = [
    {
      name: "Base",
      icon: <BsCheck className="text-3xl" />,
      description:
        "Vous permet de découvrir Bbooker et de vous familiariser avec les fonctionnalités",
      price: "Gratuit",
      priceLabel: "pour toujours",
      features: [
        "Création d'un établissement",
        "Gestion des rendez-vous",
        "Limité à 50 rendez-vous par mois",
      ],
      color: "default",
    },
    {
      name: "Pro",
      icon: <BsLightningFill className="text-3xl" />,
      description:
        "Vous avez un business actif et vous souhaitez mieux gérer vos rendez-vous",
      price: "29€",
      priceLabel: "par mois",
      features: [
        "Toutes les fonctionnalités Base",
        "Rendez-vous illimités",
        "Accompagnement pour la configuration",
      ],
      color: "primary",
    },
    {
      name: "Maxi",
      icon: <BsRocketFill className="text-3xl" />,
      description:
        "Vous souhaitez intégrer BeautyBooker au cœur de la gestion de votre business",
      price: "99€",
      priceLabel: "par mois",
      features: [
        "Toutes les fonctionnalités Pro",
        "Intégration de la facturation",
        "Accompagnement prioritaire à tous les niveaux",
      ],
      recommended: true,
      color: "secondary",
    },
  ];

  const handleGetStarted = (planName: string) => {
    if (planName === "Base") {
      navigate("/new-business");
    } else {
      navigate("/signup");
    }
  };

  return (
    <Container>
      <div className="max-w-6xl mx-auto py-8 px-4 font-onest">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Nos Formules</h1>
          <p className="text-lg text-default-500 max-w-2xl mx-auto">
            Choisissez la formule qui correspond le mieux à vos besoins. 
            Commencez gratuitement et évoluez selon la croissance de votre business.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="flex flex-col md:flex-row gap-6 lg:gap-8 items-stretch justify-center">
          {plans.map((plan) => (
            <Card
              key={plan.name}
              className={`relative border-2 transition-all duration-300 flex-1 w-full md:max-w-[380px] flex flex-col min-h-[550px] ${
                plan.recommended
                  ? "border-warning bg-warning/5 shadow-xl z-10"
                  : "border-default-200 hover:border-primary hover:scale-105"
              }`}
            >
              <CardBody className="p-8 flex flex-col flex-grow">
                {/* Plan Header */}
                <div className="text-center mb-6">
                  <div
                    className={`inline-flex p-4 rounded-full mb-4 ${
                      plan.recommended
                        ? "bg-warning/20 text-warning"
                        : plan.color === "primary"
                        ? "bg-primary/20 text-primary"
                        : "bg-default-100 text-default-500"
                    }`}
                  >
                    {plan.icon}
                  </div>
                  <h2 className="text-2xl font-bold mb-2">{plan.name}</h2>
                  
                  {/* Recommended Badge - under the name */}
                  {plan.recommended && (
                    <div className="mt-2 mb-3">
                      <Chip
                        color="warning"
                        size="md"
                        startContent={<BsStarFill />}
                        className="font-bold shadow-md"
                      >
                        Recommandé
                      </Chip>
                    </div>
                  )}
                  
                  <p className="text-base text-default-500 min-h-[40px]">
                    {plan.description}
                  </p>
                </div>

                {/* Price */}
                <div className="text-center mb-8 h-20 flex flex-col justify-center">
                  <span className="text-4xl md:text-5xl font-extrabold">{plan.price}</span>
                  <span className="text-default-400 text-sm mt-2">
                    {plan.priceLabel}
                  </span>
                </div>

                <Divider className="my-4" />

                {/* Features */}
                <ul className="space-y-3 flex-grow">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <BsCheck
                        className={`text-xl flex-shrink-0 mt-0.5 ${
                          plan.recommended ? "text-warning" : "text-success"
                        }`}
                      />
                      <span className="text-base">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardBody>

              <CardFooter className="p-8 pt-6 flex justify-center">
                <Button
                  color={plan.recommended ? "warning" : plan.color}
                  variant={plan.name === "Base" ? "bordered" : "solid"}
                  size="lg"
                  onClick={() => handleGetStarted(plan.name)}
                  className={`${plan.recommended ? "font-bold" : ""} my-2 px-12 min-w-[200px]`}
                >
                  {plan.name === "Base" ? "Commencer gratuitement" : "Choisir cette formule"}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* Trust Indicators */}
        <div className="mt-16 text-center">
          <p className="text-default-400 text-sm mb-4">
            Rejoint par des milliers de professionnels de la beauté
          </p>
          <div className="flex justify-center items-center gap-8 text-default-300">
            <div className="flex items-center gap-2">
              <BsCheck className="text-success" />
              <span className="text-sm">Sans engagement</span>
            </div>
            <div className="flex items-center gap-2">
              <BsCheck className="text-success" />
              <span className="text-sm">Annulation à tout moment</span>
            </div>
            <div className="flex items-center gap-2">
              <BsCheck className="text-success" />
              <span className="text-sm">Support client 7j/7</span>
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default Pricing;
