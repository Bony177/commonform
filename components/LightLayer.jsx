import './effects.css';

/* 🔥 HEX → RGB CONVERTER */
function hexToRGB(hex) {
  hex = hex.replace('#', '');

  if (hex.length === 3) {
    hex = hex.split('').map(c => c + c).join('');
  }

  // Strip alpha channel if present (8-char hex → 6-char)
  if (hex.length === 8) {
    hex = hex.slice(0, 6);
  }

  const bigint = parseInt(hex, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;

  return `${r}, ${g}, ${b}`;
}

export default function LightLayer() {
  const lights = [
    {
      id: 1,
      top: '27.5%',
      left: '54.5%',
      width: 40,
      height: 80,
      blur: 50,
      opacity: 0.5,
      rotate: -3,
      color: '#eec303ff',
      intensity: 1.0,
      flickerSpeed: 4,       // seconds per cycle
      flickerDelay: 0,       // seconds before starting
      flickerStrength: 0.7,  // 0 = no flicker, 1 = full flicker (goes to 0 opacity)
    },
    {
      id: 2,
      top: '23%',
      left: '74%',
      width: 55,
      height: 30,
      blur: 40,
      opacity: 0,
      rotate: -1,
      color: '#ffffffff',
      intensity: 5.9,
      flickerSpeed: 3,
      flickerDelay: 0.5,
      flickerStrength: 0.9,
    },
    {
      id: 3,
      top: '26%',
      left: '58.5%',
      width: 30,
      height: 80,
      blur: 40,
      opacity: 0.5,
      rotate: -3,
      color: '#eec303ff',
      intensity: 1.8,
      flickerSpeed: 4,       // seconds per cycle
      flickerDelay: 0,       // seconds before starting
      flickerStrength: 0.2,  // 0 = no flicker, 1 = full flicker (goes to 0 opacity)
    },
    {
      id: 4,
      top: '28%',
      left: '62%',
      width: 40,
      height: 80,
      blur: 40,
      opacity: 0.5,
      rotate: -3,
      color: '#eec303ff',
      intensity: 1.1,
      flickerSpeed: 5,       // seconds per cycle
      flickerDelay: 0.8,       // seconds before starting
      flickerStrength: 0.8,  // 0 = no flicker, 1 = full flicker (goes to 0 opacity)
    },
  ];

  return (
    <svg 
      className="light-layer"
      viewBox="0 0 5200 2444" 
      preserveAspectRatio="xMidYMid slice" 
    >
      <foreignObject x="0" y="0" width="5200" height="2444">
        <div style={{ position: 'relative', width: '100%', height: '100%' }}>
          {lights.map((light) => (
            <div
              key={light.id}
              className="light"
              style={{
                top: light.top,
                left: light.left,
              }}
            >
              <div
                className="light-cone"
                style={{
                  width: `${light.width * 2.2}px`,
                  height: `${light.height * 2.2}px`,
                  filter: `blur(${light.blur * 2.2}px) brightness(${light.intensity})`,
              opacity: light.opacity,
              transform: `translateX(-50%) rotate(${light.rotate}deg)`,
              '--light-color': hexToRGB(light.color),
              '--intensity': light.intensity,
              '--flicker-speed': `${light.flickerSpeed || 2}s`,
              '--flicker-delay': `${light.flickerDelay || 0}s`,
              '--flicker-strength': light.flickerStrength ?? 0.7
            }}
          />
            </div>
          ))}
        </div>
      </foreignObject>
    </svg>
  );
}