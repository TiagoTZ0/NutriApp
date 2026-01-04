export type RootStackParamList = {
  Landing: undefined;
  Welcome: { intent: 'LOGIN' | 'REGISTER' };
  Login: { targetRole: 'PATIENT' | 'PROFESSIONAL' };
  ProfessionalHome: undefined; // La pantalla principal del nutri
  SelectTermsPolScreen: undefined; // El modal
};