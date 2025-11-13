// import './globals.css';
// import { Inter } from 'next/font/google';
// import { Toaster } from 'react-hot-toast';
// import AuthProvider from '@/components/AuthProvider';

// const inter = Inter({ subsets: ['latin'] });

// export const metadata = {
//   title: 'Dashboard Anti-No-Show',
//   description: 'Gestion et suivi des rendez-vous',
// };

// export default function RootLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   return (
//     <html lang="fr">
//       <body className={inter.className}>
//         <AuthProvider>
//           {children}
//           <Toaster
//             position="top-right"
//             toastOptions={{
//               duration: 3000,
//               style: {
//                 background: '#363636',
//                 color: '#fff',
//               },
//               success: {
//                 duration: 3000,
//                 iconTheme: {
//                   primary: '#10b981',
//                   secondary: '#fff',
//                 },
//               },
//               error: {
//                 duration: 4000,
//                 iconTheme: {
//                   primary: '#ef4444',
//                   secondary: '#fff',
//                 },
//               },
//             }}
//           />
//         </AuthProvider>
//       </body>
//     </html>
//   );
// }



import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Toaster } from 'react-hot-toast';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Anti-No-Show Dashboard',
  description: 'Gestion des rendez-vous et confirmations',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body className={inter.className}>
        {children}
        <Toaster position="top-right" />
      </body>
    </html>
  );
}
