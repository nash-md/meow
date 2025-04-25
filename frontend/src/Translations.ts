export const Translations = {
  RequestHelperError: {
    en: 'Please check your setup, the RequestHelper could not determine the backend, either set VITE_URL or the windows object needs to be set',
    fr: "Veuillez vérifier votre configuration, le RequestHelper n'a pas pu déterminer le backend, définissez VITE_URL ou l'objet window doit être défini",
  },

  SessionTypeError: {
    en: 'Your session could not be validated, the page was unable to communicate with the server',
    fr: "Votre session n'a pas pu être validée, la page n'a pas pu communiquer avec le serveur",
  },

  SessionTimeoutError: {
    en: 'Your session could not be validated, the connection to the server timed out',
    fr: "Votre session n'a pas pu être validée, la connexion avec le serveur a expiré",
  },

  SessionExpiredError: {
    en: 'Your session has expired. Please log in again to continue',
    fr: 'Votre session a expiré. Veuillez vous reconnecter pour continuer',
  },

  SessionUnhandledError: {
    en: 'Sorry, but we did not expect this to happen, check JS Console',
    fr: "Désolé, quelque chose d'inattendu s'est produit. Vérifiez la console JS",
  },

  BoardTitle: {
    en: 'Deal',
    fr: 'Affaire',
  },

  BoardTitlePlural: {
    en: 'Deals',
    fr: 'Affaires',
  },

  SetupChangedConfirmation: {
    en: 'Configuration saved...',
    fr: 'Configuration enregistrée...',
  },

  PasswordChangedConfirmation: {
    en: 'Password changed...',
    fr: 'Mot de passe modifié...',
  },

  IntegrationChangedConfirmation: {
    en: 'Integration changed...',
    fr: 'Intégration modifiée...',
  },

  CardCreatedConfirmation: {
    en: 'Opportunity created...',
    fr: 'Opportunité créée...',
  },

  CardUpdatedConfirmation: {
    en: 'Opportunity updated...',
    fr: 'Opportunité mise à jour...',
  },

  AccountCreatedConfirmation: {
    en: 'Account created...',
    fr: 'Compte créé...',
  },

  AccountUpdatedConfirmation: {
    en: 'Account updated...',
    fr: 'Compte mis à jour...',
  },

  OpportunityAmount: {
    en: 'Amount',
    fr: 'Montant',
  },

  OpportunityAmountInvalid: {
    en: 'Invalid Amount',
    fr: 'Montant invalide',
  },

  // Login page translations
  ScreenResolutionWarning: {
    en: 'This application is built for desktops, small screens are not supported.',
    fr: 'Cette application est conçue pour les ordinateurs de bureau, les petits écrans ne sont pas pris en charge.',
  },

  // Greetings for cursor headline
  Greetings: {
    en: ['Hello!', 'Hallo!', 'Hej!', 'こんにち', 'Hola!'],
    fr: ['Bonjour!', 'Salut!', 'Coucou!', 'Bienvenue!', 'Enchanté!'],
  },

  // Login and Register form translations
  LoginTab: {
    en: 'Login',
    fr: 'Connexion',
  },

  RegisterTab: {
    en: 'Register',
    fr: 'Inscription',
  },

  PasswordLabel: {
    en: 'Password',
    fr: 'Mot de passe',
  },

  LoginButton: {
    en: 'Login',
    fr: 'Se connecter',
  },

  RegisterButton: {
    en: 'Register',
    fr: 'S\'inscrire',
  },

  // RegisterWithInvite translations
  InvalidInviteLink: {
    en: 'The invite link you used was invalid. Please check if you added or removed characters, if this does not help check with the person who invited you.',
    fr: 'Le lien d\'invitation que vous avez utilisé n\'est pas valide. Veuillez vérifier si vous avez ajouté ou supprimé des caractères, si cela ne vous aide pas, vérifiez auprès de la personne qui vous a invité.',
  },

  LeaveSignUp: {
    en: 'Leave Sign Up',
    fr: 'Quitter l\'inscription',
  },

  InviteLinkInstruction: {
    en: 'You register with an invite link, your name is already set, just define your password.',
    fr: 'Vous vous inscrivez avec un lien d\'invitation, votre nom est déjà défini, définissez simplement votre mot de passe.',
  },

  NoPasswordReset: {
    en: 'There is no password reset so you better remember!',
    fr: 'Il n\'y a pas de réinitialisation de mot de passe, alors n\'oubliez pas!',
  },

  // Error messages
  ErrorParsingResponse: {
    en: 'Error parsing server response',
    fr: 'Erreur lors de l\'analyse de la réponse du serveur',
  },

  ErrorParsingResponseWithMessage: {
    en: 'Error parsing server response: {0}',
    fr: 'Erreur lors de l\'analyse de la réponse du serveur: {0}',
  },

  RequestTimeoutErrorMessage: {
    en: 'Request Timeout Error, is your backend available?',
    fr: 'Erreur de délai d\'attente de la requête, votre backend est-il disponible?',
  },

  InvalidJsonResponse: {
    en: 'Server response is no valid JSON',
    fr: 'La réponse du serveur n\'est pas un JSON valide',
  },

  NetworkRequestFailed: {
    en: 'Network Request Failed, is your backend available?',
    fr: 'La requête réseau a échoué, votre backend est-il disponible?',
  },

  UnknownError: {
    en: 'Failed: unknown, check JS Console',
    fr: 'Échec: inconnu, vérifiez la console JS',
  },

  // Button translations
  AddButton: {
    en: 'Add',
    fr: 'Ajouter',
  },

  SaveButton: {
    en: 'Save',
    fr: 'Enregistrer',
  },

  CloseButton: {
    en: 'Close',
    fr: 'Fermer',
  },

  AssignButton: {
    en: 'Assign',
    fr: 'Assigner',
  },

  // Filter buttons
  RecentlyUpdatedFilter: {
    en: 'Recently Updated',
    fr: 'Récemment mis à jour',
  },

  OnlyMyOpportunitiesFilter: {
    en: 'Only My Opportunities',
    fr: 'Seulement mes opportunités',
  },

  RequiresUpdateFilter: {
    en: 'Requires Update',
    fr: 'Nécessite une mise à jour',
  },

  // Search placeholder
  SearchPlaceholder: {
    en: 'Search by name or stage',
    fr: 'Rechercher par nom ou étape',
  },

  // Tab titles
  OpportunityTab: {
    en: 'Opportunity',
    fr: 'Opportunité',
  },

  HistoryTab: {
    en: 'History',
    fr: 'Historique',
  },

  // Form labels
  NameLabel: {
    en: 'Name',
    fr: 'Nom',
  },

  NextFollowUpLabel: {
    en: 'Next Follow Up',
    fr: 'Prochain suivi',
  },

  ExpectedCloseDateLabel: {
    en: 'Expected Close Date',
    fr: 'Date de clôture prévue',
  },

  // Messages
  OpportunityClosedMessage: {
    en: 'This opportunity is closed, do you want to unlock?',
    fr: 'Cette opportunité est fermée, voulez-vous la déverrouiller?',
  },

  // Page titles and labels
  AccountsTitle: {
    en: 'Accounts',
    fr: 'Comptes',
  },

  CreatedAtLabel: {
    en: 'Created At',
    fr: 'Créé le',
  },

  CreatedLabel: {
    en: 'Created:',
    fr: 'Créé:',
  },

  // Activity page
  RangeLabel: {
    en: 'Range',
    fr: 'Période',
  },

  TodayOption: {
    en: 'Today',
    fr: 'Aujourd\'hui',
  },

  ThisWeekOption: {
    en: 'This Week',
    fr: 'Cette Semaine',
  },

  Last90DaysOption: {
    en: 'Last 90 Days',
    fr: 'Derniers 90 Jours',
  },

  // Forecast page
  ReportLabel: {
    en: 'Report',
    fr: 'Rapport',
  },

  ForecastOption: {
    en: 'Forecast',
    fr: 'Prévision',
  },

  SalesPipelineTrendOption: {
    en: 'Sales Pipeline Trend',
    fr: 'Tendance du Pipeline de Ventes',
  },

  SalesPipelineGeneratedOption: {
    en: 'Sales Pipeline Generated',
    fr: 'Pipeline de Ventes Généré',
  },

  UserLabel: {
    en: 'User',
    fr: 'Utilisateur',
  },

  CloseDateLabel: {
    en: 'Close Date',
    fr: 'Date de Clôture',
  },

  // Setup page
  DeveloperModeLabel: {
    en: 'Developer Mode',
    fr: 'Mode Développeur',
  },

  DownloadApiDefinitionLabel: {
    en: 'Download API Definition',
    fr: 'Télécharger la Définition de l\'API',
  },

  // Offline message
  YouAreOffline: {
    en: 'You are offline',
    fr: 'Vous êtes hors ligne',
  },

  // Search by name
  SearchByNamePlaceholder: {
    en: 'Search by Name',
    fr: 'Rechercher par Nom',
  },

  // User management
  UserCreatedConfirmation: {
    en: 'User created',
    fr: 'Utilisateur créé',
  },

  CreateNewUserTitle: {
    en: 'Create New User',
    fr: 'Créer un Nouvel Utilisateur',
  },

  CreateButton: {
    en: 'Create',
    fr: 'Créer',
  },

  UsersTitle: {
    en: 'Users',
    fr: 'Utilisateurs',
  },

  StatusLabel: {
    en: 'Status',
    fr: 'Statut',
  },

  InviteLabel: {
    en: 'Invite',
    fr: 'Invitation',
  },

  CopyInviteButton: {
    en: 'Copy Invite',
    fr: 'Copier l\'Invitation',
  },

  DeleteUserConfirmation: {
    en: 'Delete user?',
    fr: 'Supprimer l\'utilisateur?',
  },

  DeleteButton: {
    en: 'delete',
    fr: 'supprimer',
  },

  // Password management
  ChangeYourPasswordTitle: {
    en: 'Change Your Password',
    fr: 'Changer Votre Mot de Passe',
  },

  CurrentPasswordLabel: {
    en: 'Current Password',
    fr: 'Mot de Passe Actuel',
  },

  NewPasswordLabel: {
    en: 'New Password',
    fr: 'Nouveau Mot de Passe',
  },

  CurrentPasswordInvalidError: {
    en: 'Current Password is invalid',
    fr: 'Le mot de passe actuel est invalide',
  },

  // User setup
  AnimalQuestionTitle: {
    en: 'If You Were An Animal What Would You Be?',
    fr: 'Si Vous Étiez un Animal, Lequel Seriez-Vous?',
  },

  AnimalInfoShared: {
    en: 'This information will definitely be shared with your coworkers',
    fr: 'Cette information sera définitivement partagée avec vos collègues',
  },

  HorseOption: {
    en: 'Horse',
    fr: 'Cheval',
  },

  RaccoonOption: {
    en: 'Raccoon',
    fr: 'Raton Laveur',
  },

  CatOption: {
    en: 'Cat',
    fr: 'Chat',
  },

  DogOption: {
    en: 'Dog',
    fr: 'Chien',
  },

  BirdOption: {
    en: 'Bird',
    fr: 'Oiseau',
  },

  NoAnswerOption: {
    en: 'I don\'t want to answer',
    fr: 'Je ne veux pas répondre',
  },

  CareerWarning: {
    en: 'Warning: This answer will slow down your career progression.',
    fr: 'Attention: Cette réponse ralentira votre progression de carrière.',
  },

  YourColorLabel: {
    en: 'Your Color',
    fr: 'Votre Couleur',
  },

  // Currency
  CurrencyTitle: {
    en: 'Currency',
    fr: 'Devise',
  },

  USDollarOption: {
    en: 'US Dollar',
    fr: 'Dollar Américain',
  },

  EuroOption: {
    en: 'Euro',
    fr: 'Euro',
  },

  SwedishKronaOption: {
    en: 'Swedish Krona',
    fr: 'Couronne Suédoise',
  },

  UnsupportedValueError: {
    en: 'Unsupported value: {0}',
    fr: 'Valeur non prise en charge: {0}',
  },

  TeamNotSetError: {
    en: 'Team not set',
    fr: 'Équipe non définie',
  },

  // Account
  AccountTab: {
    en: 'Account',
    fr: 'Compte',
  },

  // Lane
  HideOpportunitiesMessage: {
    en: 'Hide opportunities when closed for more than',
    fr: 'Masquer les opportunités fermées depuis plus de',
  },

  NeverOption: {
    en: 'never',
    fr: 'jamais',
  },

  DaysLabel: {
    en: 'days.',
    fr: 'jours.',
  },

  ExcludeFromForecastLabel: {
    en: 'Exclude from Forecast',
    fr: 'Exclure des Prévisions',
  },

  ChangesSavedMessage: {
    en: 'Changes saved',
    fr: 'Modifications enregistrées',
  },

  // Team registration
  WelcomeMessage: {
    en: 'Welcome to our Meow! Before you dive in, take a moment to configure how you\'d like your workspace to function',
    fr: 'Bienvenue sur notre Meow! Avant de commencer, prenez un moment pour configurer le fonctionnement de votre espace de travail',
  },

  TeamRegistrationQuestion: {
    en: 'Would you like to allow other people to register and create their own teams on your workspace? Remember that regardless of your choice, you will still have the ability to manage your own team and add individual users to it. This decision simply affects the creation of new teams by others.',
    fr: 'Souhaitez-vous autoriser d\'autres personnes à s\'inscrire et à créer leurs propres équipes sur votre espace de travail? N\'oubliez pas que, quel que soit votre choix, vous aurez toujours la possibilité de gérer votre propre équipe et d\'y ajouter des utilisateurs individuels. Cette décision affecte simplement la création de nouvelles équipes par d\'autres.',
  },

  AllowTeamRegistrationsButton: {
    en: 'Allow Team Registrations',
    fr: 'Autoriser les Inscriptions d\'Équipe',
  },

  RestrictToMyTeamButton: {
    en: 'Restrict to My Team Only',
    fr: 'Restreindre à Mon Équipe Uniquement',
  },
};
