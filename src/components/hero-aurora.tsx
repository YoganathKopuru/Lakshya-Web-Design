import { AuroraShader } from './aurora-shader';

/**
 * The homepage's living sky, set inside an inner-page hero card in the
 * active theme's palette. The shader carries its own performance guards, so
 * a slow device keeps the card's still gradient.
 */
export function HeroAurora() {
  return (
    <div className="hero-aurora" aria-hidden="true">
      <AuroraShader place="card" keepClear=":scope > .eyebrow, :scope > p" />
    </div>
  );
}
