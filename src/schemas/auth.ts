import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "L'email est requis")
    .email("Veuillez saisir un email valide"),
  password: z.string().min(1, "Le mot de passe est requis"),
});

export const signupSchema = z
  .object({
    email: z
      .string()
      .min(1, "L'email est requis")
      .email("Veuillez saisir un email valide"),
    password: z
      .string()
      .min(8, "Le mot de passe doit contenir au moins 8 caractères")
      .regex(/[A-Z]/, "Au moins une majuscule requise")
      .regex(/[a-z]/, "Au moins une minuscule requise")
      .regex(/[0-9]/, "Au moins un chiffre requis")
      .regex(
        /[^A-Za-z0-9]/,
        "Au moins un caractère spécial requis (!@#$%^&* etc.)"
      ),
    passwordAgain: z.string().min(1, "Veuillez confirmer le mot de passe"),
    accountType: z.enum(["STANDARD", "OWNER"]),
    isAcceptConditionChecked: z.boolean().refine((val) => val === true, {
      message: "Vous devez accepter les conditions générales d'utilisation",
    }),
  })
  .refine((data) => data.password === data.passwordAgain, {
    message: "Les mots de passe ne correspondent pas",
    path: ["passwordAgain"],
  });

export type LoginFormData = z.infer<typeof loginSchema>;
export type SignupFormData = z.infer<typeof signupSchema>;

// Schéma pour la mise à jour du profil
export const profileSchema = z.object({
  firstName: z
    .string()
    .min(1, "Le prénom est requis")
    .max(50, "Le prénom ne doit pas dépasser 50 caractères"),
  lastName: z
    .string()
    .min(1, "Le nom est requis")
    .max(50, "Le nom ne doit pas dépasser 50 caractères"),
  birthDate: z
    .string()
    .min(1, "La date de naissance est requise")
    .refine((date) => {
      const birthDate = new Date(date);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      return age >= 18 && age <= 120;
    }, "Vous devez avoir entre 18 et 120 ans"),
  address: z
    .string()
    .min(5, "L'adresse doit contenir au moins 5 caractères")
    .max(200, "L'adresse ne doit pas dépasser 200 caractères"),
});

// Schéma pour le changement de mot de passe
export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Le mot de passe actuel est requis"),
    newPassword: z
      .string()
      .min(8, "Le mot de passe doit contenir au moins 8 caractères")
      .regex(/[A-Z]/, "Au moins une majuscule requise")
      .regex(/[a-z]/, "Au moins une minuscule requise")
      .regex(/[0-9]/, "Au moins un chiffre requis")
      .regex(
        /[^A-Za-z0-9]/,
        "Au moins un caractère spécial requis (!@#$%^&* etc.)"
      ),
    confirmPassword: z.string().min(1, "Veuillez confirmer le mot de passe"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Les mots de passe ne correspondent pas",
    path: ["confirmPassword"],
  });

export type ProfileFormData = z.infer<typeof profileSchema>;
export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;
