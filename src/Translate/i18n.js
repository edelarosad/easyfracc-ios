// src/i18n.js
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { Settings } from 'react-native';
import UploadImage from '../views/UploadImage';
import { create } from 'react-test-renderer';

// Definir los recursos (traducciones) para cada idioma
const resources = {
  en: {
    translation: {
      login: 'Login',
      email: 'Email',
      password: 'Password',
      loginButton: 'Login',
      createAccount: 'Create account',
      toggleLanguageButton: 'Change Language',
      welcome: 'Welcome (◕‿◕)',
      nameApp:'EASYFRACC',
      name:'Name',
      projects:'Projects',
      new_project:'New Project',
      project:'View Project',
      invitacionIndividual:'Individual access pass',
      shareQR:'Share QR Code',
      QuickAccess:'Quick Access',
      MyBalance:'My Balance',
      VisitorAccess:'Access',
      AmenityReservation:'Amenity Reservation',
      Notices:'Notices',
      Settings:'Settings',
      SwitchHouse:'Switch House',
      MyHouse:'My House',
      PaymentsDebt:'🧾Payments and Debts',
      PaymentAmount:'Payment Amount',
      RecordPayment:'Record Payment',
      UploadImage:'⬆️ Upload Image',
      NotImageUploadOne:'🖼️ No image available. Please upload an image.',
      SelectImage:'📸  Choose Image',
      TicketAmount:'Ticket Amount',
      NotImageAvailable:'🖼️ No image available.',
      Cash:'🪙💵 Cash',
      name:'Name',
      email: 'Email',
      password: 'Password',
      createAccount: '👤 Create Account',
      rules: '📄 Rules',
      users : 'Users',
      user: 'User',
      nuevoPassword: 'New Password',
      passwordActual: 'Current Password',
      confirmarNuevoPassword: 'Confirm New Password',
      changePassword: 'Change Password',
      visitors: 'Visitors',
      oneday: 'One Day',
      oneweek: 'One Week',

    },
  },
  es: {
    translation: {
      login: 'Iniciar sesión',
      email: 'Correo electrónico',
      password: 'Contraseña',
      loginButton: 'Iniciar sesión',
      createAccount: 'Crear cuenta',
      toggleLanguageButton: 'Cambiar idioma',
      welcome: 'Bienvenido (◕‿◕)',
      nameApp:'EASYFRACC',
      name:'Nombre',
      projects:'Proyectos',
      new_project:'Nuevo Proyecto',
      project:'Ver Proyecto',
      invitacionIndividual:'Pase de acceso',
      shareQR:'Compartir código QR',
      QuickAccess:'Acceso rápido',
      MyBalance:'Mi saldo',
      VisitorAccess:'Acceso',
      AmenityReservation:'Reservación de amenidades',
      Notices:'Avisos',
      Settings:'Configuraciones',
      SwitchHouse:'Cambiar de casa',
      MyHouse:'Mi casa',
      PaymentsDebt:'🧾 Pagos y deudas',
      PaymentAmount:'Monto a pagar',
      RecordPayment:'Registrar pago',
      UploadImage:'⬆️ Subir imagen',
      NotImageUploadOne:'🖼️ No hay imagen disponible. Por favor sube una imagen.',
      SelectImage:'📸  Selecciona imagen',
      TicketAmount:'Monto del ticket',
      NotImageAvailable:'🖼️ No hay imagen disponible.',
      Cash:'🪙💵 Efectivo',
      name:'Nombre',
      email: 'Correo electrónico',
      password: 'Contraseña',
      createAccount: '👤 Crear cuenta',
      rules: '📄 Reglamento',
      users : 'Usuarios',
      user: 'Usuario',
      nuevoPassword: 'Nueva contraseña',
      passwordActual: 'Contraseña actual',  
      confirmarNuevoPassword: 'Confirmar nueva contraseña',
      changePassword: 'Cambiar contraseña',
      visitors: 'Visitantes',
      oneday: 'Un día',
      oneweek: 'Una semana',
    },
  },
};

// Inicializar i18next
i18n.use(initReactI18next).init({
  resources,
  lng: 'es', // Idioma predeterminado
  fallbackLng: 'en', // Idioma de respaldo si no se encuentra la traducción
  interpolation: {
    escapeValue: false, // No necesitamos escapar las cadenas
  },
});

export default i18n;
