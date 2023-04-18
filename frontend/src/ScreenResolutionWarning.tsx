import React, { useState, useEffect } from 'react';

interface ScreenResolutionWarningProps {
  message: string;
}

const userAgent = navigator.userAgent || navigator.vendor;

const ScreenResolutionWarning: React.FC<ScreenResolutionWarningProps> = ({
  message,
}) => {
  const [isSmartphone, setIsSmartphone] = useState<boolean>(false);

  const checkIsSmartphone = () => {
    const isAndroid = /android/i.test(userAgent);
    const isIOS = /(iPhone|iPod)/.test(userAgent);

    return isAndroid || isIOS;
  };

  useEffect(() => {
    setIsSmartphone(checkIsSmartphone());
  }, []);

  return (
    <>
      {isSmartphone && (
        <div className="screen-resolution-warning">{message}</div>
      )}
    </>
  );
};

export default ScreenResolutionWarning;
