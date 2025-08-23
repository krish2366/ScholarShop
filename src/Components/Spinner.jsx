export function DotsSpinner({ size = 'md', text = 'Loading...', showText = true }) {
  const dotSizes = {
    sm: 'w-2 h-2',
    md: 'w-3 h-3',
    lg: 'w-4 h-4',
    xl: 'w-6 h-6'
  };

  return (
    <div className="flex flex-col items-center justify-center gap-4 h-screen w-screen">
      <div className="flex space-x-2">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className={`${dotSizes[size]} rounded-full animate-bounce`}
            style={{ 
              backgroundColor: '#F47C26',
              animationDelay: `${i * 0.15}s`
            }}
          ></div>
        ))}
      </div>
      
      {showText && (
        <p className="text-base font-medium" style={{ color: '#333333' }}>
          {text}
        </p>
      )}
    </div>
  );
}