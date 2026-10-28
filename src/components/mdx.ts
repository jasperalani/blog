// Components available inside post content. Keep this in sync with the
// `contentComponents` list in keystatic.config.ts.
import Callout from './Callout.astro';
import TrafficAnimation from './traffic/TrafficAnimation.astro';

export const mdxComponents = { TrafficAnimation, Callout };
