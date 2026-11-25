import {
  Children,
  cloneElement,
  isValidElement,
  type CSSProperties,
  type ReactElement,
  type ReactNode,
} from 'react';

/**
 * "Curtain up" headline: every word rises into place from behind its own
 * mask on a soft spring, a few dozen milliseconds after the one before it.
 *
 * The words are split here, on the server, so the heading arrives already
 * masked and the animation is plain CSS (signature.css): nothing flashes
 * before JavaScript loads, and reduced motion simply shows the text.
 * Nested markup (line breaks, muted spans, emphasis) is kept as it is.
 */
export function Curtain({
  children,
  delay = 0,
}: {
  children: ReactNode;
  /** Seconds before the first word rises. */
  delay?: number;
}) {
  let index = 0;

  const split = (text: string) =>
    text.split(/(\s+)/).map((part) => {
      if (!part) return null;
      if (/^\s+$/.test(part)) return ' ';
      const order = index++;
      return (
        <span
          key={`w${order}`}
          className="curtain-word"
          style={{ '--i': order } as CSSProperties}
        >
          <span>{part}</span>
        </span>
      );
    });

  const wrap = (nodes: ReactNode): ReactNode =>
    Children.map(nodes, (node) => {
      if (typeof node === 'string' || typeof node === 'number')
        return split(String(node));
      if (isValidElement(node)) {
        const element = node as ReactElement<{ children?: ReactNode }>;
        if (element.props.children == null) return element;
        return cloneElement(element, undefined, wrap(element.props.children));
      }
      return node;
    });

  return (
    <span
      className="curtain"
      style={{ '--curtain-delay': `${delay}s` } as CSSProperties}
    >
      {wrap(children)}
    </span>
  );
}
