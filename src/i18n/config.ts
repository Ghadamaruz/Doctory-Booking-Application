import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { DoctorLayout } from '@/components/layout/DoctorLayout';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      ar: {
        translation: {
          dashboard: 'لوحة التحكم',
          findDoctor: 'ابحث عن طبيب',
          appointments: 'المواعيد',
          medicalRecords: 'السجلات الطبية',
          messages: 'الرسائل',
          profile: 'الملف الشخصي',
          notifications: 'الإشعارات',
          logout: 'تسجيل الخروج',
          patientPortal: 'بوابة المريض',
          doctorDashboard: 'لوحة تحكم الطبيب',
          welcomeDoctor: 'مرحبًا دكتور',
          upcomingAppointments: 'المواعيد القادمة',
          patientRecords: 'سجلات المرضى',
          mySchedule: 'جدولي',
          viewAllAppointments: 'عرض الكل',
          noUpcomingAppointments: 'لا توجد مواعيد قادمة',
          noPatientRecords: 'لا توجد سجلات مرضى للعرض',
          noAvailabilitySet: 'لم يتم تحديد التوافر',
          signOut: 'تسجيل الخروج',
          welcome: 'مرحباً بك في دكتوري ',
          appDescription: 'تطبيق بسيط للحجوزات للمرضى والأطباء',
          getStarted: 'ابدأ الآن',
          welcomeUser: 'مرحباً، {name}',
          loggedInAs: 'تم تسجيل الدخول كـ {role}',
          goToDoctorDashboard: 'الذهاب إلى لوحة تحكم الطبيب',
          goToPatientDashboard: 'الذهاب إلى لوحة تحكم المريض',
          // New translations for the enhanced UI
          findRightDoctor: 'ابحث عن الطبيب المناسب',
          instantly: 'فوراً',
          searchDoctors: 'ابحث عن الأطباء حسب التخصص أو الأعراض أو الاسم - لا حاجة للتسجيل',
          searchPlaceholder: 'ابحث عن أطباء، تخصصات، أعراض...',
          search: 'بحث',
          doctorWithPatient: 'طبيب مع مريض',
          medicalEquipment: 'معدات طبية',
          hospital: 'مستشفى',
          browseAllDoctors: 'تصفح جميع الأطباء',
          noSignUpRequired: 'لا حاجة للتسجيل',
          doctorPortal: 'بوابة الطبيب',
          doctorSignIn: 'تسجيل الدخول أو التسجيل كطبيب',
          specializedCare: 'رعاية متخصصة',
          specializedCareDesc: 'تخصصات متعددة لتلبية احتياجاتك الصحية المختلفة',
          expertDiagnosis: 'تشخيص متقدم',
          expertDiagnosisDesc: 'أطباء خبراء يستخدمون أحدث التقنيات للتشخيص الدقيق',
          patientComfort: 'راحة المريض',
          patientComfortDesc: 'نركز على تجربة مريحة وبسيطة للمرضى',
          pleaseEnterSearchTerm: 'الرجاء إدخال كلمة بحث',
          enterDoctorInfo: 'أدخل اسم طبيب أو تخصص أو أعراض',
          Doctory: 'دكتوري',
          copyright: 'جميع الحقوق محفوظة',
          bookAppointment: 'حجز موعد',
          viewProfile: 'عرض الملف الشخصي',
          sortByRating: 'ترتيب حسب التقييم',
          filterResults: 'تصفية النتائج',
          noResults: 'لا توجد نتائج مطابقة للبحث'
        }
      },
      en: {
        translation: {
          dashboard: 'Dashboard',
          findDoctor: 'Find Doctor',
          appointments: 'Appointments',
          medicalRecords: 'Medical Records',
          messages: 'Messages',
          profile: 'Profile',
          notifications: 'Notifications',
          logout: 'Sign Out',
          patientPortal: 'Patient Portal',
          doctorDashboard: 'Doctor Dashboard',
          welcomeDoctor: 'Welcome, Dr.',
          upcomingAppointments: 'Upcoming Appointments',
          patientRecords: 'Patient Records',
          mySchedule: 'My Schedule',
          viewAllAppointments: 'View All',
          noUpcomingAppointments: 'No upcoming appointments',
          noPatientRecords: 'No patient records to display',
          noAvailabilitySet: 'No availability set',
          signOut: 'Sign Out',
          welcome: 'Welcome to Doctory',
          appDescription: 'A simple booking application for patients and doctors',
          getStarted: 'Get Started',
          welcomeUser: 'Welcome, {name}',
          loggedInAs: 'You are logged in as a {role}',
          goToDoctorDashboard: 'Go to Doctor Dashboard',
          goToPatientDashboard: 'Go to Patient Dashboard',
          // New translations for the enhanced UI
          findRightDoctor: 'Find the Right Doctor',
          instantly: 'Instantly',
          searchDoctors: 'Search for doctors by specialty, symptoms, or name - no account required',
          searchPlaceholder: 'Search doctors, specialties, symptoms...',
          search: 'Search',
          doctorWithPatient: 'Doctor with patient',
          medicalEquipment: 'Medical equipment',
          hospital: 'Hospital',
          browseAllDoctors: 'Browse All Doctors',
          noSignUpRequired: 'No sign up required',
          doctorPortal: 'Doctor Portal',
          doctorSignIn: 'Sign in or register as a doctor',
          specializedCare: 'Specialized Care',
          specializedCareDesc: 'Multiple specialties to address your various health needs',
          expertDiagnosis: 'Expert Diagnosis',
          expertDiagnosisDesc: 'Experienced doctors using the latest diagnostic techniques',
          patientComfort: 'Patient Comfort',
          patientComfortDesc: 'We focus on a comfortable and simple experience for patients',
          pleaseEnterSearchTerm: 'Please enter a search term',
          enterDoctorInfo: 'Enter a doctor name, specialty, or symptoms',
          Doctory: 'Doctory',
          copyright: 'All Rights Reserved',
          bookAppointment: 'Book Appointment',
          viewProfile: 'View Profile',
          sortByRating: 'Sort by Rating',
          filterResults: 'Filter Results',
          noResults: 'No matching results found'
        }
      }
    },
    fallbackLng: 'ar',
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage']
    },
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
