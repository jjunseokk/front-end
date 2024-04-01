import MainSide from '@/components/MainSide/MainSide';
import Navigation from '../components/Navigation/Navigation';
import './globals.scss';
import { Inter } from 'next/font/google';
import AuthContext from '@/components/Auth/AuthContext';
import store from './redux/store';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: '따름 - 와인을 따르다.',
  description: '따름! 평범한 일상 와인을 따르며 즐겨보세요.',
};

import localFont from 'next/font/local';
import ReduxProvider from '@/components/Provider/ReduxProvider';

const myFont = localFont({
  src: './fonts/PretendardVariable.ttf',
  display: 'swap',
});

export default function RootLayout({ children }) {
  return (
    <html lang="kr" className={myFont.className}>
      <body>
        <AuthContext>
          <ReduxProvider>
            {children}
            <MainSide />
          </ReduxProvider>
        </AuthContext>
      </body>
    </html>
  );
}
