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
      top: '30%',
      left: '55%',
      width: 40,
      height: 100,
      blur: 40,
      opacity: 0.5,
      rotate: -3,
      color: '#eece03ff',
      intensity: 1.0,
      flickerSpeed: 2,       // seconds per cycle
      flickerDelay: 0,       // seconds before starting
      flickerStrength: 0.7,  // 0 = no flicker, 1 = full flicker (goes to 0 opacity)
    },
    {
      id: 2,
      top: '35%',
      left: '70%',
      width: 80,
      height: 360,
      blur: 30,
      opacity: 0,
      rotate: -1,
      color: '#d5ff06ff',
      intensity: 1,
      flickerSpeed: 3,
      flickerDelay: 0.5,
      flickerStrength: 0.5,
    }
  ];

  return (
    <div className="light-layer">
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
              width: `${light.width}px`,
              height: `${light.height}px`,
              filter: `blur(${light.blur}px) brightness(${light.intensity})`,
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
  );
}