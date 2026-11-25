import { AuroraShader } from './aurora-shader';

/**
 * The homepage's living sky, set inside an inner-page hero card (Midnight
 * only; signature.css hides it on Clean). The shader carries its own
 * performance guards, so a slow device keeps the card's still gradient.
 */
export function HeroAurora() {
  return (
    <div className="hero-aurora" aria-hidden="true">
      <AuroraShader />
    </div>
  );
}
