import React from 'react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert'; // Kendi alert bileşenlerinizi buraya ekleyin
import {  Check, CheckCircle, TriangleAlert } from 'lucide-react';

interface ToastProps {
  message: string;
  type: 'default' | 'success' | 'error';
}

const Toast: React.FC<ToastProps> = ({ message, type }) => {
  if (!message) return null;

  return (

      <Alert
        className={`absolute bottom-0 right-0 m-4 w-96 rounded-md bg-blur-2xl bg-transparent z-50
          ${type === 'success' ? 'border-green-500 bg-green-500' : 'bg-red-500'}
            
            
          `}
        variant={type === 'success' ? 'destructive' : 'default'}
        

      >
        {
          type === 'success' ? (
            <CheckCircle className='text-white border-white bg-green-500' 
            fill='green'
            size={20}
            stroke='white'
            />
          ) : (
            <TriangleAlert className='text-red-500 bg-red-500 ' 
            fill='red'
            size={20}
            stroke='white'

            />
          )
        }
        <AlertTitle className='text-white font-bold '>
          {type === 'success' ? 'Başarılı' : 'Hata'}
        </AlertTitle>
        <AlertDescription className='text-white'>
          {message}
        </AlertDescription>
      </Alert>
  );
};

export default Toast;