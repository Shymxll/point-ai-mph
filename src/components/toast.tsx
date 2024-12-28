import React from 'react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert'; // Kendi alert bileşenlerinizi buraya ekleyin
import {  TriangleAlert } from 'lucide-react';

interface ToastProps {
  message: string;
  type: 'default' | 'success' | 'error';
}

const Toast: React.FC<ToastProps> = ({ message, type }) => {
  if (!message) return null;

  return (

      <Alert
        className={`absolute bottom-0 right-0 m-4 w-96 rounded-md bg-blur-2xl bg-transparent
          ${type === 'success' ? 'border-green-500' : 'bg-red-500'}
            
            
          `}
        variant="destructive"

      >
        <TriangleAlert className='text-red' 
            fill='white'
        />
        <AlertTitle className='text-white font-bold'>
          {type === 'success' ? 'Başarılı' : 'Hata'}
        </AlertTitle>
        <AlertDescription className='text-white'>
          {message}
        </AlertDescription>
      </Alert>
  );
};

export default Toast;